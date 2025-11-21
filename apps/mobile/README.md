# Total Audio Promo Mobile App

A React Native mobile application for the Total Audio Promo platform, allowing artists and agencies to manage their music promotion campaigns on the go.

## Features

- **Dashboard**: Overview of campaign performance and key metrics
- **Campaigns**: Manage and track music promotion campaigns
- **Contacts**: Industry contact management
- **Analytics**: Real-time campaign analytics and insights

## Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. For iOS (macOS only):

   ```bash
   cd ios && pod install && cd ..
   ```

3. Start the Metro bundler:

   ```bash
   npm start
   ```

4. Run on device/simulator:

   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android
   ```

## Project Structure

```
src/
 components/     # Reusable UI components
 screens/        # Screen components
    DashboardScreen.tsx
    CampaignsScreen.tsx
    ContactsScreen.tsx
    AnalyticsScreen.tsx
 services/       # API services
 utils/          # Utility functions
 App.tsx         # Main app component
 index.tsx       # App entry point
```

## Development

This mobile app is designed to work with the Total Audio Promo backend API. Make sure the backend is running and accessible before testing the mobile app features.

## Branding

- **Primary Color**: #f6ab00 (Yellow)
- **Secondary Color**: #2538c7 (Blue)
- **Font**: Inter (system default)

## Contributing

1. Follow the existing code style
2. Test on both iOS and Android
3. Ensure accessibility compliance
4. Update documentation as needed
