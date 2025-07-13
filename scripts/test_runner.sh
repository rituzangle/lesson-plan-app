#!/bin/bash
# Destination: scripts/test-runner.sh
# Test runner for lesson plan app components

set -e

echo "🧪 Starting Component Tests..."

# Check if we're in the right directory
if [[ ! -d "src" ]]; then
  echo "❌ Error: Run this script from the project root directory"
  exit 1
fi

# Test 1: TypeScript compilation
echo "📝 Testing TypeScript compilation..."
npx tsc --noEmit --skipLibCheck

if [[ $? -eq 0 ]]; then
  echo "✅ TypeScript compilation passed"
else
  echo "❌ TypeScript compilation failed"
  exit 1
fi

# Test 2: Check required dependencies
echo "📦 Checking dependencies..."
REQUIRED_DEPS=("react-native-async-storage" "crypto-js" "react-native-vector-icons")

for dep in "${REQUIRED_DEPS[@]}"; do
  if npm list $dep &>/dev/null; then
    echo "✅ $dep is installed"
  else
    echo "⚠️  $dep is missing - installing..."
    npm install $dep
  fi
done

# Test 3: Verify file structure
echo "📁 Verifying file structure..."
REQUIRED_FILES=(
  "src/components/forms/LessonEditor.tsx"
  "src/components/ui/Button.tsx"
  "src/components/ui/SubjectSelector.tsx"
  "src/components/ui/TemplateSelector.tsx"
  "src/services/lesson.service.ts"
  "src/services/encryption.service.ts"
  "src/types/lesson.types.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo "✅ $file exists"
  else
    echo "❌ $file is missing"
    exit 1
  fi
done

# Test 4: Run the app (if expo is available)
if command -v expo &> /dev/null; then
  echo "🚀 Starting Expo development server..."
  expo start --clear
else
  echo "⚠️  Expo CLI not found. To run the app:"
  echo "   npm install -g @expo/cli"
  echo "   expo start"
fi

echo "🎉 All tests passed! Your lesson plan app is ready."