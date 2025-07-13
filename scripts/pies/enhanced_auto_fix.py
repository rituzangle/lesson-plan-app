#!/usr/bin/env python3
"""
Enhanced Auto-Fix Script for Lesson Plan App
Builds on your existing run_analysis.py to actually fix the issues
File: scripts/enhanced_auto_fix.py
"""

import os
import shutil
import subprocess
import json
from pathlib import Path
from datetime import datetime
import re

class EnhancedAutoFixer:
    def __init__(self, project_root=None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        self.downloads_dir = self.project_root / "downloads"
        self.src_dir = self.project_root / "src"
        self.scripts_dir = self.project_root / "scripts"
        self.changes_made = []
        
    def log_change(self, action, old_path, new_path=None):
        """Log changes for commit message"""
        change = {
            "action": action,
            "old_path": str(old_path),
            "new_path": str(new_path) if new_path else None,
            "timestamp": datetime.now().isoformat()
        }
        self.changes_made.append(change)
        
    def has_jsx_content(self, file_path):
        """Check if file contains JSX elements"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # JSX patterns
            jsx_patterns = [
                r'<\w+[^>]*>',  # Opening tags
                r'<\/\w+>',     # Closing tags
                r'<\w+\s*\/>', # Self-closing tags
                r'return\s*\(',  # React return statements
                r'React\.',     # React usage
                r'jsx',         # JSX in comments
                r'\.jsx',       # JSX extensions
            ]
            
            for pattern in jsx_patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    return True
            return False
            
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")
            return False
    
    def fix_file_extension(self, file_path):
        """Fix .ts to .tsx if file contains JSX"""
        if not file_path.suffix == '.ts':
            return file_path
            
        if self.has_jsx_content(file_path):
            new_path = file_path.with_suffix('.tsx')
            if file_path.exists():
                shutil.move(str(file_path), str(new_path))
                self.log_change("extension_fix", file_path, new_path)
                print(f"🔧 Fixed: {file_path.name} → {new_path.name}")
                return new_path
        
        return file_path
    
    def get_destination_path(self, filename):
        """Smart destination mapping based on filename"""
        mapping = {
            # Main app files
            'app_with_auth.ts': 'src/App.tsx',
            'App.ts': 'src/App.tsx',
            
            # Services
            'auth_service.ts': 'src/services/authService.ts',
            'encryption_service.ts': 'src/services/encryptionService.ts',
            'storage_service.ts': 'src/services/storageService.ts',
            'auth.ts': 'src/services/auth.ts',
            
            # Types
            'auth_types.ts': 'src/types/auth.ts',
            'types.ts': 'src/types/index.ts',
            
            # Utils
            'accessibility_constants.ts': 'src/utils/accessibilityConstants.ts',
            'accessible_login.ts': 'src/utils/accessibleLogin.ts',
            'essential_components.ts': 'src/utils/essentialComponents.ts',
            'database-test.ts': 'src/utils/databaseTest.ts',
            
            # Scripts
            'enhanced_setup_auto-fixer.sh': 'scripts/enhanced_setup_auto_fixer.sh',
            'smart_test_runner.sh': 'scripts/smart_test_runner.sh',
            'test_runner.sh': 'scripts/test_runner.sh',
            
            # Data
            'sample_curriculum_data.json': 'src/data/sampleCurriculumData.json',
            'supabase_schema.sql': 'database/schema.sql',
            
            # Curriculum files
            'performing_arts_curriculum.ts': 'src/data/curriculums/performingArts.ts',
            'performing_arts_templates.ts': 'src/data/templates/performingArts.ts',
        }
        
        return mapping.get(filename, f'src/utils/{filename}')
    
    def compare_files(self, source_path, dest_path):
        """Compare file timestamps and content to determine action"""
        if not dest_path.exists():
            return "move"  # Destination doesn't exist, safe to move
            
        source_time = source_path.stat().st_mtime
        dest_time = dest_path.stat().st_mtime
        
        # Check if files are identical
        try:
            with open(source_path, 'r', encoding='utf-8') as f1, \
                 open(dest_path, 'r', encoding='utf-8') as f2:
                if f1.read() == f2.read():
                    return "identical"  # Same content, can remove source
        except:
            pass  # Binary files or read errors, continue with time comparison
        
        if source_time > dest_time:
            return "update"  # Source is newer, update destination
        elif source_time < dest_time:
            return "skip"    # Destination is newer, skip
        else:
            return "conflict"  # Same timestamp, different content
    
    def move_file_to_destination(self, source_path, destination_path):
        """Move file to destination with smart conflict resolution"""
        dest_path = self.project_root / destination_path
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        
        if not source_path.exists():
            return None
            
        # Check for conflicts
        action = self.compare_files(source_path, dest_path)
        
        if action == "move":
            # Safe to move - no destination file
            shutil.move(str(source_path), str(dest_path))
            self.log_change("file_move", source_path, dest_path)
            print(f"📁 Moved: {source_path.name} → {destination_path}")
            return dest_path
            
        elif action == "update":
            # Source is newer - backup and update
            backup_path = dest_path.with_suffix(f'.backup.{datetime.now().strftime("%Y%m%d_%H%M%S")}{dest_path.suffix}')
            shutil.copy2(str(dest_path), str(backup_path))
            shutil.move(str(source_path), str(dest_path))
            self.log_change("file_update", source_path, dest_path)
            print(f"🔄 Updated: {source_path.name} → {destination_path} (backup created)")
            return dest_path
            
        elif action == "skip":
            # Destination is newer - keep existing, remove source
            source_path.unlink()
            self.log_change("file_skip", source_path, dest_path)
            print(f"⏭️  Skipped: {source_path.name} (destination newer)")
            return dest_path
            
        elif action == "identical":
            # Files are identical - remove source
            source_path.unlink()
            self.log_change("file_identical", source_path, dest_path)
            print(f"♻️  Identical: {source_path.name} (source removed)")
            return dest_path
            
        else:  # conflict
            # Same timestamp, different content - manual resolution needed
            conflict_path = dest_path.with_suffix(f'.conflict.{datetime.now().strftime("%Y%m%d_%H%M%S")}{dest_path.suffix}')
            shutil.move(str(source_path), str(conflict_path))
            self.log_change("file_conflict", source_path, conflict_path)
            print(f"⚠️  Conflict: {source_path.name} → {conflict_path.name} (manual review needed)")
            return conflict_path
    
    def fix_imports_in_file(self, file_path):
        """Update import statements to match new file locations"""
        if not file_path.exists() or file_path.suffix not in ['.ts', '.tsx', '.js', '.jsx']:
            return
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Common import fixes
            import_fixes = [
                (r'from [\'"]\.\.\/\.\.\/services\/auth[\'"]', 'from "../services/auth"'),
                (r'from [\'"]\.\.\/services\/authService[\'"]', 'from "../services/authService"'),
                (r'from [\'"]\.\.\/types\/auth[\'"]', 'from "../types/auth"'),
                (r'from [\'"]\.\.\/utils\/accessibility[\'"]', 'from "../utils/accessibilityConstants"'),
            ]
            
            original_content = content
            for pattern, replacement in import_fixes:
                content = re.sub(pattern, replacement, content)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                self.log_change("import_fix", file_path)
                print(f"🔗 Fixed imports in: {file_path.name}")
                
        except Exception as e:
            print(f"⚠️  Error fixing imports in {file_path}: {e}")
    
    def organize_downloads(self):
        """Organize files from downloads directory"""
        if not self.downloads_dir.exists():
            print("📁 No downloads directory found")
            return
            
        print(f"🔄 Organizing downloads from: {self.downloads_dir}")
        
        for file_path in self.downloads_dir.iterdir():
            if file_path.is_file():
                # Get destination
                destination = self.get_destination_path(file_path.name)
                
                # Move file
                new_path = self.move_file_to_destination(file_path, destination)
                
                # Fix extension if needed
                if new_path:
                    fixed_path = self.fix_file_extension(new_path)
                    # Fix imports
                    self.fix_imports_in_file(fixed_path)
    
    def fix_existing_extensions(self):
        """Fix extensions in existing src files"""
        print("🔧 Fixing extensions in src directory...")
        
        for file_path in self.src_dir.rglob("*.ts"):
            if file_path.exists():
                self.fix_file_extension(file_path)
    
    def create_commit_message(self):
        """Generate descriptive commit message"""
        if not self.changes_made:
            return "🔧 No changes made"
            
        moves = len([c for c in self.changes_made if c["action"] == "file_move"])
        updates = len([c for c in self.changes_made if c["action"] == "file_update"])
        skips = len([c for c in self.changes_made if c["action"] == "file_skip"])
        conflicts = len([c for c in self.changes_made if c["action"] == "file_conflict"])
        extensions = len([c for c in self.changes_made if c["action"] == "extension_fix"])
        imports = len([c for c in self.changes_made if c["action"] == "import_fix"])
        
        message = f"🔧 Smart auto-fix: {moves} moves, {updates} updates, {extensions} extensions\n\n"
        
        if conflicts > 0:
            message += f"⚠️  {conflicts} conflicts need manual review\n"
        if skips > 0:
            message += f"⏭️  {skips} files skipped (destination newer)\n"
            
        message += "\nChanges:\n"
        for change in self.changes_made[:10]:  # Limit to first 10 for readability
            action_emoji = {
                "file_move": "📁", 
                "file_update": "🔄", 
                "file_skip": "⏭️", 
                "file_conflict": "⚠️",
                "extension_fix": "🔧", 
                "import_fix": "🔗"
            }
            emoji = action_emoji.get(change["action"], "📝")
            old_name = Path(change['old_path']).name
            new_name = Path(change['new_path']).name if change['new_path'] else ""
            message += f"{emoji} {old_name} → {new_name}\n"
                
        return message
    
    def commit_changes(self):
        """Commit changes to git"""
        try:
            # Add all changes
            subprocess.run(["git", "add", "."], cwd=self.project_root, check=True)
            
            # Create commit message
            commit_msg = self.create_commit_message()
            
            # Commit
            subprocess.run(["git", "commit", "-m", commit_msg], cwd=self.project_root, check=True)
            
            print(f"✅ Changes committed to git")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Git commit failed: {e}")
            return False
    
    def run(self, commit=True):
        """Run the complete auto-fix process"""
        print("🚀 ENHANCED AUTO-FIX STARTING")
        print("=" * 50)
        
        # Step 1: Organize downloads
        self.organize_downloads()
        
        # Step 2: Fix existing extensions
        self.fix_existing_extensions()
        
        # Step 3: Summary
        print("\n" + "=" * 50)
        print(f"✅ SMART AUTO-FIX COMPLETE")
        print(f"📊 Total changes: {len(self.changes_made)}")
        
        if self.changes_made:
            print("\n🔍 CHANGES MADE:")
            action_counts = {}
            for change in self.changes_made:
                action_counts[change["action"]] = action_counts.get(change["action"], 0) + 1
                
            action_emoji = {
                "file_move": "📁 Moved", 
                "file_update": "🔄 Updated", 
                "file_skip": "⏭️ Skipped", 
                "file_conflict": "⚠️ Conflicts",
                "file_identical": "♻️ Identical",
                "extension_fix": "🔧 Extensions", 
                "import_fix": "🔗 Imports"
            }
            
            for action, count in action_counts.items():
                emoji_text = action_emoji.get(action, f"📝 {action}")
                print(f"{emoji_text}: {count}")
            
            # Show conflicts that need attention
            conflicts = [c for c in self.changes_made if c["action"] == "file_conflict"]
            if conflicts:
                print(f"\n⚠️  CONFLICTS NEEDING MANUAL REVIEW:")
                for conflict in conflicts:
                    print(f"   📄 {Path(conflict['new_path']).name}")
        
        # Step 4: Commit changes
        if commit and self.changes_made:
            conflicts = [c for c in self.changes_made if c["action"] == "file_conflict"]
            if conflicts:
                print(f"\n⚠️  Cannot auto-commit: {len(conflicts)} conflicts need manual resolution")
            else:
                self.commit_changes()
        
        print("\n🎉 Ready to run: npm start")

def main():
    """Main execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Enhanced Auto-Fix for Lesson Plan App")
    parser.add_argument("--no-commit", action="store_true", help="Don't commit changes")
    parser.add_argument("--project-root", help="Project root directory")
    
    args = parser.parse_args()
    
    fixer = EnhancedAutoFixer(args.project_root)
    fixer.run(commit=not args.no_commit)

if __name__ == "__main__":
    main()
