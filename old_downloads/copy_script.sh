#!/bin/bash

# copy_downloads.sh
# Final destination: scripts/copy_downloads.sh
# 
# Copies files from ~/Downloads to their proper destinations
# Handles lesson-plan-app project structure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOWNLOADS_DIR="$HOME/Downloads"
TEMP_DIR="$PROJECT_ROOT/downloads"

echo -e "${GREEN}Lesson Plan App - File Copy Script${NC}"
echo "Project root: $PROJECT_ROOT"
echo "Downloads dir: $DOWNLOADS_DIR"
echo ""

# Create temp directory if it doesn't exist
mkdir -p "$TEMP_DIR"

# File mapping - artifact name to destination
declare -A FILE_MAP=(
    ["StorageService.ts"]="src/services/StorageService.ts"
    ["storage.ts"]="src/types/storage.ts"
    ["encryption.ts"]="src/utils/encryption.ts"
    ["storageErrors.ts"]="src/utils/storageErrors.ts"
    ["AsyncStorageDatabase.ts"]="src/database/AsyncStorageDatabase.ts"
    ["copy_downloads.sh"]="scripts/copy_downloads.sh"
    ["auto_sync.sh"]="scripts/auto_sync.sh"
    ["storage-architecture.md"]="docs/storage-architecture.md"
    ["package.json"]="package.json"
)

# Function to copy file
copy_file() {
    local filename="$1"
    local source="$2"
    local dest="$3"
    
    if [[ -f "$source" ]]; then
        # Create destination directory if it doesn't exist
        mkdir -p "$(dirname "$dest")"
        
        # Copy file
        cp "$source" "$dest"
        echo -e "${GREEN}✓${NC} Copied: $filename -> $dest"
        
        # Remove from downloads/temp
        rm -f "$source"
        
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Not found: $filename"
        return 1
    fi
}

# Function to scan and copy files
scan_and_copy() {
    local copied=0
    local total=0
    
    echo -e "${YELLOW}Scanning for files...${NC}"
    
    # Check Downloads directory
    for artifact_name in "${!FILE_MAP[@]}"; do
        total=$((total + 1))
        dest_path="$PROJECT_ROOT/${FILE_MAP[$artifact_name]}"
        
        # Try Downloads directory first
        if copy_file "$artifact_name" "$DOWNLOADS_DIR/$artifact_name" "$dest_path"; then
            copied=$((copied + 1))
            continue
        fi
        
        # Try temp directory
        if copy_file "$artifact_name" "$TEMP_DIR/$artifact_name" "$dest_path"; then
            copied=$((copied + 1))
            continue
        fi
    done
    
    echo ""
    echo -e "${GREEN}Summary:${NC} $copied/$total files copied"
    
    if [[ $copied -gt 0 ]]; then
        echo -e "${GREEN}✓${NC} Files successfully copied to project structure"
        
        # Auto-sync to GitHub if requested
        if [[ "$1" == "--sync" ]]; then
            echo ""
            echo -e "${YELLOW}Auto-syncing to GitHub...${NC}"
            cd "$PROJECT_ROOT"
            
            # Add all changes
            git add .
            
            # Commit with timestamp
            git commit -m "feat: Add storage service files - $(date '+%Y-%m-%d %H:%M:%S')" || true
            
            # Push to current branch
            git push origin "$(git branch --show-current)" || echo -e "${RED}Failed to push to GitHub${NC}"
        fi
    fi
}

# Main execution
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [--sync] [--clean]"
        echo ""
        echo "Options:"
        echo "  --sync   Auto-sync to GitHub after copying"
        echo "  --clean  Clean temp directory"
        echo "  --help   Show this help"
        ;;
    "--clean")
        echo -e "${YELLOW}Cleaning temp directory...${NC}"
        rm -rf "$TEMP_DIR"
        echo -e "${GREEN}✓${NC} Temp directory cleaned"
        ;;
    *)
        scan_and_copy "$1"
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"