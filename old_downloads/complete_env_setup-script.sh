#!/bin/bash

# Lesson Plan App - Complete Setup Script
# Purpose: Check dependencies, install packages, and prepare dev environment
# Author: Auto-generated for rituzangle/lesson-plan-app
# Platform: macOS M3 optimized

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Version comparison function
version_greater_equal() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# Main setup function
main() {
    log_info "🚀 Starting Lesson Plan App Setup"
    log_info "Platform: macOS M3 optimized"
    echo "==============================================="
    
    # Check system dependencies
    check_system_dependencies
    
    # Check and install Node.js dependencies
    check_node_dependencies
    
    # Install project dependencies
    install_project_dependencies
    
    # Setup development environment
    setup_dev_environment
    
    # Create necessary directories
    create_project_structure
    
    # Run initial setup tasks
    run_initial_setup
    
    # Show completion message
    show_completion_message
}

check_system_dependencies() {
    log_info "📋 Checking system dependencies..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        if version_greater_equal "$NODE_VERSION" "18.0.0"; then
            log_success "Node.js $NODE_VERSION ✓"
        else
            log_error "Node.js version must be ≥18.0.0. Current: $NODE_VERSION"
            log_info "Install via: brew install node@18"
            exit 1
        fi
    else
        log_error "Node.js not found. Install via: brew install node"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        log_success "npm $NPM_VERSION ✓"
    else
        log_error "npm not found. Usually comes with Node.js"
        exit 1
    fi
    
    # Check Expo CLI
    if command_exists expo; then
        EXPO_VERSION=$(expo --version)
        log_success "Expo CLI $EXPO_VERSION ✓"
    else
        log_warning "Expo CLI not found. Installing globally..."
        npm install -g @expo/cli
        log_success "Expo CLI installed ✓"
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        log_success "Git $GIT_VERSION ✓"
    else
        log_error "Git not found. Install via: brew install git"
        exit 1
    fi
    
    # Check Python (for code generation scripts)
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        log_success "Python $PYTHON_VERSION ✓"
    else
        log_warning "Python3 not found. Install via: brew install python"
    fi
}

check_node_dependencies() {
    log_info "🔍 Checking Node.js environment..."
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Are you in the right directory?"
        exit 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log_warning "node_modules not found. Will install dependencies..."
    else
        log_success "node_modules directory exists ✓"
    fi
}

install_project_dependencies() {
    log_info "📦 Installing project dependencies..."
    
    # Install main dependencies
    log_info "Installing main dependencies..."
    npm install
    
    # Install AsyncStorage and crypto dependencies
    log_info "Installing AsyncStorage and crypto dependencies..."
    npm install @react-native-async-storage/async-storage crypto-js
    npm install --save-dev @types/crypto-js
    
    # Install additional PWA dependencies
    log_info "Installing PWA dependencies..."
    npm install workbox-webpack-plugin
    
    # Install testing dependencies (if not already present)
    log_info "Checking testing dependencies..."
    npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
    
    log_success "Dependencies installed ✓"
}

setup_dev_environment() {
    log_info "🛠️ Setting up development environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        log_info "Creating .env file..."
        cat > .env << EOF
# Lesson Plan App Environment Variables
# Development Configuration

# App Configuration
EXPO_PUBLIC_APP_NAME="Lesson Plan App"
EXPO_PUBLIC_APP_VERSION="1.0.0"
EXPO_PUBLIC_ENVIRONMENT="development"

# Database Configuration (AsyncStorage)
EXPO_PUBLIC_STORAGE_PREFIX="lesson_plan_app_"
EXPO_PUBLIC_ENCRYPTION_KEY="your-encryption-key-here"

# API Configuration (if needed)
# EXPO_PUBLIC_API_URL="https://your-api-url.com"

# PWA Configuration
EXPO_PUBLIC_PWA_THEME_COLOR="#4F46E5"
EXPO_PUBLIC_PWA_BACKGROUND_COLOR="#FFFFFF"
EOF
        log_success ".env file created ✓"
    else
        log_success ".env file already exists ✓"
    fi
    
    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        log_info "Creating .env.local for local overrides..."
        cat > .env.local << EOF
# Local Environment Overrides
# This file is ignored by git

# Override encryption key for local development
EXPO_PUBLIC_ENCRYPTION_KEY="local-dev-key-$(date +%s)"
EOF
        log_success ".env.local file created ✓"
    fi
}

create_project_structure() {
    log_info "📁 Creating project structure..."
    
    # Create necessary directories
    mkdir -p scripts
    mkdir -p docs
    mkdir -p tests
    mkdir -p src/components
    mkdir -p src/screens
    mkdir -p src/navigation
    mkdir -p src/utils
    mkdir -p src/database
    mkdir -p src/types
    mkdir -p src/constants
    mkdir -p assets/images
    mkdir -p assets/fonts
    
    log_success "Project structure created ✓"
}

run_initial_setup() {
    log_info "🔧 Running initial setup tasks..."
    
    # Check if Expo project is properly initialized
    if [ ! -f "app.json" ] && [ ! -f "app.config.js" ]; then
        log_warning "Expo configuration not found. You may need to run 'expo init' first."
    fi
    
    # Pre-install Expo dependencies
    if command_exists expo; then
        log_info "Installing Expo dependencies..."
        expo install --fix
    fi
    
    log_success "Initial setup completed ✓"
}

show_completion_message() {
    echo
    echo "==============================================="
    log_success "🎉 Setup completed successfully!"
    echo "==============================================="
    echo
    echo "Next steps:"
    echo "1. Review .env file and update encryption key"
    echo "2. Run 'npm start' to start development server"
    echo "3. Use 'npm run web' for PWA development"
    echo "4. Use 'npm run android' or 'npm run ios' for mobile"
    echo
    echo "Available scripts:"
    echo "  npm start          - Start Expo development server"
    echo "  npm run web        - Start PWA development"
    echo "  npm run android    - Run on Android device/emulator"
    echo "  npm run ios        - Run on iOS device/simulator"
    echo "  npm test           - Run tests"
    echo "  npm run build      - Build for production"
    echo
    echo "Automation scripts:"
    echo "  ./scripts/git-sync.sh     - Sync with GitHub"
    echo "  ./scripts/deploy.sh       - Deploy application"
    echo "  python ./scripts/code-gen.py - Generate code"
    echo
    log_info "Happy coding! 🚀"
}

# Run main function
main "$@"