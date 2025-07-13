# SpicyBeats Setup Guide

## 🗄️ Database Setup

### Step 1: Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Name**: SpicyBeats
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users (e.g., ap-south-1 for India)

### Step 2: Run Database Migration
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `supabase/migrations/create_initial_schema.sql`
3. Paste it in the SQL Editor and click **Run**
4. This will create all tables, policies, and sample data

### Step 3: Get API Credentials
1. Go to **Settings > API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., https://abcdefgh.supabase.co)
   - **anon/public key** (starts with eyJ...)

### Step 4: Configure Environment Variables
1. Rename `.env.example` to `.env`
2. Update the values:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📱 Mobile App Setup

### Step 1: Install Dependencies
```bash
cd mobile-app
npm install
```

### Step 2: Install Expo CLI
```bash
npm install -g @expo/cli
npm install -g eas-cli
```

### Step 3: Configure Environment
1. Copy `mobile-app/.env.example` to `mobile-app/.env`
2. Use the same Supabase credentials as web app:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Development Testing
```bash
# Start Expo development server
cd mobile-app
npm start

# Run on specific platforms
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

### Step 5: EAS Build Setup (for App Store deployment)
```bash
# Login to Expo
eas login

# Configure project
eas build:configure

# Build for testing
eas build --platform android --profile preview
eas build --platform ios --profile preview

# Build for production
eas build --platform all --profile production
```

## 🔧 Additional Services Setup

### Google Maps API (for location services)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Geocoding API**
4. Create API key and add to environment variables

### Firebase (for push notifications)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Add Android and iOS apps
4. Download config files and add to mobile app
5. Enable **Cloud Messaging**

## 🚀 Deployment

### Web App (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Mobile App (App Stores)
```bash
# Build production apps
eas build --platform all --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 🧪 Testing

### Web App
```bash
npm run dev
```
- Open http://localhost:5173
- Test deal submission, voting, filtering
- Test admin dashboard (click Admin button)

### Mobile App
```bash
cd mobile-app
npm start
```
- Scan QR code with Expo Go app
- Test all screens and navigation
- Test on both iOS and Android

## 📊 Admin Access

### Default Admin Account
- **Email**: admin@spicybeats.in
- **Password**: Set up through Supabase Auth

### Admin Features
- Deal promotion/demotion
- Deal verification
- User management
- Analytics dashboard

## 🔐 Security Checklist

- [ ] Update default passwords
- [ ] Configure RLS policies
- [ ] Set up proper CORS
- [ ] Add rate limiting
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerts

## 📈 Analytics Setup

### Mixpanel (recommended)
1. Create account at [Mixpanel](https://mixpanel.com/)
2. Get project token
3. Add to environment variables

### Google Analytics
1. Create GA4 property
2. Get measurement ID
3. Add to environment variables

## 🎯 Next Steps

1. **Content**: Add more sample deals
2. **SEO**: Configure meta tags and sitemap
3. **Performance**: Set up CDN and caching
4. **Marketing**: Launch user acquisition campaigns
5. **Monetization**: Set up affiliate programs

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
- Check Supabase URL and key
- Verify RLS policies are set correctly

**Mobile App Build Fails**
- Update Expo CLI: `npm install -g @expo/cli@latest`
- Clear cache: `expo r -c`

**Location Services Not Working**
- Enable location permissions
- Check Google Maps API key

### Support
- Documentation: [Supabase Docs](https://supabase.com/docs)
- Community: [Expo Discord](https://discord.gg/expo)
- Issues: Create GitHub issue in project repo