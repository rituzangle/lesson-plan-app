#!/bin/bash

# Smart NPM Installer Script
# Usage: npm run setup or bash scripts/smart_npm_installer.sh
echo "🚀 Smart NPM Installer Script for K12 Lesson Plan App"
echo "📂 Checking for package.json in current directory..."

if [ -f "package.json" ]; then
    cp package.json "package.json.bak_$(date +%s)"
    echo "📦 Backed up package.json to package.json.bak_$(date +%s)"
else
    echo "❗ package.json not found. Please ensure you are in the correct directory."
fi
if [ -f "package-lock.json" ]; then
    cp package-lock.json "package-lock.bak_$(date +%s)"
    echo "📦 Backed up package-lock.json to package-lock.bak_$(date +%s)"
fi
# Create install-logs directory if it doesn't exist
if [ -d "install-logs" ]; then
    echo "✅ install-logs directory already exists."
else
    echo "📂 Creating install-logs directory for installation logs..."
    mkdir -p install-logs
fi

echo "✅ Proceeding with installation..."
echo "🔍 Checking for Node.js and npm..."
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "❗ Node.js and npm are required to run this script."
  echo "Please install Node.js and npm from https://nodejs.org/"
  exit 1
fi
echo "✅ Node.js and npm are installed. Proceeding with package.json analysis..."
# Check for package.json in the current director

echo "🔍 Analyzing package.json for dependencies..."
if ! grep -q '"dependencies":' package.json && ! grep -q '"devDependencies":' package.json; then
  echo "❗ No dependencies found in package.json. Please add some dependencies before running this script."
  exit 1
fi  
echo "📋 Dependencies found. Proceeding with installation...   "
echo "🔄 Checking for existing node_modules and package-lock.json..."
if [ -d "node_modules" ] || [ -f "package-lock.json" ]; then
  echo "⚠️ Existing node_modules or package-lock.json found. Cleaning up..."
else
  echo "✅ No existing node_modules or package-lock.json found. Proceeding with installation..."
fi
# Clean up old installations

echo "🧹 Cleaning old install..."
rm -rf node_modules package-lock.json
npm cache clean --force

npm install -g npm-check-updates
echo "✅ Old installations cleaned up."
echo "📦 Starting fresh npm install..."
npm install &> install-logs/install.log

if grep -q "ERESOLVE" install-log/install.log; then
  echo "⚠️ Dependency conflict detected (ERESOLVE)."
  echo "🔍 Logging error output to install.log"

  echo "💡 Suggested Fixes:"
  echo "  - Use --legacy-peer-deps to bypass peer dependency conflicts"
  echo " try yarn install instead of npm install - it worked for us for lesson_plan_App"

  echo "  - Try running with --legacy-peer-deps"
  echo "  - Check version compatibility with npm-check-updates"
  
  # echo "🛠 Retrying with legacy-peer-deps..."
  # npm install --legacy-peer-deps &> install-logs/install_$(date +%Y%m%d_%H%M%S).log

  if grep -q "ERR!" install.log; then
    echo "🚨 Still encountering errors. Manual review needed."
    tail -n 20 install.log
  else
    echo "✅ Install succeeded using legacy-peer-deps!"
  fi
else
  echo "✅ Install succeeded!"
fi
echo "📄 Install log saved to: " install-logs/install_$(date +%Y%m%d_%H%M%S).log


# Add setup script to package.json if it doesn't exist
if ! grep -q '"setup":' package.json; then
  echo "⚙️ Adding setup script to package.json..."
  node -e "
const fs = require('fs');
const path = require('path');
const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['setup'] = 'bash scripts/setup.sh';
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
console.log('✅ setup script added to package.json');
"
else
  echo "⚙️ setup script already exists in package.json"
fi

# 🔄 Optional: Automatically Align Versions with ncu
if command -v ncu &> /dev/null; then
  echo "🔄 Aligning package versions with ncu..."
  ncu -u
  npm install
else
  echo "❗ ncu (npm-check-updates) not found. Skipping version alignment."
fi

