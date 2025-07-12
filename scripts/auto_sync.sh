#!/bin/bash

# auto_sync.sh
# Final destination: scripts/auto_sync.sh
# 
# Auto-sync changes to GitHub to minimize message size limits
# Creates commit with descriptive messages and pushes automatically

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

echo -e "${GREEN}Lesson Plan App - Auto Sync${NC}"
echo "Project: $PROJECT_ROOT"
echo "Branch: $BRANCH"
echo "Time: $TIMESTAMP"
echo ""

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}Error: Not a git repository${NC}"
        echo "Run: git init && git remote add origin <your-repo-url>"
        exit 1
    fi
}

# Function to check for uncommitted changes
check_changes() {
    if git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}No changes to commit${NC}"
        return 1
    