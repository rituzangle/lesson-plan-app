#!/bin/bash

# Lesson Plan App - Deployment Script
# Purpose: Build and deploy PWA, iOS, Android, and web versions
# Author: Auto-generated for rituzangle/lesson-plan-app
# Platform: macOS M3 optimized

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUILD_DIR="dist"
EXPO_BUILD_DIR="build"
VERSION=$(node -p "require('./package.json').version")
APP_NAME="lesson-plan-app"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-flight checks
check_prerequisites() {
    log_info "🔍 Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        log_error "Node.js not found. Please install Node.js"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        log_error "npm not found. Please install npm"
        exit 1
    fi
    
    # Check Expo CLI
    if ! command_exists expo; then
        log_error "Expo CLI not found. Install with: npm install -g @expo/cli"
        exit 1
    fi
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Are you in the right directory?"
        exit 1
    fi
    
    log_success "Prerequisites check passed ✓"
}

# Clean previous builds
clean_builds() {
    log_info "🧹 Cleaning previous builds..."
    
    # Remove build directories
    rm -rf $BUILD_DIR
    rm -rf $EXPO_BUILD_DIR
    rm -rf web-build
    rm -rf .expo
    
    log_success "Build directories cleaned ✓"
}

# Install dependencies
install_dependencies() {
    log_info "📦 Installing dependencies..."
    
    npm ci
    
    log_success "Dependencies installed ✓"
}

# Build PWA version
build_pwa() {
    log_info "🌐 Building PWA version..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Build web version
    expo build:web
    
    # Create PWA manifest and service worker
    create_pwa_manifest
    create_service_worker
    
    log_success "PWA build completed ✓"
}

# Create PWA manifest
create_pwa_manifest() {
    log_info "📱 Creating PWA manifest..."
    
    cat > web-build/manifest.json << EOF
{
  "name": "Lesson Plan App",
  "short_name": "LessonPlan",
  "description": "Comprehensive lesson planning app for K-12 educators",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4F46E5",
  "background_color": "#FFFFFF",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["education", "productivity", "utilities"],
  "lang": "en",
  "scope": "/",
  "prefer_related_applications": false
}
EOF
    
    log_success "PWA manifest created ✓"
}

# Create service worker
create_service_worker() {
    log_info "⚙️ Creating service worker..."
    
    cat > web-build/sw.js << 'EOF'
const CACHE_NAME = 'lesson-plan-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
EOF
    
    log_success "Service worker created ✓"
}

# Build iOS version
build_ios() {
    log_info "🍎 Building iOS version..."
    
    if [[ "$OSTYPE" != "darwin"* ]]; then
        log_warning "iOS build requires macOS. Skipping iOS build."
        return
    fi
    
    # Check if Xcode is installed
    if ! command_exists xcodebuild; then
        log_warning "Xcode not found. Skipping iOS build."
        return
    fi
    
    # Build iOS
    expo build:ios --type archive
    
    log_success "iOS build completed ✓"
}

# Build Android version
build_android() {
    log_info "🤖 Building Android version..."
    
    # Build Android APK
    expo build:android --type apk
    
    log_success "Android build completed ✓"
}

# Optimize builds
optimize_builds() {
    log_info "⚡ Optimizing builds..."
    
    # Compress static assets
    if command_exists gzip; then
        find web-build -name "*.js" -o -name "*.css" -o -name "*.html" | while read file; do
            gzip -c "$file" > "$file.gz"
        done
        log_success "Static assets compressed ✓"
    fi
    
    # Generate build info
    cat > web-build/build-info.json << EOF
{
  "version": "$VERSION",
  "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "build_number": "$(date +%Y%m%d%H%M%S)",
  "git_commit": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
  "platform": "web"
}
EOF
    
    log_success "Build optimization completed ✓"
}

