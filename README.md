# SpicyBeats - Electronics Deal Aggregation Platform

SpicyBeats is a comprehensive electronics deal aggregation platform tailored for the Indian market, featuring location-based filtering and admin-promoted deals.

## Features

### Core Features
- **Electronics Deal Aggregation**: Community-driven deal submissions with voting system
- **Location-Based Filtering**: Users can filter deals by city/location
- **Admin-Promoted Deals**: Highlighted sponsored deals for monetization
- **Price Tracking**: Historical price data and deal verification
- **Mobile-First Design**: Optimized for Indian mobile users
- **Real-time Updates**: Live deal updates and notifications

### Technical Features
- **Next.js 14**: Modern React framework with TypeScript
- **Supabase**: PostgreSQL database with real-time capabilities
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Works seamlessly across all devices
- **SEO Optimized**: Server-side rendering for better search visibility

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spicybeats.git
cd spicybeats
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
```sql
-- Run the SQL schema from /docs/database-schema.sql
```

5. Start the development server:
```bash
npm run dev
```

## Database Schema

The platform uses the following main tables:
- `electronics_deals`: Core deal information with location and promotion fields
- `users`: User authentication and profiles
- `user_locations`: User location preferences
- `price_history`: Historical pricing data

## Monetization Strategy

1. **Affiliate Commissions** (50%): Amazon, Flipkart, local store partnerships
2. **Display Advertising** (20%): Targeted electronics ads
3. **Premium Features** (30%): SpicyBeats Pro subscription and promoted deals

## Mobile Apps (Planned)

React Native apps for Android and iOS are planned with:
- Push notifications for deal alerts
- Enhanced location services
- Offline caching
- Native UI/UX optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@spicybeats.in or join our community Discord.