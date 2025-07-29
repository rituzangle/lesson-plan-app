#!/bin/bash
# Fix React Native Version Mismatch - Lesson Plan App
# Created: 2025-07-28 for lesson-plan-app
# Path: scripts/fix-react-native-mismatch.sh

echo "🔧 Fixing React Native Version Mismatch..."
echo "Current issue: JS 0.80.1 vs Native 0.79.2"

# Clear all caches first
echo "📱 Step 1: Clearing all caches..."
yarn add expo --fix # doesnt work > npx expo install --fix
watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."
rm -rf node_modules
rm -rf .expo
rm -rf ios/build 2>/dev/null || echo "No iOS build folder"
rm package-lock.json 2>/dev/null || echo "No package-lock.json"
rm yarn.lock 2>/dev/null || echo "No yarn.lock"

# Check current versions
echo "📋 Step 2: Checking current versions..."
echo "Package.json React Native version:"
grep "react-native" package.json | head -1
echo "Expo SDK version:"
grep "expo" package.json | grep -v "@expo" | head -1

# Reinstall with proper Expo SDK alignment
echo "🔄 Step 3: Reinstalling with Expo SDK alignment..."
yarn install

# Fix Expo SDK and React Native version alignment
echo "⚡ Step 4: Aligning Expo SDK with React Native..."
yarn add expo --fix  ## npx expo install --fix

# For problematic plugins you mentioned
echo "🧹 Step 5: Checking problematic plugins..."
PROBLEMATIC_PLUGINS=("expo-print" "expo-crypto" "expo-av" "expo-sharing")

for plugin in "${PROBLEMATIC_PLUGINS[@]}"; do
    if grep -q "$plugin" package.json; then
        echo "Found $plugin - checking version compatibility..."
        yarn add $plugin # npx expo install $plugin
    fi
done

# Clear Metro cache
echo "🗂️ Step 6: Clearing Metro cache..."
npx expo start --clear

echo "✅ Fix completed! Try running:"
echo "   npx expo start --web (for web testing)"
echo "   npx expo start --ios (for iOS simulator)"
echo ""
echo "If issues persist, run: npx expo-doctor"
# npx expo-doctor    # old command npx expo doctor
