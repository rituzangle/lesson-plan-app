#!/usr/bin/env python3
"""
Project Status Analyzer for Lesson Plan App
File: scripts/project-status-analyzer.py

Comprehensive project health check that analyzes:
- Code completeness and architecture
- Dependencies and environment
- Documentation status
- Git status and sync
- Next steps recommendations
"""

import os
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
import re

class ProjectAnalyzer:
    def __init__(self, project_root="."):
        self.project_root = Path(project_root).resolve()
        self.report = {
            "timestamp": datetime.now().isoformat(),
            "project_root": str(self.project_root),
            "sections": {}
        }
        
    def check_git_status(self):
        """Check git repository status and sync"""
        try:
            # Check if we're in a git repo
            result = subprocess.run(['git', 'status', '--porcelain'], 
                                  capture_output=True, text=True, cwd=self.project_root)
            
            git_info = {
                "is_git_repo": result.returncode == 0,
                "uncommitted_changes": len(result.stdout.strip()) > 0,
                "changes": result.stdout.strip().split('\n') if result.stdout.strip() else []
            }
            
            # Get current branch
            branch_result = subprocess.run(['git', 'branch', '--show-current'], 
                                         capture_output=True, text=True, cwd=self.project_root)
            git_info["current_branch"] = branch_result.stdout.strip()
            
            # Check if ahead/behind remote
            status_result = subprocess.run(['git', 'status', '-b', '--porcelain'], 
                                         capture_output=True, text=True, cwd=self.project_root)
            git_info["sync_status"] = "synced"
            if "ahead" in status_result.stdout or "behind" in status_result.stdout:
                git_info["sync_status"] = "needs_sync"
                
            return git_info
        except Exception as e:
            return {"error": str(e), "is_git_repo": False}

    def check_project_structure(self):
        """Analyze project structure and completeness"""
        expected_structure = {
            "package.json": "required",
            "src/": "required",
            "src/components/": "required",
            "src/screens/": "required",
            "src/utils/": "recommended",
            "src/types/": "recommended",
            "docs/": "recommended",
            "scripts/": "recommended",
            ".env": "required",
            "README.md": "required"
        }
        
        structure_status = {}
        for path, importance in expected_structure.items():
            full_path = self.project_root / path
            structure_status[path] = {
                "exists": full_path.exists(),
                "importance": importance,
                "type": "directory" if path.endswith('/') else "file"
            }
            
        return structure_status

    def check_dependencies(self):
        """Check package.json and dependencies"""
        package_json_path = self.project_root / "package.json"
        if not package_json_path.exists():
            return {"error": "package.json not found"}
            
        try:
            with open(package_json_path, 'r') as f:
                package_data = json.load(f)
                
            # Check if node_modules exists
            node_modules_exists = (self.project_root / "node_modules").exists()
            
            return {
                "package_json_exists": True,
                "node_modules_exists": node_modules_exists,
                "dependencies_count": len(package_data.get("dependencies", {})),
                "dev_dependencies_count": len(package_data.get("devDependencies", {})),
                "scripts": list(package_data.get("scripts", {}).keys()),
                "needs_npm_install": not node_modules_exists
            }
        except Exception as e:
            return {"error": str(e)}

    def check_env_config(self):
        """Check environment configuration"""
        env_path = self.project_root / ".env"
        if not env_path.exists():
            return {"exists": False, "supabase_configured": False}
            
        try:
            with open(env_path, 'r') as f:
                env_content = f.read()
                
            has_supabase_url = "SUPABASE_URL" in env_content
            has_supabase_key = "SUPABASE_ANON_KEY" in env_content
            
            return {
                "exists": True,
                "supabase_configured": has_supabase_url and has_supabase_key,
                "has_supabase_url": has_supabase_url,
                "has_supabase_key": has_supabase_key
            }
        except Exception as e:
            return {"error": str(e)}

    def check_components(self):
        """Check React components status"""
        components_dir = self.project_root / "src" / "components"
        screens_dir = self.project_root / "src" / "screens"
        
        expected_components = [
            "LessonCard.tsx",
            "StorageStats.tsx", 
            "UserGreeting.tsx"
        ]
        
        expected_screens = [
            "LessonEditor.tsx",
            "LessonList.tsx"
        ]
        
        component_status = {}
        
        if components_dir.exists():
            for component in expected_components:
                component_path = components_dir / component
                component_status[f"components/{component}"] = {
                    "exists": component_path.exists(),
                    "size": component_path.stat().st_size if component_path.exists() else 0
                }
                
        if screens_dir.exists():
            for screen in expected_screens:
                screen_path = screens_dir / screen
                component_status[f"screens/{screen}"] = {
                    "exists": screen_path.exists(),
                    "size": screen_path.stat().st_size if screen_path.exists() else 0
                }
                
        return component_status

    def check_documentation(self):
        """Check documentation completeness"""
        docs_to_check = [
            "README.md",
            "docs/architecture.md",
            "for-claude.txt",
            "NEXT_TIME_CHECKLIST_7-12-25.md"
        ]
        
        doc_status = {}
        for doc in docs_to_check:
            doc_path = self.project_root / doc
            doc_status[doc] = {
                "exists": doc_path.exists(),
                "size": doc_path.stat().st_size if doc_path.exists() else 0,
                "last_modified": doc_path.stat().st_mtime if doc_path.exists() else None
            }
            
        return doc_status

    def generate_recommendations(self):
        """Generate next steps based on analysis"""
        recommendations = []
        
        # Check git status
        git_status = self.report["sections"].get("git_status", {})
        if git_status.get("uncommitted_changes"):
            recommendations.append("🔄 Commit and push uncommitted changes")
            
        # Check dependencies
        deps = self.report["sections"].get("dependencies", {})
        if deps.get("needs_npm_install"):
            recommendations.append("📦 Run 'npm install' to install dependencies")
            
        # Check environment
        env = self.report["sections"].get("environment", {})
        if not env.get("supabase_configured"):
            recommendations.append("🔐 Configure Supabase credentials in .env file")
            
        # Check components
        components = self.report["sections"].get("components", {})
        missing_components = [name for name, status in components.items() 
                            if not status.get("exists")]
        if missing_components:
            recommendations.append(f"🧩 Create missing components: {', '.join(missing_components)}")
            
        # Ready to start?
        if not recommendations:
            recommendations.append("🚀 Ready to run 'npm start' and test the app!")
            recommendations.append("📋 Focus on LessonList screen first")
            
        return recommendations

    def analyze(self):
        """Run full project analysis"""
        print("🔍 Analyzing project status...")
        
        # Run all checks
        self.report["sections"]["git_status"] = self.check_git_status()
        self.report["sections"]["structure"] = self.check_project_structure()
        self.report["sections"]["dependencies"] = self.check_dependencies()
        self.report["sections"]["environment"] = self.check_env_config()
        self.report["sections"]["components"] = self.check_components()
        self.report["sections"]["documentation"] = self.check_documentation()
        
        # Generate recommendations
        self.report["recommendations"] = self.generate_recommendations()
        
        return self.report

    def generate_markdown_report(self):
        """Generate markdown report for sharing"""
        report = self.analyze()
        
        md_content = f"""# Project Status Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Project: Lesson Plan App

## 📊 Executive Summary
"""
        
        # Git Status
        git = report["sections"]["git_status"]
        if git.get("is_git_repo"):
            sync_emoji = "✅" if git.get("sync_status") == "synced" else "⚠️"
            changes_emoji = "⚠️" if git.get("uncommitted_changes") else "✅"
            md_content += f"""
### Git Status {sync_emoji}
- Branch: `{git.get('current_branch', 'unknown')}`
- Sync Status: {git.get('sync_status', 'unknown')}
- Uncommitted Changes: {changes_emoji} {'Yes' if git.get('uncommitted_changes') else 'No'}
"""
        
        # Dependencies
        deps = report["sections"]["dependencies"]
        deps_emoji = "✅" if not deps.get("needs_npm_install") else "⚠️"
        md_content += f"""
### Dependencies {deps_emoji}
- Dependencies: {deps.get('dependencies_count', 0)}
- Dev Dependencies: {deps.get('dev_dependencies_count', 0)}
- Node Modules: {'✅ Installed' if not deps.get('needs_npm_install') else '⚠️ Need npm install'}
"""
        
        # Environment
        env = report["sections"]["environment"]
        env_emoji = "✅" if env.get("supabase_configured") else "⚠️"
        md_content += f"""
### Environment {env_emoji}
- .env file: {'✅ Exists' if env.get('exists') else '❌ Missing'}
- Supabase: {'✅ Configured' if env.get('supabase_configured') else '⚠️ Needs setup'}
"""
        
        # Components
        components = report["sections"]["components"]
        total_components = len(components)
        existing_components = sum(1 for c in components.values() if c.get("exists"))
        comp_emoji = "✅" if existing_components == total_components else "⚠️"
        
        md_content += f"""
### Components {comp_emoji}
- Created: {existing_components}/{total_components}
"""
        
        for name, status in components.items():
            emoji = "✅" if status.get("exists") else "❌"
            size = f" ({status.get('size', 0)} bytes)" if status.get("exists") else ""
            md_content += f"  - {emoji} {name}{size}\n"
        
        # Recommendations
        md_content += f"""
## 🎯 Next Steps
"""
        for i, rec in enumerate(report["recommendations"], 1):
            md_content += f"{i}. {rec}\n"
        
        # Repository link
        md_content += f"""
## 🔗 Repository
https://github.com/rituzangle/lesson-plan-app

## 📋 For Claude
This report can be shared with Claude to continue development efficiently.
Current focus: Local app startup with lesson list functionality.
"""
        
        return md_content

def main():
    """Main execution"""
    analyzer = ProjectAnalyzer()
    
    # Generate report
    report_content = analyzer.generate_markdown_report()
    
    # Save to file
    report_file = Path("project-status-report.md")
    with open(report_file, 'w') as f:
        f.write(report_content)
    
    print(f"✅ Report generated: {report_file}")
    print("\n" + "="*50)
    print(report_content)
    
    # Also save JSON for programmatic access
    json_report = analyzer.analyze()
    json_file = Path("project-status.json")
    with open(json_file, 'w') as f:
        json.dump(json_report, f, indent=2)
    
    print(f"\n📊 JSON data saved: {json_file}")

if __name__ == "__main__":
    main()
