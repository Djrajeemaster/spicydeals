# SpicyBeats Mobile App

React Native mobile application for SpicyBeats - India's premier electronics deal aggregation platform.

## Features

- **Native Mobile Experience**: Optimized for iOS and Android devices
- **Deal Discovery**: Browse and search electronics deals with intuitive mobile UI
- **Location-Based Filtering**: Find deals near your location
- **Push Notifications**: Get instant alerts for new deals and price drops
- **Offline Support**: Basic functionality available without internet
- **Thumbs Up/Down Voting**: Community-driven deal curation
- **Detailed Deal Views**: Comprehensive product information and specifications

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6
- **UI Components**: React Native Paper
- **Icons**: Expo Vector Icons
- **State Management**: Zustand (shared with web app)
- **Backend**: Supabase (shared with web app)
- **Styling**: NativeWind (Tailwind for React Native)

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. Navigate to the mobile app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/          # Main app screens
│   │   ├── DealsScreen.tsx
│   │   ├── DealDetailScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── FiltersScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API and external services
│   └── utils/           # Utility functions
├── assets/              # Images, fonts, etc.
├── App.tsx             # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies and scripts
```

## Key Features Implementation

### 1. Deal Cards (Mobile Optimized)
- Compact layout for mobile screens
- Essential information prominently displayed
- Tap to view full details
- Thumbs up/down voting

### 2. Navigation
- Bottom tab navigation for main sections
- Stack navigation for detailed views
- Smooth transitions and native feel

### 3. Search & Filters
- Dedicated search screen with suggestions
- Comprehensive filtering options
- Category-based browsing
- Recent and popular searches

### 4. Location Services
- GPS-based location detection
- City-specific deal filtering
- Permission handling

### 5. Push Notifications
- Deal alerts and price drop notifications
- Configurable notification preferences
- Firebase Cloud Messaging integration

## Building for Production

### Android

1. Build APK/AAB:
```bash
npm run build:android
```

2. Submit to Google Play Store:
```bash
npm run submit:android
```

### iOS

1. Build IPA:
```bash
npm run build:ios
```

2. Submit to App Store:
```bash
npm run submit:ios
```

## Environment Variables

Create a `.env` file in the mobile-app directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## App Store Preparation

### Required Assets
- App icon (1024x1024)
- Splash screen
- Screenshots for various device sizes
- App description and keywords
- Privacy policy URL

### Store Listings
- **Google Play Store**: Detailed app description, screenshots, feature graphic
- **Apple App Store**: App preview videos, screenshots, app description

## Performance Optimization

- Image optimization and lazy loading
- Efficient list rendering with FlatList
- Proper memory management
- Offline caching for critical data

## Testing

- Unit tests for utility functions
- Integration tests for API calls
- UI testing with Detox
- Device testing on various screen sizes

## Deployment

The app uses Expo Application Services (EAS) for building and deployment:

1. **Development**: Expo Go app for rapid testing
2. **Staging**: Internal distribution builds
3. **Production**: App store releases

## Contributing

1. Follow React Native best practices
2. Use TypeScript for type safety
3. Follow the established component structure
4. Test on both iOS and Android
5. Ensure accessibility compliance

## Support

For mobile app specific issues:
- Check Expo documentation
- Review React Native guides
- Test on physical devices
- Monitor crash reports and analytics

## Future Enhancements

- Biometric authentication
- Dark mode support
- Offline deal caching
- Social sharing features
- In-app purchase for premium features
- AR product visualization