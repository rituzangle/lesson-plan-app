# Run Commands for Mac M3

## Prerequisites
- Node.js >= 18.x LTS
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (via Xcode)
- Android Studio (for Android emulator)

## Development Commands

### Start Development Server
```bash
npm start
# or
expo start
```

### Run on iOS Simulator
```bash
npm run ios
# or
expo start --ios
```

### Run on Android Emulator
```bash
npm run android
# or
expo start --android
```

### Run as Web/PWA
```bash
npm run web
# or
expo start --web
```

## Testing Commands
```bash
npm test                # Run unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:database   # Database tests
```

## Build Commands
```bash
# Development build
expo build:ios --type simulator
expo build:android --type apk

# Production build (requires Expo account)
expo build:ios --type archive
expo build:android --type app-bundle
```

## Troubleshooting Mac M3 Specific

### Clear Cache
```bash
expo start --clear
npm start -- --reset-cache
```

### Fix Metro Bundle Issues
```bash
rm -rf node_modules
npm install
expo install --fix
```

### iOS Simulator Issues
```bash
# Reset iOS Simulator
xcrun simctl erase all
```

## Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in Supabase credentials
3. Run `npm install`
4. Run `npm start`
