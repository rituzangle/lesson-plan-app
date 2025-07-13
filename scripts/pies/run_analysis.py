#!/usr/bin/env python3
"""
Quick Analysis Runner
Path: scripts/run_analysis.py
Purpose: One-command analysis and organization
"""

import sys
import os
from pathlib import Path

# Add scripts directory to path so we can import our modules
scripts_dir = Path(__file__).parent
sys.path.insert(0, str(scripts_dir))

from project_analyzer import ProjectAnalyzer
from smart_file_organizer import SmartFileOrganizer

def main():
    print("🎯 LESSON PLAN APP - SMART FILE ANALYZER")
    print("="*50)
    
    # Check if we're in the right directory
    current_dir = Path.cwd()
    if not (current_dir / "package.json").exists():
        print("❌ Error: package.json not found")
        print("   Please run this script from your project root directory")
        sys.exit(1)
    
    # Step 1: Analyze the project
    print("\n1️⃣ ANALYZING PROJECT...")
    analyzer = ProjectAnalyzer()
    report = analyzer.generate_report()
    analyzer.print_report(report)
    
    # Step 2: Ask user what to do
    print("\n2️⃣ WHAT WOULD YOU LIKE TO DO?")
    print("   1. Show detailed analysis only")
    print("   2. Dry run (show what would be fixed)")
    print("   3. Fix all issues automatically")
    print("   4. Exit")
    
    while True:
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            # Show detailed analysis
            print("\n📋 DETAILED ANALYSIS:")
            for category, files in report['detailed_analysis'].items():
                if files:
                    print(f"\n{category.upper()}:")
                    for file_analysis in files:
                        print(f"  📄 {Path(file_analysis.filepath).name}")
                        print(f"     Current: {file_analysis.current_extension}")
                        print(f"     Suggested: {file_analysis.suggested_extension}")
                        print(f"     Reason: {file_analysis.reason}")
                        print(f"     Confidence: {file_analysis.confidence:.1f}")
                        print(f"     Contains JSX: {file_analysis.contains_jsx}")
                        print(f"     Contains React: {file_analysis.contains_react_imports}")
            break
            
        elif choice == "2":
            # Dry run
            print("\n🔍 DRY RUN - Showing what would be changed:")
            organizer = SmartFileOrganizer()
            organizer.organize_project(dry_run=True)
            break
            
        elif choice == "3":
            # Fix automatically
            print("\n🔧 FIXING ISSUES AUTOMATICALLY...")
            confirm = input("Are you sure? This will move files and commit to git (y/N): ").strip().lower()
            if confirm == 'y':
                organizer = SmartFileOrganizer()
                organizer.organize_project(dry_run=False)
            else:
                print("Operation cancelled")
            break
            
        elif choice == "4":
            print("👋 Goodbye!")
            sys.exit(0)
            
        else:
            print("Invalid choice. Please enter 1, 2, 3, or 4.")
    
    # Step 3: Show next steps
    print("\n3️⃣ NEXT STEPS:")
    print("   • Run: npm install")
    print("   • Run: npm start")
    print("   • Check: src/components/AuthContext.ts dependencies")
    print("   • Test: npx tsc --noEmit")

if __name__ == "__main__":
    main()
