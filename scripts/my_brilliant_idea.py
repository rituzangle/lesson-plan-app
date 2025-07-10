#!/usr/bin/env python3

"""
Put this in the project tools folder or alongside 
the template markdown file PROJECT_GUIDE.md

create_project_guide.py

✨ Copies PROJECT_GUIDE.md template into a target folder,
replaces placeholders (repo name, date), and helps set up Git & GitHub.
Friendly for beginners & advanced users alike.

Usage:
  python create_project_guide.py <target_folder> <repo_name>

Example:
  python create_project_guide.py ../my-new-project lesson-plan-app
"""

import sys
import subprocess
import platform
from pathlib import Path
from datetime import datetime
from shutil import which

def ask_yes_no(prompt):
    reply = input(f"{prompt} [y/n]: ").strip().lower()
    return reply in ("y", "yes")

def suggest_install_gh_cli():
    os_name = platform.system()
    print("\n❓ GitHub CLI (`gh`) not found.")
    print("The GitHub CLI helps create repos, manage issues, etc.")
    print("Official site: https://cli.github.com/")
    if os_name == "Darwin":
        print("👉 Install with Homebrew: brew install gh")
    elif os_name == "Linux":
        print("👉 Install with apt (Debian/Ubuntu): sudo apt install gh")
        print("Or check your distro: https://cli.github.com/manual/installation")
    elif os_name == "Windows":
        print("👉 Use winget: winget install --id GitHub.cli")
    else:
        print("Check https://cli.github.com/ for your OS.")
    print("After install, run: gh auth login\n")

def try_add_remote(remote_url, target_folder, repo_name):
    print(f"\n🔧 Trying to add remote: {remote_url}")
    result = subprocess.run(
        ["git", "remote", "add", "origin", remote_url],
        cwd=target_folder,
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"⚠️ Could not add remote: {result.stderr.strip()}")
        if which("gh") is None:
            suggest_install_gh_cli()
        else:
            if ask_yes_no("Try to auto-create the repo with GitHub CLI (`gh`)?"):
                gh_result = subprocess.run(
                    ["gh", "repo", "create", f"rituzangle/{repo_name}", "--private", "--source=.", "--remote=origin", "--push"],
                    cwd=target_folder
                )
                if gh_result.returncode == 0:
                    print("✅ Repo created & pushed.")
                else:
                    print("❌ GitHub CLI failed. Please check auth or create manually.")
        print("\n📄 Manual steps if needed:")
        print(f"  git remote add origin {remote_url}")
        print("  git push -u origin main")
    else:
        print("✅ Remote added successfully.")

def main():
    if len(sys.argv) != 3:
        print("Usage: python create_project_guide.py <target_folder> <repo_name>")
        sys.exit(1)

    target_folder = Path(sys.argv[1])
    repo_name = sys.argv[2]
    template_file = Path(__file__).parent / "PROJECT_GUIDE.md"

    if not template_file.exists():
        print(f"❌ Template file not found: {template_file}")
        sys.exit(1)

    target_folder.mkdir(parents=True, exist_ok=True)
    today = datetime.now().strftime("%Y-%m-%d")

    with open(template_file, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("<REPO-NAME>", repo_name)
    content = content.replace("2025-07-09", today)
    content = content.replace(
        "git@github.com:rituzangle/<REPO-NAME>.git",
        f"git@github.com:rituzangle/{repo_name}.git"
    )

    output_file = target_folder / "PROJECT_GUIDE.md"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"✅ Created: {output_file}")

    # Check Git
    if which("git") is None:
        print("\n❌ Git not found! Please install Git first: https://git-scm.com/")
        return

    git_dir = target_folder / ".git"
    if not git_dir.exists():
        if ask_yes_no("No Git repo found. Initialize a new Git repository?"):
            subprocess.run(["git", "init"], cwd=target_folder)
            subprocess.run(["git", "add", "PROJECT_GUIDE.md"], cwd=target_folder)
            subprocess.run(["git", "commit", "-m", "Initial commit with PROJECT_GUIDE.md"], cwd=target_folder)
            print("✅ Initialized Git and made initial commit.")
            if ask_yes_no("Add remote GitHub URL?"):
                remote_url = f"git@github.com:rituzangle/{repo_name}.git"
                try_add_remote(remote_url, target_folder, repo_name)
        else:
            print("ℹ️ Skipped Git setup.")
    else:
        print("ℹ️ Git repo already exists in target folder.")

    print("\n🎉 All done! Happy coding 🪄")

if __name__ == "__main__":
    main()
#
