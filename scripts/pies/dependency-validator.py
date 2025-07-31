#!/usr/bin/env python3
"""
Dependency Validator
File: scripts/dependency-validator.py

Validates that all imports match existing files and naming conventions
Checks for authentic artifacts vs missing dependencies
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple

class DependencyValidator:
    def __init__(self, project_root="."):
        self.project_root = Path(project_root).resolve()
        self.src_path = self.project_root / "src"
        self.missing_files = []
        self.import_issues = []
        self.naming_issues = []
        self.authentic_files = []
        
    def find_all_source_files(self) -> List[Path]:
        """Find all TypeScript/JavaScript source files"""
        extensions = ['*.ts', '*.tsx', '*.js', '*.jsx']
        source_files = []
        
        if self.src_path.exists():
            for ext in extensions:
                source_files.extend(self.src_path.rglob(ext))
                
        return source_files
    
    def extract_imports(self, file_path: Path) -> List[Tuple[str, int]]:
        """Extract import statements from a file"""
        imports = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Match various import patterns
            import_patterns = [
                # import { Component } from './path'
                r"import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['\"]([^'\"]+)['\"]",
                # import './path'
                r"import\s+['\"]([^'\"]+)['\"]",
                # require('./path')
                r"require\s*\(\s*['\"]([^'\"]+)['\"]\s*\)"
            ]
            
            for line_num, line in enumerate(content.split('\n'), 1):
                for pattern in import_patterns:
                    matches = re.findall(pattern, line)
                    for match in matches:
                        imports.append((match, line_num))
                        
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")
            
        return imports
    
    def resolve_import_path(self, import_path: str, from_file: Path) -> Path:
        """Resolve relative import path to absolute file path"""
        if import_path.startswith('.'):
            # Relative import
            base_dir = from_file.parent
            resolved_path = (base_dir / import_path).resolve()
        elif import_path.startswith('@/'):
            # Alias import (@/ = src/)
            resolved_path = self.src_path / import_path[2:]
        else:
            # Assume it's a relative import from src
            resolved_path = self.src_path / import_path
            
        # Try common extensions if no extension provided
        if not resolved_path.suffix:
            for ext in ['.tsx', '.ts', '.jsx', '.js']:
                if (resolved_path.parent / f"{resolved_path.name}{ext}").exists():
                    return resolved_path.parent / f"{resolved_path.name}{ext}"
                    
        return resolved_path
    
    def check_naming_conventions(self, file_path: Path) -> List[str]:
        """Check if file follows naming conventions"""
        issues = []
        
        # Component files should be PascalCase
        if file_path.suffix in ['.tsx', '.jsx']:
            if file_path.stem[0].islower():
                issues.append(f"Component file should be PascalCase: {file_path}")
                
        # Check for common naming mismatches
        if 'component' in file_path.name.lower() and not file_path.name.startswith('Component'):
            issues.append(f"Component naming inconsistent: {file_path}")
            
        return issues
    
    def validate_imports(self) -> Dict:
        """Validate all imports in the project"""
        print("🔍 Validating imports and dependencies...")
        
        source_files = self.find_all_source_files()
        validation_report = {
            "total_files": len(source_files),
            "missing_dependencies": [],
            "broken_imports": [],
            "naming_issues": [],
            "authentic_files": []
        }
        
        for file_path in source_files:
            print(f"📄 Checking: {file_path.relative_to(self.project_root)}")
            
            # Check naming conventions
            naming_issues = self.check_naming_conventions(file_path)
            validation_report["naming_issues"].extend(naming_issues)
            
            # Extract and validate imports
            imports = self.extract_imports(file_path)
            
            for import_path, line_num in imports:
                # Skip node_modules imports
                if not import_path.startswith('.') and not import_path.startswith('@/'):
                    continue
                    
                resolved_path = self.resolve_import_path(import_path, file_path)
                
                if not resolved_path.exists():
                    missing_info = {
                        "file": str(file_path.relative_to(self.project_root)),
                        "line": line_num,
                        "import": import_path,
                        "resolved_path": str(resolved_path.relative_to(self.project_root)),
                        "missing_file": str(resolved_path)
                    }
                    validation_report["broken_imports"].append(missing_info)
                    validation_report["missing_dependencies"].append(str(resolved_path.relative_to(self.project_root)))
                else:
                    # File exists - mark as authentic
                    validation_report["authentic_files"].append(str(resolved_path.relative_to(self.project_root)))
        
        # Remove duplicates
        validation_report["missing_dependencies"] = list(set(validation_report["missing_dependencies"]))
        validation_report["authentic_files"] = list(set(validation_report["authentic_files"]))
        
        return validation_report
    
    def generate_missing_file_templates(self, missing_files: List[str]):
        """Generate basic templates for missing files"""
        print("\n🏗️  Generating templates for missing files...")
        
        for missing_file in missing_files:
            file_path = self.project_root / missing_file
            
            # Create directory if it doesn't exist
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Generate appropriate template based on file type
            if missing_file.endswith('.tsx'):
                template = self.generate_tsx_template(file_path.stem)
            elif missing_file.endswith('.ts'):
                template = self.generate_ts_template(file_path.stem)
            else:
                template = f"// {file_path.name}\n// TODO: Implement this file\n"
            
            print(f"📝 Would create: {missing_file}")
            print(f"   Template preview: {template[:100]}...")
    
    def generate_tsx_template(self, component_name: str) -> str:
        """Generate basic React component template"""
        return f"""import React from 'react';

