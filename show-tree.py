#!/usr/bin/env python3
"""
Project Tree Viewer
File: scripts/show-tree.py

Display project structure in tree format
"""

import os
from pathlib import Path

def show_tree(directory=".", max_depth=3, current_depth=0):
    """Display directory tree structure"""
    if current_depth > max_depth:
        return
    
    path = Path(directory)
    items = []
    
    try:
        # Get all items and separate directories from files
        for item in sorted(path.iterdir()):
            if item.name.startswith('.') and item.name not in ['.env', '.gitignore']:
                continue  # Skip hidden files except important ones
            items.append(item)
    except PermissionError:
        return
    
    # Print current directory items
    for i, item in enumerate(items):
        is_last = i == len(items) - 1
        prefix = "└── " if is_last else "├── "
        
        if current_depth > 0:
            indent = "    " * (current_depth - 1) + ("    " if is_last else "│   ")
        else:
            indent = ""
        
        # Add file info
        if item.is_dir():
            print(f"{indent}{prefix}{item.name}/")
            # Recurse into subdirectories
            if current_depth < max_depth:
                next_indent = indent + ("    " if is_last else "│   ")
                show_tree(item, max_depth, current_depth + 1)
        else:
            # Show file size for key files
            size = item.stat().st_size
            if size > 1024:
                size_str = f" ({size//1024}kb)"
            else:
                size_str = f" ({size}b)" if size > 0 else ""
            print(f"{indent}{prefix}{item.name}{size_str}")

def main():
    print("📁 Project Structure")
    print("=" * 40)
    show_tree(".", max_depth=3)
    
    print("\n📊 Key Directories:")
    key_dirs = ['src', 'scripts', 'docs', 'node_modules']
    for dir_name in key_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            count = len(list(dir_path.iterdir())) if dir_path.is_dir() else 0
            print(f"  {dir_name}/: {count} items")

if __name__ == "__main__":
    main()
