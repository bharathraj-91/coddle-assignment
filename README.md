# Coddle - Baby Growth Tracker

A React Native mobile application for tracking baby growth measurements and visualizing them using WHO growth standards.

## Tech Stack

- **Framework**: React Native with Expo (SDK 53)
- **Language**: TypeScript
- **State Management**: Zustand
- **Local Storage**: AsyncStorage
- **Charts**: react-native-gifted-charts
- **Date Picker**: @react-native-community/datetimepicker
- **Animations**: react-native-reanimated
- **Gesture Handling**: react-native-gesture-handler
- **UI Components**: Custom React Native components
- **Growth Standards**: WHO Child Growth Standards

## Features

- Add, edit, and delete growth measurements (weight, height, head circumference)
- Visual growth charts with WHO percentile curves
- Swipe-to-reveal edit/delete actions
- Unit conversion support (kg/lbs, cm/in)
- Local data persistence
- Toast notifications
- Responsive design for different screen sizes

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

For iOS development:
- [Xcode](https://developer.apple.com/xcode/) (macOS only)

For Android development:
- [Android Studio](https://developer.android.com/studio)
- Android SDK

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coddle
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or
expo start
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android device/emulator
- `npm run ios` - Start the app on iOS device/simulator
- `npm run web` - Start the app in web browser
- `npm run dev` - Start with development client
- `npm run tunnel` - Start with tunnel connection
- `npm run clear` - Start with cleared cache
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

```
coddle/
├── components/          # Reusable UI components
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Helper functions and utilities
├── hoc/                # Higher-Order Components
├── hooks/              # Custom React hooks
├── assets/             # Images and static assets
├── App.tsx             # Main application component
└── package.json        # Dependencies and scripts
```

## Development

1. **Running on Physical Device**:
   - Install Expo Go app from App Store (iOS) or Play Store (Android)
   - Scan the QR code displayed in the terminal or browser
   - The app will load on your device

2. **Running on Simulator/Emulator**:
   - For iOS: Press `i` in the terminal or click "Run on iOS simulator"
   - For Android: Press `a` in the terminal or click "Run on Android device/emulator"

3. **Development Tips**:
   - Hot reloading is enabled by default
   - Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to access developer menu
   - Use `console.log()` for debugging - logs appear in the terminal

## Building for Production

1. **Android APK**:
```bash
npm run build:android
```

2. **iOS IPA**:
```bash
npm run build:ios
```

3. **Web Build**:
```bash
npm run build:web
```

## Data Storage

The app uses AsyncStorage for local data persistence. All growth measurements and baby profile data are stored locally on the device.

## WHO Growth Standards

The app implements WHO Child Growth Standards for:
- Weight-for-age percentiles
- Height-for-age percentiles  
- Head circumference-for-age percentiles

Growth charts display 3rd, 50th, and 97th percentiles alongside the baby's actual measurements.