interface {component_name}Props {{
  // TODO: Define props interface
}}

const {component_name}: React.FC<{component_name}Props> = (props) => {{
  return (
    <div>
      <h2>{component_name}</h2>
      {{/* TODO: Implement component */}}
    </div>
  );
}};

export default {component_name};
"""
    
    def generate_ts_template(self, file_name: str) -> str:
        """Generate basic TypeScript file template"""
        return f"""// {file_name}.ts
// TODO: Implement this module

export {{
  // TODO: Export your functions/classes/types
}};
"""
    
    def print_report(self, report: Dict):
        """Print formatted validation report"""
        print("\n" + "="*60)
        print("📊 DEPENDENCY VALIDATION REPORT")
        print("="*60)
        
        print(f"\n📈 Summary:")
        print(f"  Total files scanned: {report['total_files']}")
        print(f"  Authentic files: {len(report['authentic_files'])}")
        print(f"  Missing dependencies: {len(report['missing_dependencies'])}")
        print(f"  Broken imports: {len(report['broken_imports'])}")
        print(f"  Naming issues: {len(report['naming_issues'])}")
        
        if report['missing_dependencies']:
            print(f"\n❌ Missing Files:")
            for missing in sorted(report['missing_dependencies']):
                print(f"  - {missing}")
        
        if report['broken_imports']:
            print(f"\n🔗 Broken Imports:")
            for broken in report['broken_imports']:
                print(f"  - {broken['file']}:{broken['line']} → {broken['import']}")
                print(f"    (resolves to: {broken['resolved_path']})")
        
        if report['naming_issues']:
            print(f"\n📝 Naming Issues:")
            for issue in report['naming_issues']:
                print(f"  - {issue}")
        
        if report['authentic_files']:
            print(f"\n✅ Authentic Files (first 10):")
            for auth in sorted(report['authentic_files'])[:10]:
                print(f"  - {auth}")
            if len(report['authentic_files']) > 10:
                print(f"  ... and {len(report['authentic_files']) - 10} more")

def main():
    """Main validation function"""
    validator = DependencyValidator()
    report = validator.validate_imports()
    validator.print_report(report)
    
    # Ask if user wants to generate missing file templates
    if report['missing_dependencies']:
        print(f"\n🤔 Found {len(report['missing_dependencies'])} missing files.")
        print("Would you like me to generate basic templates for these files?")
        print("(This will help you understand what needs to be implemented)")
        
        # For now, just show what would be generated
        validator.generate_missing_file_templates(report['missing_dependencies'])
    
    return report

if __name__ == "__main__":
    main()
