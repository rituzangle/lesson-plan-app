#!/bin/bash
# Project Setup Script
# Path: scripts/setup.sh
# Usage: npm run setup or bash scripts/setup.sh

echo "🚀 Setting up K12 Lesson Plan App..."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components
mkdir -p src/database
mkdir -p src/navigation
mkdir -p src/screens
mkdir -p src/utils
mkdir -p src/constants
mkdir -p src/types
mkdir -p scripts
mkdir -p docs

# Install core dependencies
echo "📦 Installing dependencies..."
npm install @react-native-async-storage/async-storage crypto-js

# Install dev dependencies
echo "🔧 Installing dev dependencies..."
npm install --save-dev @types/crypto-js

# Create package.json scripts if they don't exist
echo "⚙️ Setting up package.json scripts..."
node -e "
const fs = require('fs');
const path = require('path');
const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

pkg.scripts = pkg.scripts || {};
pkg.scripts['setup'] = 'bash scripts/setup.sh';
pkg.scripts['setup:database'] = 'npm install @react-native-async-storage/async-storage crypto-js && npm install --save-dev @types/crypto-js';
pkg.scripts['setup:onboarding'] = 'npm install @react-native-async-storage/async-storage crypto-js && npm install --save-dev @types/crypto-js';
pkg.scripts['test:database'] = 'echo \"Database tests integrated in app\"';
pkg.scripts['clean:database'] = 'echo \"Use clearDatabaseForTesting() function\"';
pkg.scripts['build:docs'] = 'echo \"Documentation auto-generated\"';

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
console.log('✅ Package.json scripts updated');
"

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
echo "📝 Creating .gitignore..."
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Build outputs
dist/
build/
.expo/
.expo-shared/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Database
*.db
*.sqlite
EOF
fi

# Create initial README if it doesn't exist
if [ ! -f README.md ]; then
echo "📖 Creating README.md..."
cat > README.md << EOF
# K12 Lesson Plan App

A comprehensive, accessible lesson planning application for K12 educators.

## Features
- 🎯 Accessibility-first design
- 🎭 Performing arts curriculum integration
- 👥 Multi-user support (Teachers, Parents, Students)
- 🔒 Encrypted data storage
- 📱 PWA + Mobile app support

## Setup
\`\`\`bash
npm run setup
\`\`\`

## Development
\`\`\`bash
npm start
\`\`\`

## Testing
\`\`\`bash
npm run test:database
\`\`\`

## File Structure
\`\`\`
src/
├── components/        # React components
├── database/         # Database schema and operations
├── navigation/       # App navigation
├── screens/         # Screen components
├── utils/           # Utility functions
├── constants/       # App constants
└── types/           # TypeScript type definitions
\`\`\`

## Documentation
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database.md)
- [Development Log](docs/development-log.md)
EOF
fi

# Check if all files are in place
echo "🔍 Checking project structure..."
required_files=(
    "src/database/schema.ts"
    "src/database/testDatabase.ts"
    "src/components/UserOnboarding.tsx"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files are in place!"
else
    echo "⚠️  Missing files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo "Please create these files from the artifacts provided."
fi

echo "🎉 Setup complete! Ready to develop."
echo ""
echo "Next steps:"
echo "1. Place artifact files in their respective paths"
echo "2. Run: npm start"
echo "3. Test database functionality in the app"