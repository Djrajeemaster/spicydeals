/*
  # SpicyBeats Database Schema

  1. New Tables
    - `users` - User profiles with role-based access
    - `electronics_deals` - Core deals table with location and promotion fields
    - `user_locations` - User location preferences
    - `price_history` - Historical pricing data for deals
    - `deal_votes` - User voting on deals

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin role-based access for deal management

  3. Functions
    - Vote handling with conflict resolution
    - Deal promotion management
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User locations for personalized deals
CREATE TABLE IF NOT EXISTS user_locations (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  preferred_city text,
  preferred_pincode text,
  last_known_latitude decimal,
  last_known_longitude decimal,
  updated_at timestamptz DEFAULT now()
);

-- Electronics deals table
CREATE TABLE IF NOT EXISTS electronics_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  model_number text,
  brand text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  original_price decimal NOT NULL,
  deal_price decimal NOT NULL,
  discount_percentage integer GENERATED ALWAYS AS (
    ROUND(((original_price - deal_price) / original_price * 100)::numeric)
  ) STORED,
  merchant text NOT NULL,
  deal_url text NOT NULL,
  image_url text,
  specs jsonb DEFAULT '{}',
  warranty_info text,
  expires_at timestamptz,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_promoted boolean DEFAULT false,
  promotion_order integer DEFAULT 0,
  deal_type text DEFAULT 'online' CHECK (deal_type IN ('online', 'physical')),
  store_name text,
  address text,
  city text,
  state text,
  pincode text,
  latitude decimal,
  longitude decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Price history for tracking deal changes
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES electronics_deals(id) ON DELETE CASCADE,
  price decimal NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Deal votes to track user voting
CREATE TABLE IF NOT EXISTS deal_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES electronics_deals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  vote_type text CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE electronics_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_votes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- User locations policies
CREATE POLICY "Users can manage own location"
  ON user_locations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Electronics deals policies
CREATE POLICY "Anyone can read deals"
  ON electronics_deals
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create deals"
  ON electronics_deals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own deals"
  ON electronics_deals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can update any deal"
  ON electronics_deals
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Price history policies
CREATE POLICY "Anyone can read price history"
  ON price_history
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "System can insert price history"
  ON price_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Deal votes policies
CREATE POLICY "Users can read all votes"
  ON deal_votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own votes"
  ON deal_votes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions for vote handling
CREATE OR REPLACE FUNCTION vote_deal(deal_id uuid, vote_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update vote
  INSERT INTO deal_votes (deal_id, user_id, vote_type)
  VALUES (deal_id, auth.uid(), vote_type)
  ON CONFLICT (deal_id, user_id)
  DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = now();
  
  -- Update deal vote counts
  UPDATE electronics_deals
  SET 
    upvotes = (
      SELECT COUNT(*) FROM deal_votes 
      WHERE deal_votes.deal_id = electronics_deals.id 
      AND vote_type = 'up'
    ),
    downvotes = (
      SELECT COUNT(*) FROM deal_votes 
      WHERE deal_votes.deal_id = electronics_deals.id 
      AND vote_type = 'down'
    )
  WHERE id = deal_id;
END;
$$;

-- Function to promote deals (admin only)
CREATE OR REPLACE FUNCTION promote_deal(deal_id uuid, promoted boolean, promotion_order integer DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can promote deals';
  END IF;
  
  -- Update deal promotion status
  UPDATE electronics_deals
  SET 
    is_promoted = promoted,
    promotion_order = CASE WHEN promoted THEN promotion_order ELSE 0 END,
    updated_at = now()
  WHERE id = deal_id;
END;
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_electronics_deals_category ON electronics_deals(category);
CREATE INDEX IF NOT EXISTS idx_electronics_deals_brand ON electronics_deals(brand);
CREATE INDEX IF NOT EXISTS idx_electronics_deals_city ON electronics_deals(city);
CREATE INDEX IF NOT EXISTS idx_electronics_deals_promoted ON electronics_deals(is_promoted, promotion_order);
CREATE INDEX IF NOT EXISTS idx_electronics_deals_created_at ON electronics_deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_votes_deal_id ON deal_votes(deal_id);
CREATE INDEX IF NOT EXISTS idx_price_history_deal_id ON price_history(deal_id, recorded_at DESC);

-- Insert sample data
INSERT INTO users (id, email, name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@spicybeats.in', 'Admin User', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440001', 'user@spicybeats.in', 'Regular User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample deals
INSERT INTO electronics_deals (
  id, title, brand, category, description, original_price, deal_price,
  merchant, deal_url, image_url, city, state, is_promoted, promotion_order,
  created_by, upvotes, downvotes, is_verified
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440010',
    'iPhone 15 Pro Max 256GB - Natural Titanium',
    'Apple',
    'Mobiles',
    'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    159900,
    149900,
    'Amazon',
    'https://amazon.in/iphone-15-pro-max',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Mumbai',
    'Maharashtra',
    true,
    1,
    '550e8400-e29b-41d4-a716-446655440001',
    45,
    3,
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440011',
    'Samsung Galaxy S24 Ultra 512GB - Titanium Black',
    'Samsung',
    'Mobiles',
    'Flagship Samsung phone with S Pen, 200MP camera, and AI features.',
    139999,
    119999,
    'Flipkart',
    'https://flipkart.com/samsung-s24-ultra',
    'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Delhi',
    'Delhi',
    false,
    0,
    '550e8400-e29b-41d4-a716-446655440001',
    32,
    1,
    true
  )
ON CONFLICT (id) DO NOTHING;