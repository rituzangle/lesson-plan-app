#!/usr/bin/env python3
"""
code-gen.py - Automated code generation for lesson-plan-app
Path: scripts/code-gen.py
Created: 2025-07-29 for lesson-plan-app

Generates React components, screens, and utilities with proper TypeScript types
and consistent file structure.
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

class CodeGenerator:
    def __init__(self, project_root="."):
        self.project_root = Path(project_root)
        self.src_dir = self.project_root / "src"
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    def create_directory(self, path):
        """Create directory if it doesn't exist"""
        path.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created/verified directory: {path}")
        
    def generate_component(self, name, component_type="component", props=None):
        """Generate a React component with TypeScript"""
        if component_type == "screen":
            base_dir = self.src_dir / "screens"
        elif component_type == "teacher":
            base_dir = self.src_dir / "components" / "teacher"
        else:
            base_dir = self.src_dir / "components"
            
        self.create_directory(base_dir)
        
        # Generate component content
        props_interface = f"{name}Props"
        props_def = props or "navigation?: any;"
        
        component_content = f"""// {name}.tsx - Auto-generated component
// Path: {base_dir.relative_to(self.project_root)}/{name}.tsx
// Generated: {self.timestamp} by code-gen.py

import React from 'react';
import {{
  View,
  Text,
  StyleSheet,
}} from 'react-native';

interface {props_interface} {{
  {props_def}
}}

export const {name}: React.FC<{props_interface}> = ({{ navigation }}) => {{
  return (
    <View style={{styles.container}}>
      <Text style={{styles.title}}>{name} Component</Text>
      <Text style={{styles.subtitle}}>Auto-generated on {self.timestamp}</Text>
    </View>
  );
}};

const styles = StyleSheet.create({{
  container: {{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  }},
  title: {{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  }},
  subtitle: {{
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }},
}});"""

        # Write file
        file_path = base_dir / f"{name}.tsx"
        with open(file_path, 'w') as f:
            f.write(component_content)
        
        print(f"✅ Generated {component_type}: {file_path}")
        return file_path
        
    def generate_index_files(self):
        """Generate index.ts files for easy imports"""
        directories = [
            self.src_dir / "components",
            self.src_dir / "components" / "teacher", 
            self.src_dir / "screens",
        ]
        
        for dir_path in directories:
            if dir_path.exists():
                # Find all .tsx files
                tsx_files = list(dir_path.glob("*.tsx"))
                if tsx_files:
                    index_content = f"""// Auto-generated index file
// Path: {dir_path.relative_to(self.project_root)}/index.ts
// Generated: {self.timestamp} by code-gen.py

"""
                    for tsx_file in tsx_files:
                        component_name = tsx_file.stem
                        index_content += f"export {{ {component_name} }} from './{component_name}';\n"
                    
                    index_path = dir_path / "index.ts"
                    with open(index_path, 'w') as f:
                        f.write(index_content)
                    
                    print(f"✅ Generated index: {index_path}")
                    
    def generate_project_status(self):
        """Generate project status report"""
        status = {
            "generated_at": self.timestamp,
            "project_root": str(self.project_root.absolute()),
            "components_generated": [],
            "directories_created": [],
        }
        
        # Count components
        for tsx_file in self.src_dir.rglob("*.tsx"):
            status["components_generated"].append(str(tsx_file.relative_to(self.project_root)))
            
        # Write status
        status_path = self.project_root / "scripts" / "generation-status.json"
        with open(status_path, 'w') as f:
            json.dump(status, f, indent=2)
            
        print(f"✅ Generated status report: {status_path}")
        
    def run_generation(self, components=None):
        """Run the full generation process"""
        print(f"🚀 Starting code generation at {self.timestamp}")
        print(f"📁 Project root: {self.project_root.absolute()}")
        
        # Default components to generate
        if not components:
            components = [
                ("TeacherDashboard", "screen"),
                ("WebFriendlyLogin", "screen"), 
                ("QuickLessonCreator", "teacher"),
                ("ClassOverview", "teacher"),
                ("WebLayoutFix", "component"),
            ]
            
        # Generate components
        for name, comp_type in components:
            self.generate_component(name, comp_type)
            
        # Generate index files
        self.generate_index_files()
        
        # Generate status report
        self.generate_project_status()
        
        print(f"\n🎉 Code generation complete!")
        print(f"📋 Generated {len(components)} components")
        print(f"📂 Check src/ directory for new files")

def main():
    """Main entry point"""
    if len(sys.argv) > 1:
        project_root = sys.argv[1]
    else:
        project_root = "."
        
    generator = CodeGenerator(project_root)
    generator.run_generation()

if __name__ == "__main__":
    main()