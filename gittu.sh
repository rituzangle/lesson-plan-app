#!/bin/bash

# A comprehensive git utility script for common operations.

# --- Configuration ---
# The name of the keychain entry holding the GPG password
GPG_KEYCHAIN_SERVICE="picture-this-gpg"

# --- Helper Functions ---

# Fetches the GPG password from the macOS Keychain.
# Exits with an error if the password is not found.
function get_gpg_pass() {
    local pass
    pass=$(security find-generic-password -a "$USER" -s "$GPG_KEYCHAIN_SERVICE" -w)
    if [ -z "$pass" ]; then
        echo "Error: GPG password '$GPG_KEYCHAIN_SERVICE' not found in Keychain."
        echo "Please add it using: security add-generic-password -a \"$USER\" -s \"$GPG_KEYCHAIN_SERVICE\" -w \"YOUR_PASSWORD\""
        exit 1
    fi
    echo "$pass"
}

# Encrypts a single file using GPG with the password from the keychain.
# @param $1: The path to the file to encrypt.
function encrypt_file() {
    local file_to_encrypt="$1"
    if [ ! -f "$file_to_encrypt" ]; then
        echo "Error: File not found at '$file_to_encrypt'"
        return 1
    fi

    local gpg_pass
    gpg_pass=$(get_gpg_pass)

    echo "Encrypting '$file_to_encrypt'..."
    gpg --batch --yes --passphrase "$gpg_pass" --symmetric --cipher-algo AES256 -o "$file_to_encrypt.gpg" "$file_to_encrypt"
    echo "'$file_to_encrypt.gpg' created/updated."
}

# Encrypts and stages sensitive files for pre-commit hook.
# This function should be called by the pre-commit hook.
function encrypt_and_stage_sensitive_files() {
    local sensitive_files=(".env" "src/screens/WebFriendlyLogin.tsx") # Add other sensitive files here

    for file in "${sensitive_files[@]}"; do
        if git diff --cached --name-only | grep -q "^$file$"; then
            echo "Sensitive file '$file' detected in staging. Encrypting..."
            encrypt_file "$file"
            git reset "$file" # Unstage the original file
            git add "$file.gpg" # Stage the encrypted version
            echo "Unstaged '$file' and staged '$file.gpg'."
        fi
    done

    # Check if any unencrypted sensitive files are still staged
    for file in "${sensitive_files[@]}"; do
        if git diff --cached --name-only | grep -q "^$file$"; then
            echo "Error: Unencrypted sensitive file '$file' is still staged. Aborting commit."
            exit 1
        fi
    done
}

# --- Main Commands ---

# Shows a detailed git status, including ignored files that may have been added.
function command_status() {
    echo "--- Git Status ---"
    git status
    echo ""
    echo "--- Potentially Ignored Files (that are tracked) ---"
    git ls-files --ignored --exclude-standard
    echo "------------------"
}

# The main commit workflow.
function command_commit() {
    # 0. Run the cleanup script first
    if [ -f "../reXexl.sh" ]; then
        echo "--- Running Cleanup Script ---"
        ../reXexl.sh
        echo "Cleanup done."
    else
        echo "Warning: ../reXexl.sh not found, skipping."
    fi

    # 1. Prompt for commit message
    echo ""
    echo "--- Committing Files ---"
    local default_commit_msg="Deploy updates $(date +%b-%d-%Y)"
    read -p "Enter commit message (or press Enter for default: '$default_commit_msg'): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="$default_commit_msg"
    fi

    # 2. Execute git commit (pre-commit hook will run automatically)
    git commit -m "$commit_msg"
    local commit_status=$? # Capture the exit status of git commit

    if [ $commit_status -ne 0 ]; then
        echo "Git commit failed. Aborting push."
        return $commit_status
    fi

    # 3. Push
    echo ""
    echo "--- Pushing to Remote ---"
    local current_branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    read -p "Do you want to push to origin $current_branch? (y/n): " push_confirm
    if [[ "$push_confirm" == "y" ]]; then
        git push -u origin "$current_branch"
    else
        echo "Push skipped. Run 'git push' manually."
    fi
}

