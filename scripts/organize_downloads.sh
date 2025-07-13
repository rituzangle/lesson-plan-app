#!/bin/bash
# File: scripts/organize_downloads.sh
# Purpose: Move downloaded files to correct locations in lesson-plan-app
# Usage: ./scripts/organize_downloads.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🗂️  Organizing Downloaded Files${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Run this from the lesson-plan-app root directory${NC}"
    exit 1
fi

# Create directories if they don't exist
mkdir -p src/services
mkdir -p src/data
mkdir -p database
mkdir -p scripts

DOWNLOADS_DIR="downloads"

if [ ! -d "$DOWNLOADS_DIR" ]; then
    echo -e "${RED}❌ Error: downloads directory not found${NC}"
    exit 1
fi

echo -e "${YELLOW}📁 Moving files to correct locations...${NC}"

# Move TypeScript service files
if [ -f "$DOWNLOADS_DIR/encryption_service.ts" ]; then
    mv "$DOWNLOADS_DIR/encryption_service.ts" "src/services/"
    echo "✅ encryption_service.ts → src/services/"
fi

# Move data files
if [ -f "$DOWNLOADS_DIR/sample_curriculum_data.json" ]; then
    mv "$DOWNLOADS_DIR/sample_curriculum_data.json" "src/data/"
    echo "✅ sample_curriculum_data.json → src/data/"
fi

# Move database files
if [ -f "$DOWNLOADS_DIR/supabase_schema.sql" ]; then
    mv "$DOWNLOADS_DIR/supabase_schema.sql" "database/"
    echo "✅ supabase_schema.sql → database/"
fi

# Move script files
for script in enhanced_setup_auto-fixer.sh smart_test_runner.sh test_runner.sh; do
    if [ -f "$DOWNLOADS_DIR/$script" ]; then
        mv "$DOWNLOADS_DIR/$script" "scripts/"
        chmod +x "scripts/$script"
        echo "✅ $script → scripts/ (made executable)"
    fi
done

# Handle the App.tsx question
if [ -f "$DOWNLOADS_DIR/app_with_auth.ts" ]; then
    echo -e "${YELLOW}❓ Found app_with_auth.ts${NC}"
    echo "   This should likely be App.tsx in src/"
    echo "   Moving to src/App.tsx (renamed)"
    mv "$DOWNLOADS_DIR/app_with_auth.ts" "src/App.tsx"
    echo "✅ app_with_auth.ts → src/App.tsx"
fi

# Handle curriculum TypeScript files
for file in performing_arts_curriculum.ts performing_arts_templates.ts; do
    if [ -f "$DOWNLOADS_DIR/$file" ]; then
        mv "$DOWNLOADS_DIR/$file" "src/data/"
        echo "✅ $file → src/data/"
    fi
done

# Clean up empty downloads directory
if [ -d "$DOWNLOADS_DIR" ] && [ -z "$(ls -A $DOWNLOADS_DIR)" ]; then
    rmdir "$DOWNLOADS_DIR"
    echo "🧹 Cleaned up empty downloads directory"
fi

echo -e "${GREEN}🎉 File organization complete!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "   1. Run: npm run dev (to test the app)"
echo "   2. Check: src/App.tsx (review the moved auth app)"
echo "   3. Update: architecture.md"