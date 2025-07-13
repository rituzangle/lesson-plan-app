# Mac M3 Run Commands - Lesson Plan App

## Quick Start Commands

### 1. Navigate to Project
```bash
cd ~/lesson-plan-app
```

### 2. Install Dependencies (if needed)
```bash
npm install
# or if using yarn
yarn install
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
expo start
```

### 4. Organize Downloaded Files
```bash
chmod +x scripts/organize_downloads.sh
./scripts/organize_downloads.sh
```

### 5. Run Tests
```bash
npm test
# or
yarn test
```

## Environment Setup (Mac M3 Specific)

### Prerequisites Check
```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if Expo CLI is installed
expo --version
```

### Install Missing Tools
```bash
# Install Expo CLI globally if missing
npm install -g @expo/cli

# Install React Native CLI if needed
npm install -g react-native-cli
```

## Project Structure Commands

### View Current Structure
```bash
tree -I node_modules -L 3
# or
ls -la
```

### Check Git Status
```bash
git status
git log --oneline -5
```

## Troubleshooting Commands

### Clear Cache
```bash
npm run clean
# or
expo r -c
```

### Reset Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check App Health
```bash
npm run lint
npm run build
```

## Mobile Testing

### iOS Simulator
```bash
expo start --ios
```

### Android Emulator
```bash
expo start --android
```

### Web Preview
```bash
expo start --web
```

## Database Commands

### Supabase Local
```bash
# If using Supabase CLI
supabase start
supabase status
```

## Quick Status Check
```bash
echo "📱 App Status Check"
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo "Expo: $(expo --version)"
echo "Git: $(git branch --show-current)"
echo "Files: $(ls -1 | wc -l) items in root"
```