# Restores files to a previous state.
function command_restore() {
    echo "--- Restore Menu ---"
    echo "1. Unstage a specific file (git reset <file>)"
    echo "2. Unstage all files (git reset)"
    echo "3. Discard all local changes (git restore .)"
    read -p "Choose an option (1-3): " choice

    case "$choice" in
        1)
            read -p "Enter the path of the file to unstage: " file_to_unstage
            if [ -n "$file_to_unstage" ]; then
                echo "Unstaging '$file_to_unstage'..."
                git reset "$file_to_unstage"
            else
                echo "No file specified."
            fi
            ;;
        2)
            echo "Unstaging all files..."
            git reset
            ;;
        3)
            read -p "Are you sure you want to discard ALL local changes? This cannot be undone. (y/n): " confirm
            if [[ "$confirm" == "y" ]]; then
                echo "Discarding all local changes..."
                git restore .
            else
                echo "Restore cancelled."
            fi
            ;;
        *)
            echo "Invalid option."
            ;;
    esac
}

# Provides tools to fix common git issues.
function command_fix() {
    echo "--- Fix-it Menu ---"
    echo "1. Untrack a file (but keep it locally)"
    echo "2. Forcefully remove all untracked files"
    read -p "Choose an option (1-2): " choice

    case "$choice" in
        1)
            read -p "Enter the path of the file to untrack: " file_to_untrack
            if [ -n "$file_to_untrack" ]; then
                git rm --cached "$file_to_untrack"
            else
                echo "No file specified."
            fi
            ;;
        2)
            read -p "Are you sure you want to DELETE all untracked files/directories? This is permanent. (y/n): " confirm
            if [[ "$confirm" == "y" ]]; then
                echo "Cleaning untracked files..."
                git clean -fd
            else
                echo "Clean cancelled."
            fi
            ;;
        *)
            echo "Invalid option."
            ;;
    esac
}

# --- Script Entrypoint ---

# Shows an interactive menu for the user to choose a command.
function show_menu() {
    while true; do
        echo ""
        echo "--- Gittu Main Menu ---"
        echo "Please choose a command:"
        echo "1. status    - Show git status and ignored files."
        echo "2. add       - Stage all new and modified files."
        echo "3. commit    - Start the full encrypt, add, commit, push workflow."
        echo "4. encrypt   - Encrypt a specific file."
        echo "5. restore   - Unstage or discard local changes."
        echo "6. fix       - Tools to fix common problems."
        echo "7. rebase    - Start an interactive rebase on main."
        echo "8. exit      - Exit the script."
        echo "-----------------------"
        read -p "Enter your choice (1-8): " choice

        case "$choice" in
            1) command_status ;;
            2)
                echo "--- Staging Files ---"
                git add .
                echo "All new and modified files have been staged."
                ;;
            3) command_commit ;;
            4)
                read -p "Enter the path of the file to encrypt: " file_to_encrypt
                if [ -n "$file_to_encrypt" ]; then
                    encrypt_file "$file_to_encrypt"
                else
                    echo "Error: No file path provided."
                fi
                ;;
            5) command_restore ;;
            6) command_fix ;;
            7)
                local current_branch
                current_branch=$(git rev-parse --abbrev-ref HEAD)
                echo "Starting interactive rebase on '$current_branch'..."
                git rebase -i "$current_branch"
                ;;
            8)
                echo "Exiting."
                break
                ;;
            *) echo "Invalid choice. Please try again." ;;
        esac
    done
}

# If a command is provided, execute it directly. Otherwise, show the menu.
if [ -n "$1" ]; then
    case "$1" in
        status) command_status ;;
        add)
            echo "--- Staging Files ---"
            git add .
            echo "All new and modified files have been staged."
            ;;
        commit) command_commit ;;
        encrypt)
            if [ -n "$2" ]; then
                encrypt_file "$2"
            else
                echo "Error: Please provide the path to the file to encrypt."
                echo "Usage: ./gittu.sh encrypt [file_path]"
            fi
            ;;
        restore) command_restore ;;
        fix) command_fix ;;
        rebase)
            local current_branch
            current_branch=$(git rev-parse --abbrev-ref HEAD)
            echo "Starting interactive rebase on '$current_branch'..."
            git rebase -i "$current_branch"
            ;;
        pre-commit-encrypt) encrypt_and_stage_sensitive_files ;;
        *)
            echo "Error: Unknown command '$1'"
            echo "Run './gittu.sh' without arguments to see the menu."
            exit 1
            ;;
    esac
else
    show_menu
fi