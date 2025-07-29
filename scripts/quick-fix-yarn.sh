#!/bin/bash
# Quick Fix for Yarn-based Expo App - lesson-plan-app
# Path: scripts/quick-fix-yarn.sh

echo "🚀 Quick fixes for the 4 main issues..."

# Fix 1: Remove @types/react-native (causes conflicts)
echo "1️⃣ Removing conflicting @types/react-native..."
yarn remove @types/react-native

# Fix 2: Remove problematic unmaintained packages
echo "2️⃣ Removing unmaintained packages..."
yarn remove react-native-barcode-builder react-native-chart-kit react-native-fs react-native-html-to-pdf react-native-keyboard-aware-scroll-view

# Fix 3: Fix app.json privacy field
echo "3️⃣ Fixing app.json schema..."
sed -i '' 's/"privacy":.*,//g' app.json

# Fix 4: Clean install
echo "4️⃣ Clean reinstall..."
rm -rf node_modules yarn.lock
yarn install
yarn expo install --fix

echo "✅ Try: yarn expo start --web --clear"