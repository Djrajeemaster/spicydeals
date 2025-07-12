export interface Deal {
  id: string;
  title: string;
  model_number?: string;
  brand: string;
  category: string;
  description: string;
  original_price: number;
  deal_price: number;
  discount_percentage: number;
  merchant: string;
  deal_url: string;
  image_url: string;
  specs?: Record<string, any>;
  warranty_info?: string;
  expires_at?: string;
  created_by: string;
  upvotes: number;
  downvotes: number;
  is_verified: boolean;
  created_at: string;
  deal_type: 'online' | 'physical';
  store_name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  is_promoted: boolean;
  promotion_order: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserLocation {
  user_id: string;
  preferred_city?: string;
  preferred_pincode?: string;
  last_known_latitude?: number;
  last_known_longitude?: number;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  deal_id: string;
  price: number;
  recorded_at: string;
}

export interface DealFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  dealType?: 'online' | 'physical' | 'all';
  sortBy?: 'newest' | 'discount' | 'price_low' | 'price_high' | 'popular';
}