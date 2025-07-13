#!/bin/bash
# Enhanced Setup Auto-Fixer Script
# Path: scripts/enhanced_setup_auto-fixer.sh
# Purpose: Automatically organize downloaded files into proper project structure

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Project root: $PROJECT_ROOT"
DOWNLOADS_DIR="$PROJECT_ROOT/downloads"

echo -e "${BLUE}🚀 Enhanced Setup Auto-Fixer Starting...${NC}"
echo "Project root: $PROJECT_ROOT"

# Create necessary directories
create_directories() {
    echo -e "${YELLOW}📁 Creating directory structure...${NC}"
    
    directories=(
        "src/components"
        "src/services"
        "src/types"
        "src/data/curriculum"
        "src/data/templates"
        "src/data/samples"
        "src/database"
        "src/navigation"
        "src/screens"
        "src/utils"
        "src/constants"
        "scripts"
        "docs"
        "tests"
    )
    
    for dir in "${directories[@]}"; do
        # Create directory if it doesn't exist
        if [[ -d "$PROJECT_ROOT/$dir" ]]; then
            echo -e "  ${BLUE}ℹ Directory already exists:${NC} $dir" 
        else
            # Create the directory
            echo -e "  ${YELLOW}📂 Creating directory:${NC} $dir
            mkdir -p "$PROJECT_ROOT/$dir"   
        echo "  ✓ Created: $dir"
        fi
    done
}

# Fix file extensions and move files
organize_files() {
    echo -e "${YELLOW}🔧 Organizing files from downloads...${NC}"
    
    if [[ ! -d "$DOWNLOADS_DIR" ]]; then
        echo -e "${RED}❌ Downloads directory not found: $DOWNLOADS_DIR${NC}"
        return 1
    fi
    
    cd "$DOWNLOADS_DIR"
    echo "Current directory: $(pwd)"
    # Define file mappings: "source_file:destination_path:final_name"
    # Key: source file name, Value: destination path relative to project root
    # This will allow us to easily map source files to their new locations
    echo -e "${BLUE}📂 Organizing files...${NC}"
    echo "Available files in downloads:"
    ls
    echo -e "${YELLOW}🔍 Checking files...${NC}"
    declare -A file_mappings=(
        ["app_with_auth.ts"]="src/App.tsx"
        ["encryption_service.ts"]="src/services/encryption.ts"
        ["performing_arts_curriculum.ts"]="src/data/curriculum/performing_arts.ts"
        ["performing_arts_templates.ts"]="src/data/templates/performing_arts.ts"
        ["enhanced_setup_auto-fixer.sh"]="scripts/enhanced_setup_auto-fixer.sh"
        ["smart_test_runner.sh"]="scripts/smart_test_runner.sh"
        ["test_runner.sh"]="scripts/test_runner.sh"
        ["sample_curriculum_data.json"]="src/data/samples/curriculum_data.json"
        ["supabase_schema.sql"]="database/schema.sql"
        ["next_time_checklist.md"]="docs/next_time_checklist_$(date +%Y-%m-%d).md"
        ["progress_report.md"]="docs/progress_report_$(date +%Y-%m-%d).md"
    )
    
    # Process each file
    for source_file in "${!file_mappings[@]}"; do
        destination="${file_mappings[$source_file]}"
        
        if [[ -f "$source_file" ]]; then
            # Create destination directory if it doesn't exist
            dest_dir="$(dirname "$PROJECT_ROOT/$destination")"
            mkdir -p "$dest_dir"
            
            # Move and rename file
            mv "$source_file" "$PROJECT_ROOT/$destination"
            echo -e "  ${GREEN}✓ Moved:${NC} $source_file → $destination"
            
            # Make shell scripts executable
            if [[ "$destination" == scripts/*.sh ]]; then
                chmod +x "$PROJECT_ROOT/$destination"
                echo -e "    ${BLUE}  Made executable${NC}"
            fi
        else
            echo -e "  ${YELLOW}⚠ Not found:${NC} $source_file"
        fi
    done
}

# Validate TypeScript files
validate_typescript() {
    echo -e "${YELLOW}🔍 Validating TypeScript files...${NC}"
    
    # Check for common React component patterns
    check_react_component() {
        local file="$1"
        if grep -q "export.*React\|export.*Component\|export.*function.*(" "$file" 2>/dev/null; then
            if [[ "$file" != *.tsx ]]; then
                echo -e "  ${RED}❌ Should be .tsx:${NC} $file"
                return 1
            fi
        fi
        return 0
    }
    
    # Check all .ts files in src/
    find "$PROJECT_ROOT/src" -name "*.ts" -type f | while read -r file; do
        if ! check_react_component "$file"; then
            # Suggest renaming
            new_name="${file%.ts}.tsx"
            echo -e "    ${BLUE}💡 Suggest renaming to:${NC} $(basename "$new_name")"
        fi
    done
}

# Update package.json scripts if needed
update_package_scripts() {
    echo -e "${YELLOW}📦 Checking package.json scripts...${NC}"
    
    package_json="$PROJECT_ROOT/package.json"
    if [[ -f "$package_json" ]]; then
        # Check if our custom scripts exist
        if ! grep -q "setup.*scripts/enhanced_setup_auto-fixer.sh" "$package_json"; then
            echo -e "  ${BLUE}💡 Consider adding to package.json:${NC}"
            echo '    "setup": "bash scripts/enhanced_setup_auto-fixer.sh"'
        fi
    fi
}

# Git operations
git_operations() {
    echo -e "${YELLOW}📝 Git operations...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Check if we're in a git repo
    if [[ ! -d ".git" ]]; then
        echo -e "  ${RED}❌ Not a git repository${NC}"
        return 1
    fi
    
    # Check git status
    if [[ -n "$(git status --porcelain)" ]]; then
        echo -e "  ${GREEN}✓ Changes detected${NC}"
        
        # Stage all changes
        git add .
        
        # Commit with timestamp
        commit_msg="Auto-organize files - $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$commit_msg"
        
        echo -e "  ${GREEN}✓ Committed:${NC} $commit_msg"
        
        # Push to origin main (optional)
        if git remote | grep -q "origin"; then
            echo -e "  ${BLUE}🚀 Pushing to origin...${NC}"
            git push origin main || echo -e "  ${YELLOW}⚠ Push failed - check remote${NC}"
        fi
    else
        echo -e "  ${BLUE}ℹ No changes to commit${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Starting enhanced setup process...${NC}"
    # functions
    create_directories
    organize_files
    validate_typescript
    update_package_scripts
    git_operations
    
    echo -e "${GREEN}🎉 Setup complete!${NC}"
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Run: npm install"
    echo "  2. Run: npm start"
    echo "  3. Check: src/components/AuthContext.ts dependencies"
    echo "  4. Review: docs/next_time_checklist_$(date +%Y-%m-%d).md"
}

# Run main function
main "$@"