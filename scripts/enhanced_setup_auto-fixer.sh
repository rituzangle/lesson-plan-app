#!/bin/bash
# Destination: scripts/setup-script.sh
# Enhanced setup script with auto-fix integration

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[SETUP]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }

echo "🚀 Lesson Plan App Setup"
echo "========================"

# Check if running from correct directory
if [[ ! -f "package.json" ]]; then
    error "Please run this script from your project root directory"
    exit 1
fi

# Create directory structure
log "Creating project structure..."
DIRECTORIES=(
    "src/components/forms"
    "src/components/ui"
    "src/services"
    "src/types"
    "src/data"
    "src/utils"
    "scripts"
    "assets/icons"
    "assets/images"
    "downloads"
)

for dir in "${DIRECTORIES[@]}"; do
    mkdir -p "$dir"
    log "✅ Created $dir/"
done

# Function to move files from downloads to proper locations
move_artifacts() {
    log "Moving artifacts from downloads to proper locations..."
    
    # Track processed files to avoid duplicates
    PROCESSED_FILE="downloads/.processed_files"
    touch "$PROCESSED_FILE"
    
    # Define file mappings (filename -> destination)
    declare -A FILE_MAPPINGS=(
        ["LessonEditor.tsx"]="src/components/forms/"
        ["Button.tsx"]="src/components/ui/"
        ["SubjectSelector.tsx"]="src/components/ui/"
        ["TemplateSelector.tsx"]="src/components/ui/"
        ["lesson.service.ts"]="src/services/"
        ["encryption.service.ts"]="src/services/"
        ["lesson.types.ts"]="src/types/"
        ["curriculum-data.json"]="src/data/"
        ["auto-fix.sh"]="scripts/"
        ["smart-test.sh"]="scripts/"
        ["setup-script.sh"]="scripts/"
    )
    
    # Process files in downloads directory
    for file in