# Deploy to web hosting
deploy_web() {
    log_info "🚀 Deploying web version..."
    
    # Check if gh-pages is available for GitHub Pages deployment
    if command_exists gh; then
        log_info "Deploying to GitHub Pages..."
        
        # Create deployment branch
        git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
        
        # Copy build files
        cp -r web-build/* .
        
        # Add build files to git
        git add .
        git commit -m "Deploy: $VERSION ($(date))" || true
        
        # Push to GitHub Pages
        git push origin gh-pages -f
        
        # Return to main branch
        git checkout main
        
        log_success "Deployed to GitHub Pages ✓"
    else
        log_warning "GitHub CLI not found. Manual deployment required."
        log_info "Web build available in: web-build/"
    fi
}

# Create deployment package
create_deployment_package() {
    log_info "📦 Creating deployment package..."
    
    # Create deployment directory
    mkdir -p deployments
    
    # Create timestamped deployment
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    DEPLOY_DIR="deployments/${APP_NAME}_${VERSION}_${TIMESTAMP}"
    
    mkdir -p $DEPLOY_DIR
    
    # Copy build artifacts
    cp -r web-build $DEPLOY_DIR/
    
    # Create deployment info
    cat > $DEPLOY_DIR/deployment-info.md << EOF
# Deployment Package: $APP_NAME v$VERSION

## Build Information
- **Version**: $VERSION
- **Build Date**: $(date)
- **Platform**: Multi-platform (PWA, iOS, Android)
- **Git Commit**: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')

## Deployment Instructions

### PWA/Web Deployment
1. Upload contents of \`web-build/\` to your web server
2. Ensure server supports HTTPS for PWA features
3. Configure server to serve \`index.html\` for all routes

### iOS Deployment
1. Use Xcode to archive and distribute
2. Submit to App Store Connect
3. Follow Apple's review guidelines

### Android Deployment
1. Sign APK with your keystore
2. Upload to Google Play Console
3. Follow Google Play policies

## Testing
- Test PWA features: offline functionality, installation
- Test on various devices and browsers
- Verify accessibility features
- Check performance metrics

## Monitoring
- Monitor app performance
- Track user engagement
- Monitor error logs
- Check PWA installation rates
EOF
    
    # Create archive
    tar -czf "${DEPLOY_DIR}.tar.gz" -C deployments "${APP_NAME}_${VERSION}_${TIMESTAMP}"
    
    log_success "Deployment package created: ${DEPLOY_DIR}.tar.gz ✓"
}

# Show deployment summary
show_deployment_summary() {
    echo
    echo "==============================================="
    log_success "🎉 Deployment completed successfully!"
    echo "==============================================="
    echo
    echo "Build Information:"
    echo "  Version: $VERSION"
    echo "  Build Date: $(date)"
    echo "  Platform: Multi-platform"
    echo
    echo "Deployment Artifacts:"
    echo "  📱 PWA: web-build/"
    echo "  📦 Package: deployments/"
    echo
    echo "Next Steps:"
    echo "  1. Test PWA functionality"
    echo "  2. Deploy to hosting platform"
    echo "  3. Submit mobile apps to stores"
    echo "  4. Monitor deployment"
    echo
    echo "URLs:"
    echo "  🌐 GitHub Pages: https://rituzangle.github.io/lesson-plan-app"
    echo "  📱 PWA Install: Available after deployment"
    echo
    log_info "Happy deploying! 🚀"
}

# Main deployment function
main_deploy() {
    log_info "🚀 Starting deployment process..."
    
    # Run all deployment steps
    check_prerequisites
    clean_builds
    install_dependencies
    build_pwa
    optimize_builds
    create_deployment_package
    deploy_web
    
    # Show summary
    show_deployment_summary
}

# Build specific platform
build_platform() {
    local platform=$1
    
    case $platform in
        "pwa"|"web")
            check_prerequisites
            clean_builds
            install_dependencies
            build_pwa
            optimize_builds
            log_success "PWA build completed!"
            ;;
        "ios")
            check_prerequisites
            build_ios
            log_success "iOS build completed!"
            ;;
        "android")
            check_prerequisites