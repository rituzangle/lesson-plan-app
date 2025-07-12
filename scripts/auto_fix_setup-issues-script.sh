#!/bin/bash
# Destination: scripts/auto-fix-setup-issues.sh
# Smart error detection and auto-resolution for lesson plan app
# An intelligent auto-fix system that catches and resolves common setup issues automatically.

set -e

echo "🔧 Auto-Fix System Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[AUTO-FIX]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    error "Not in a React Native/Expo project directory"
    echo "Please run this script from your project root (where package.json exists)"
    exit 1
fi

# 1. Auto-detect project type and fix package.json
log "Detecting project type..."
if grep -q "expo" package.json; then
    PROJECT_TYPE="expo"
    log "Detected Expo project"
elif grep -q "react-native" package.json; then
    PROJECT_TYPE="react-native"
    log "Detected React Native CLI project"
else
    warn "Unknown project type, assuming Expo"
    PROJECT_TYPE="expo"
fi

# 2. Required dependencies with version compatibility
declare -A REQUIRED_DEPS=(
    ["@react-native-async-storage/async-storage"]="^1.19.0"
    ["crypto-js"]="^4.1.1"
    ["react-native-vector-icons"]="^10.0.0"
    ["@types/crypto-js"]="^4.1.1"
)

# 3. Auto-install missing dependencies
log "Checking and installing dependencies..."
for dep in "${!REQUIRED_DEPS[@]}"; do
    if ! npm list "$dep" &>/dev/null; then
        warn "$dep is missing - installing..."
        npm install "$dep@${REQUIRED_DEPS[$dep]}"
        log "✅ Installed $dep"
    else
        log "✅ $dep is already installed"
    fi
done

# 4. Fix TypeScript configuration
log "Checking TypeScript configuration..."
if [[ ! -f "tsconfig.json" ]]; then
    warn "tsconfig.json missing - creating..."
    cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react-native",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "noEmit": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*",
    "App.tsx",
    "*.ts",
    "*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
EOF
    log "✅ Created tsconfig.json"
fi

# 5. Fix Metro configuration for React Native
if [[ "$PROJECT_TYPE" == "react-native" ]]; then
    log "Checking Metro configuration..."
    if [[ ! -f "metro.config.js" ]]; then
        warn "metro.config.js missing - creating..."
        cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add crypto-js support
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'crypto-js',
};

module.exports = config;
EOF
        log "✅ Created metro.config.js"
    fi
fi

# 6. Fix common import issues
log "Fixing common import issues..."
find src -name "*.tsx" -o -name "*.ts" | while read -r file; do
    if [[ -f "$file" ]]; then
        # Fix AsyncStorage import
        if grep -q "from 'react-native'" "$file" && grep -q "AsyncStorage" "$file"; then
            sed -i.bak "s/import.*AsyncStorage.*from 'react-native'/import AsyncStorage from '@react-native-async-storage\/async-storage'/" "$file"
            rm -f "$file.bak"
            log "✅ Fixed AsyncStorage import in $file"
        fi
        
        # Fix crypto-js import
        if grep -q "import.*crypto.*from 'crypto'" "$file"; then
            sed -i.bak "s/import.*crypto.*from 'crypto'/import CryptoJS from 'crypto-js'/" "$file"
            rm -f "$file.bak"
            log "✅ Fixed crypto import in $file"
        fi
    fi
done

# 7. Create missing directories
log "Creating missing directories..."
REQUIRED_DIRS=(
    "src/components/forms"
    "src/components/ui"
    "src/services"
    "src/types"
    "src/data"
    "src/utils"
    "assets/icons"
    "assets/images"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [[ ! -d "$dir" ]]; then
        mkdir -p "$dir"
        log "✅ Created directory: $dir"
    fi
done

# 8. Auto-fix common Expo issues
if [[ "$PROJECT_TYPE" == "expo" ]]; then
    log "Checking Expo configuration..."
    
    # Check app.json/app.config.js
    if [[ ! -f "app.json" ]] && [[ ! -f "app.config.js" ]]; then
        warn "app.json missing - creating basic configuration..."
        cat > app.json << 'EOF'
{
  "expo": {
    "name": "Lesson Plan App",
    "slug": "lesson-plan-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOF
        log "✅ Created app.json"
    fi
fi

# 9. Clean and rebuild
log "Cleaning and rebuilding..."
rm -rf node_modules/.cache
if [[ "$PROJECT_TYPE" == "expo" ]]; then
    expo install --fix
    log "✅ Expo dependencies fixed"
else
    npm install
    log "✅ Dependencies reinstalled"
fi

# 10. TypeScript compilation test
log "Testing TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck; then
    log "✅ TypeScript compilation successful"
else
    error "TypeScript compilation failed - attempting fixes..."
    
    # Add missing type declarations
    npm install --save-dev @types/react @types/react-native
    
    # Try compilation again
    if npx tsc --noEmit --skipLibCheck; then
        log "✅ TypeScript compilation fixed"
    else
        warn "TypeScript issues remain - check individual files"
    fi
fi

# 11. Create .gitignore if missing
if [[ ! -f ".gitignore" ]]; then
    log "Creating .gitignore..."
    cat > .gitignore << 'EOF'
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

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
*.log
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
.tmp/
.temp/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF
    log "✅ Created .gitignore"
fi

echo ""
log "🎉 Auto-fix complete! Your project is ready."
echo ""
info "Next steps:"
echo "1. Run: npm start (or expo start)"
echo "2. Test your app in simulator/device"
echo "3. Check that all imports work correctly"
echo ""
warn "If you encounter any issues, check the logs above for specific fixes applied."
