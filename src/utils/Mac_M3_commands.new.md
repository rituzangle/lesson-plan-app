# Mac M3 Commands Reference - Lesson Plan App

## 🚀 Quick Start Commands

### Project Navigation
```bash
# Navigate to your project
cd ~/lesson_plan_App

# Check current directory structure
ls -la
tree src/  # If tree is installed: brew install tree
```

### Development Server
```bash
# Start development server (choose platform)
npm start          # Interactive menu
npm run web        # Web browser (PWA)
npm run ios        # iOS simulator
npm run android    # Android emulator

# Alternative Expo CLI commands
npx expo start     # Modern Expo CLI
npx expo start --web
npx expo start --ios
npx expo start --android
```

### Package Management
```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Add new package
npm install <package-name>
npm install -D <dev-package>  # Development dependency

# Check outdated packages
npm outdated
```

## 🔧 File Organization Commands

### Setup Script
```bash
# Run the enhanced setup script
chmod +x scripts/enhanced_setup_auto-fixer.sh
bash scripts/enhanced_setup_auto-fixer.sh

# Alternative: direct execution
./scripts/enhanced_setup_auto-fixer.sh
```

### Manual File Operations
```bash
# Check downloads folder
ls -la downloads/

# Create missing directories
mkdir -p src/data/{curriculum,templates,samples}
mkdir -p database docs

# Move files manually (if script fails)
mv downloads/app_with_auth.ts src/App.tsx
mv downloads/encryption_service.ts src/services/encryption.ts
```

## 🧪 Testing Commands

### Unit Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- AuthContext.test.ts
```

### TypeScript Validation
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/components/AuthContext.ts

# Format code
npm run format     # If configured
npx prettier --write src/
```

## 🔄 Git Operations

### Basic Git Commands
```bash
# Check repository status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Fix file organization and extensions"

# Push to main branch
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Management
```bash
# Create and switch to new branch
git checkout -b feature/auth-context-fix

# Switch between branches
git checkout main
git checkout dev

# Merge branch
git checkout main
git merge feature/auth-context-fix
```

## 📱 Mac M3 Specific Optimizations

### Memory Management
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Or set in package.json script:
# "start": "NODE_OPTIONS='--max-old-space-size=8192' expo start"
```

### Performance Monitoring
```bash
# Check memory usage
top -o MEM

# Check CPU usage
top -o CPU

# Monitor Node.js processes
ps aux | grep node
```

### iOS Simulator (Mac M3)
```bash
# List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 14 Pro"

# Reset simulator
xcrun simctl erase all
```

## 🛠️ Development Tools

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Debug Commands
```bash
# Start with debug info
DEBUG=* npm start

# React Native specific debugging
npx react-native log-ios
npx react-native log-android
```

## 📦 Build Commands

### Production Build
```bash
# Build for production
npm run build

# Build for specific platform
npm run build:web
npm run build:ios
npm run build:android
```

### App Store Preparation
```bash
# Create production build
npx expo build:ios
npx expo build:android

# Submit to app stores
npx expo submit:ios
npx expo submit:android
```

## 🔍 Troubleshooting Commands

### Common Issues
```bash
# Clear npm cache
npm cache clean --force

# Clear Expo cache
npx expo r -c

# Reset Metro bundler
npx expo r -c --reset-cache

# Clear watchman cache (if installed)
watchman watch-del-all
```

### Dependency Issues
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Check for duplicate dependencies
npm ls --depth=0
```

## 📊 Project Information

### Status Commands
```bash
# Check project structure
find src/ -type f -name "*.ts" -o -name "*.tsx" | head -20

# Count lines of code
find src/ -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Check package.json scripts
npm run  # Lists available scripts
```

### Environment Info
```bash
# Check versions
node --version
npm --version
npx expo --version

# Check Expo environment
npx expo doctor

# System information
sw_vers  # macOS version
uname -m  # Architecture (should show arm64 for M3)
```

## 🎯 Quick Reference

### Most Used Commands
```bash
cd ~/lesson_plan_App
npm start
npm test
git status
git add . && git commit -m "message" && git push
```

### Emergency Reset
```bash
# If everything breaks
rm -rf node_modules package-lock.json
npm install
npx expo r -c
npm start
```