#!/bin/bash

# Lesson Plan App - Git Synchronization Script
# Purpose: Automated GitHub sync with conflict resolution
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
MAIN_BRANCH="main"
DEV_BRANCH="dev"
REMOTE_NAME="origin"

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

# Check if we're in a git repository
check_git_repo() {
    if [ ! -d ".git" ]; then
        log_error "Not a git repository. Initialize with 'git init' first."
        exit 1
    fi
}

# Check if remote exists
check_remote() {
    if ! git remote get-url $REMOTE_NAME >/dev/null 2>&1; then
        log_error "Remote '$REMOTE_NAME' not found."
        log_info "Add remote with: git remote add $REMOTE_NAME https://github.com/rituzangle/lesson-plan-app.git"
        exit 1
    fi
}

# Get current branch
get_current_branch() {
    git branch --show-current
}

# Check for uncommitted changes
check_uncommitted_changes() {
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Uncommitted changes detected:"
        git status --short
        echo
        read -p "Do you want to commit these changes? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            commit_changes
        else
            log_info "Stashing changes..."
            git stash push -m "Auto-stash before sync $(date)"
            log_success "Changes stashed"
        fi
    fi
}

# Commit changes with automatic message
commit_changes() {
    log_info "Committing changes..."
    
    # Add all files
    git add .
    
    # Generate commit message
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    BRANCH=$(get_current_branch)
    
    # Create detailed commit message
    COMMIT_MSG="Auto-sync: $TIMESTAMP

- Branch: $BRANCH
- Files changed: $(git diff --cached --name-only | wc -l | tr -d ' ')
- Auto-generated commit via git-sync.sh

Changes:
$(git diff --cached --name-only | head -10)"

    git commit -m "$COMMIT_MSG"
    log_success "Changes committed"
}

# Fetch latest changes from remote
fetch_latest() {
    log_info "Fetching latest changes from remote..."
    git fetch $REMOTE_NAME
    log_success "Fetched latest changes"
}

# Pull with rebase to avoid merge commits
pull_with_rebase() {
    local current_branch=$(get_current_branch)
    
    log_info "Pulling changes with rebase..."
    
    if git pull --rebase $REMOTE_NAME $current_branch; then
        log_success "Successfully pulled and rebased"
    else
        log_error "Rebase failed. Manual intervention required."
        log_info "Fix conflicts and run: git rebase --continue"
        log_info "Or abort with: git rebase --abort"
        exit 1
    fi
}

# Push changes to remote
push_changes() {
    local current_branch=$(get_current_branch)
    
    log_info "Pushing changes to remote..."
    
    if git push $REMOTE_NAME $current_branch; then
        log_success "Successfully pushed to $REMOTE_NAME/$current_branch"
    else
        log_error "Push failed. Check remote permissions."
        exit 1
    fi
}

# Sync with specific branch
sync_branch() {
    local target_branch=$1
    local current_branch=$(get_current_branch)
    
    if [ "$current_branch" != "$target_branch" ]; then
        log_info "Switching to $target_branch branch..."
        if git checkout $target_branch; then
            log_success "Switched to $target_branch"
        else
            log_error "Failed to switch to $target_branch"
            exit 1
        fi
    fi
    
    # Pull latest changes
    pull_with_rebase
    
    # Push any local changes
    if [ -n "$(git log $REMOTE_NAME/$target_branch..$target_branch --oneline)" ]; then
        push_changes
    else
        log_info "No local changes to push"
    fi
}

# Show sync status
show_status() {
    log_info "Git Sync Status:"
    echo "==============================================="
    echo "Repository: $(git config --get remote.$REMOTE_NAME.url)"
    echo "Current branch: $(get_current_branch)"
    echo "Last commit: $(git log -1 --format='%h - %s (%cr)' --abbrev-commit)"
    echo
    
    # Check if we're ahead/behind
    local current_branch=$(get_current_branch)
    local ahead=$(git rev-list --count $REMOTE_NAME/$current_branch..$current_branch 2>/dev/null || echo "0")
    local behind=$(git rev-list --count $current_branch..$REMOTE_NAME/$current_branch 2>/dev/null || echo "0")
    
    echo "Sync status:"
    echo "  Ahead: $ahead commits"
    echo "  Behind: $behind commits"
    echo "==============================================="
}

# Main sync function
main_sync() {
    log_info "🔄 Starting Git synchronization..."
    
    # Pre-flight checks
    check_git_repo
    check_remote
    
    # Handle uncommitted changes
    check_uncommitted_changes
    
    # Fetch latest changes
    fetch_latest
    
    # Get current branch
    local current_branch=$(get_current_branch)
    
    # Sync current branch
    sync_branch $current_branch
    
    # Show final status
    show_status
    
    log_success "🎉 Git synchronization completed!"
}

# Quick sync without prompts (for automation)
quick_sync() {
    log_info "🚀 Quick sync mode..."
    
    check_git_repo
    check_remote
    
    # Auto-commit if changes exist
    if [ -n "$(git status --porcelain)" ]; then
        commit_changes
    fi
    
    fetch_latest
    pull_with_rebase
    push_changes
    
    log_success "Quick sync completed!"
}

# Usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message"
    echo "  -q, --quick      Quick sync without prompts"
    echo "  -s, --status     Show sync status only"
    echo "  -b, --branch     Sync specific branch"
    echo
    echo "Examples:"
    echo "  $0                    # Interactive sync"
    echo "  $0 --quick            # Quick automated sync"
    echo "  $0 --status           # Show status only"
    echo "  $0 --branch dev       # Sync dev branch"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_usage
        exit 0
        ;;
    -q|--quick)
        quick_sync
        ;;
    -s|--status)
        check_git_repo
        check_remote
        show_status
        ;;
    -b|--branch)
        if [ -n "$2" ]; then
            check_git_repo
            check_remote
            sync_branch "$2"
        else
            log_error "Branch name required"
            show_usage
            exit 1
        fi
        ;;
    "")
        main_sync
        ;;
    *)
        log_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac