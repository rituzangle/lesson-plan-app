#!/bin/bash
# Diagnose Version Conflicts - Lesson Plan App  
# Created: 2025-07-28 for lesson-plan-app
# Path: scripts/diagnose-versions.sh

echo "🔍 Diagnosing React Native Version Conflicts..."
echo "=========================================="

# Check package.json versions
echo "📦 Package.json versions:"
echo "React Native: $(grep '"react-native"' package.json | cut -d'"' -f4)"
echo "Expo SDK: $(grep '"expo"' package.json | grep -v '@expo' | cut -d'"' -f4)"
echo "React: $(grep '"react"' package.json | grep -v 'react-native' | cut -d'"' -f4)"

echo ""
echo "🔧 Installed versions:"
npm list react-native expo react 2>/dev/null | grep -E "(react-native|expo|react)@"

echo ""
echo "📱 Expo doctor diagnosis:"
npx expo doctor

echo ""
echo "⚠️ Checking for conflicting packages:"
CONFLICTS=("react-native-reanimated" "react-native-screens" "react-native-safe-area-context")
for pkg in "${CONFLICTS[@]}"; do
    if npm list $pkg 2>/dev/null | grep -q $pkg; then
        echo "Found: $pkg $(npm list $pkg 2>/dev/null | grep $pkg | cut -d'@' -f2)"
    fi
done

echo ""
echo "🚨 Recommended fix:"
echo "1. Run: ./scripts/fix-react-native-mismatch.sh"
echo "2. Or manually: npx expo install --fix"
echo "3. Then: npx expo start --clear"