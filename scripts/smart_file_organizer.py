#!/usr/bin/env python3
"""
Smart File Organizer - Auto-Fix Based on Analysis
Path: scripts/smart_file_organizer.py
Purpose: Automatically organize files based on project_analyzer.py results
"""

import os
import shutil
import json
from pathlib import Path
from typing import Dict, List, Optional
import subprocess
from datetime import datetime
from project_analyzer import ProjectAnalyzer

class SmartFileOrganizer:
    """Intelligent file organizer that uses analysis results"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root).resolve()
        self.analyzer = ProjectAnalyzer(project_root)
        self.dry_run = False
        self.changes_made = []
        
    def create_directories(self, directories: List[str]) -> None:
        """Create necessary directories"""
        for dir_path in directories:
            full_path = self.project_root / dir_path
            if not full_path.exists():
                if not self.dry_run:
                    full_path.mkdir(parents=True, exist_ok=True)
                print(f"📁 Created directory: {dir_path}")
                self.changes_made.append(f"Created directory: {dir_path}")
    
    def move_and_rename_file(self, source: Path, destination: str) -> bool:
        """Move and rename a file, handling extension changes"""
        dest_path = self.project_root / destination
        
        # Create destination directory if it doesn't exist
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        
        try:
            if not self.dry_run:
                if dest_path.exists():
                    backup_path = dest_path.with_suffix(dest_path.suffix + '.backup')
                    shutil.move(str(dest_path), str(backup_path))
                    print(f"⚠️  Backed up existing file: {destination} → {destination}.backup")
                
                shutil.move(str(source), str(dest_path))
            
            print(f"✅ Moved: {source.name} → {destination}")
            self.changes_made.append(f"Moved: {source.name} → {destination}")
            return True
            
        except Exception as e:
            print(f"❌ Error moving {source.name}: {e}")
            return False
    
    def fix_extension(self, filepath: Path, new_extension: str) -> bool:
        """Rename file with correct extension"""
        new_path = filepath.with_suffix(new_extension)
        
        try:
            if not self.dry_run:
                filepath.rename(new_path)
            
            print(f"🔧 Fixed extension: {filepath.name} → {new_path.name}")
            self.changes_made.append(f"Fixed extension: {filepath.name} → {new_path.name}")
            return True
            
        except Exception as e:
            print(f"❌ Error fixing extension for {filepath.name}: {e}")
            return False
    
    def organize_downloads(self, destination_suggestions: Dict[str, str]) -> None:
        """Organize files from downloads directory"""
        downloads_dir = self.project_root / "downloads"
        
        if not downloads_dir.exists():
            print("📂 No downloads directory found")
            return
        
        print(f"\n🔄 Organizing downloads directory...")
        
        for filename, destination in destination_suggestions.items():
            source_path = downloads_dir / filename
            
            if source_path.exists():
                success = self.move_and_rename_file(source_path, destination)
                
                # Make shell scripts executable
                if destination.endswith('.sh') and success and not self.dry_run:
                    dest_path = self.project_root / destination
                    dest_path.chmod(0o755)
                    print(f"🔧 Made executable: {destination}")
            else:
                print(f"⚠️  File not found: {filename}")
    
    def fix_extensions(self, extension_issues: List[Dict]) -> None:
        """Fix file extensions based on analysis"""
        print(f"\n🔧 Fixing file extensions...")
        
        for issue in extension_issues:
            if issue['confidence'] > 0.6:  # Only fix high-confidence issues
                filepath = Path(issue['file'])
                if filepath.exists():
                    self.fix_extension(filepath, issue['suggested'])
    
    def run_git_operations(self) -> None:
        """Run git operations to commit changes"""
        if self.dry_run:
            print("\n🔄 Would run git operations (dry run)")
            return
        
        try:
            # Check if we're in a git repository
            subprocess.run(['git', 'status'], 
                         cwd=self.project_root, 
                         capture_output=True, 
                         check=True)
            
            # Stage all changes
            subprocess.run(['git', 'add', '.'], 
                         cwd=self.project_root, 
                         check=True)
            
            # Commit changes
            commit_message = f"Auto-organize files - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            subprocess.run(['git', 'commit', '-m', commit_message], 
                         cwd=self.project_root, 
                         check=True)
            
            print(f"✅ Git commit successful: {commit_message}")
            self.changes_made.append(f"Git commit: {commit_message}")
            
            # Push to origin (optional)
            try:
                subprocess.run(['git', 'push', 'origin', 'main'], 
                             cwd=self.project_root, 
                             check=True,
                             capture_output=True)
                print("🚀 Pushed to origin/main")
            except subprocess.CalledProcessError:
                print("⚠️  Push failed - check remote configuration")
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Git operation failed: {e}")
        except FileNotFoundError:
            print("⚠️  Git not found - skipping git operations")
    
    def validate_typescript(self) -> bool:
        """Validate TypeScript compilation"""
        try:
            result = subprocess.run(['npx', 'tsc', '--noEmit'], 
                                  cwd=self.project_root,
                                  capture_output=True,
                                  text=True)
            
            if result.returncode == 0:
                print("✅ TypeScript validation passed")
                return True
            else:
                print(f"❌ TypeScript validation failed:")
                print(result.stdout)
                print(result.stderr)
                return False
                
        except FileNotFoundError:
            print("⚠️  TypeScript not found - skipping validation")
            return False
    
    def organize_project(self, dry_run: bool = False) -> Dict:
        """Main organization function"""
        self.dry_run = dry_run
        self.changes_made = []
        
        print("🚀 Starting smart file organization...")
        if dry_run:
            print("🔍 DRY RUN MODE - No changes will be made")
        
        # Get analysis report
        report = self.analyzer.generate_report()
        
        # Create necessary directories
        required_dirs = [
            'src/components',
            'src/services', 
            'src/types',
            'src/data/curriculum',
            'src/data/templates',
            'src/data/samples',
            'src/database',
            'src/screens',
            'src/utils',
            'src/constants',
            'database',
            'docs',
            'scripts',
            'tests'
        ]
        
        self.create_directories(required_dirs)
        
        # Organize downloads
        if report['destination_suggestions']:
            self.organize_downloads(report['destination_suggestions'])
        
        # Fix extensions
        if report['extension_issues']:
            self.fix_extensions(report['extension_issues'])
        
        # Validate TypeScript (if not dry run)
        if not dry_run:
            self.validate_typescript()
        
        # Git operations
        if not dry_run and self.changes_made:
            self.run_git_operations()
        
        # Generate summary
        summary = {
            'timestamp': datetime.now().isoformat(),
            'dry_run': dry_run,
            'changes_made': self.changes_made,
            'total_changes': len(self.changes_made)
        }
        
        print(f"\n🎉 Organization complete!")
        print(f"📊 Total changes: {len(self.changes_made)}")
        
        return summary

def main():
    """Main execution function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Smart file organizer for React/TypeScript projects')
    parser.add_argument('--project-root', default='.', help='Project root directory')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done without making changes')
    parser.add_argument('--output', help='Save summary to JSON file')
    
    args = parser.parse_args()
    
    organizer = SmartFileOrganizer(args.project_root)
    summary = organizer.organize_project(dry_run=args.dry_run)
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(summary, f, indent=2)
        print(f"\n💾 Summary saved to: {args.output}")

if __name__ == "__main__":
    main()
