#!/usr/bin/env python3
"""
Project Analyzer - Smart File Extension Detective
Path: scripts/project_analyzer.py
Purpose: Crawl project and detect React/TypeScript file extension mismatches
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class FileAnalysis:
    """Represents analysis results for a single file"""
    filepath: str
    current_extension: str
    suggested_extension: str
    reason: str
    confidence: float
    contains_jsx: bool
    contains_react_imports: bool
    contains_components: bool

class ProjectAnalyzer:
    """Smart analyzer for React/TypeScript project files"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root).resolve()
        self.downloads_dir = self.project_root / "downloads"
        self.src_dir = self.project_root / "src"
        
        # Patterns to detect React/JSX content
        self.jsx_patterns = [
            r'<[A-Z][a-zA-Z0-9]*\s*[^>]*>',  # JSX tags with capital letters
            r'<[a-z]+\s+[^>]*className\s*=',  # HTML with className
            r'<[a-z]+\s+[^>]*onClick\s*=',    # HTML with onClick
            r'React\.createElement',           # React.createElement calls
            r'jsx\s*\(',                      # jsx() calls
        ]
        
        self.react_import_patterns = [
            r'import\s+.*\s+from\s+[\'"]react[\'"]',
            r'import\s+React\s+from',
            r'import\s+\{.*\}\s+from\s+[\'"]react[\'"]',
            r'import.*useState|useEffect|useContext',
        ]
        
        self.component_patterns = [
            r'export\s+default\s+function\s+[A-Z]',
            r'export\s+function\s+[A-Z]',
            r'const\s+[A-Z][a-zA-Z0-9]*\s*=\s*\(',
            r'function\s+[A-Z][a-zA-Z0-9]*\s*\(',
            r'export\s+default\s+[A-Z][a-zA-Z0-9]*',
        ]

    def analyze_file_content(self, filepath: Path) -> FileAnalysis:
        """Analyze a single file to determine correct extension"""
        try:
            content = filepath.read_text(encoding='utf-8')
        except (UnicodeDecodeError, PermissionError):
            return FileAnalysis(
                filepath=str(filepath),
                current_extension=filepath.suffix,
                suggested_extension=filepath.suffix,
                reason="Cannot read file",
                confidence=0.0,
                contains_jsx=False,
                contains_react_imports=False,
                contains_components=False
            )
        
        # Check for JSX content
        contains_jsx = any(re.search(pattern, content, re.MULTILINE) for pattern in self.jsx_patterns)
        
        # Check for React imports
        contains_react_imports = any(re.search(pattern, content, re.MULTILINE) for pattern in self.react_import_patterns)
        
        # Check for React components
        contains_components = any(re.search(pattern, content, re.MULTILINE) for pattern in self.component_patterns)
        
        # Determine suggested extension
        current_ext = filepath.suffix
        suggested_ext = current_ext
        reason = "No changes needed"
        confidence = 0.5
        
        if current_ext == '.ts':
            if contains_jsx:
                suggested_ext = '.tsx'
                reason = "Contains JSX elements"
                confidence = 0.9
            elif contains_react_imports and contains_components:
                suggested_ext = '.tsx'
                reason = "Contains React components"
                confidence = 0.8
            elif contains_react_imports:
                suggested_ext = '.tsx'
                reason = "Contains React imports"
                confidence = 0.6
        elif current_ext == '.js':
            if contains_jsx or contains_react_imports:
                suggested_ext = '.tsx'
                reason = "JavaScript with React should be TypeScript"
                confidence = 0.7
        
        return FileAnalysis(
            filepath=str(filepath),
            current_extension=current_ext,
            suggested_extension=suggested_ext,
            reason=reason,
            confidence=confidence,
            contains_jsx=contains_jsx,
            contains_react_imports=contains_react_imports,
            contains_components=contains_components
        )

    def crawl_project(self) -> Dict[str, List[FileAnalysis]]:
        """Crawl the entire project and analyze files"""
        results = {
            'downloads': [],
            'src': [],
            'scripts': [],
            'other': []
        }
        
        # Define file extensions to analyze
        target_extensions = {'.ts', '.tsx', '.js', '.jsx'}
        
        # Analyze downloads directory
        if self.downloads_dir.exists():
            for file in self.downloads_dir.rglob('*'):
                if file.is_file() and file.suffix in target_extensions:
                    analysis = self.analyze_file_content(file)
                    results['downloads'].append(analysis)
        
        # Analyze src directory
        if self.src_dir.exists():
            for file in self.src_dir.rglob('*'):
                if file.is_file() and file.suffix in target_extensions:
                    analysis = self.analyze_file_content(file)
                    results['src'].append(analysis)
        
        # Analyze scripts directory
        scripts_dir = self.project_root / "scripts"
        if scripts_dir.exists():
            for file in scripts_dir.rglob('*'):
                if file.is_file() and file.suffix in target_extensions:
                    analysis = self.analyze_file_content(file)
                    results['scripts'].append(analysis)
        
        # Analyze root level files
        for file in self.project_root.glob('*'):
            if file.is_file() and file.suffix in target_extensions:
                analysis = self.analyze_file_content(file)
                results['other'].append(analysis)
        
        return results

    def suggest_file_destinations(self, downloads_analyses: List[FileAnalysis]) -> Dict[str, str]:
        """Suggest where downloaded files should go"""
        suggestions = {}
        
        for analysis in downloads_analyses:
            filepath = Path(analysis.filepath)
            filename = filepath.name
            
            # Remove file extension for pattern matching
            base_name = filepath.stem.lower()
            
            # Suggest destinations based on filename patterns
            if 'app' in base_name and analysis.contains_jsx:
                suggestions[filename] = 'src/App.tsx'
            elif 'auth' in base_name and 'context' in base_name:
                suggestions[filename] = 'src/components/AuthContext.tsx'
            elif 'auth' in base_name and 'service' in base_name:
                suggestions[filename] = 'src/services/auth.ts'
            elif 'encryption' in base_name:
                suggestions[filename] = 'src/services/encryption.ts'
            elif 'storage' in base_name:
                suggestions[filename] = 'src/services/storage.ts'
            elif 'curriculum' in base_name:
                suggestions[filename] = 'src/data/curriculum/' + filename.replace('.ts', '.ts')
            elif 'template' in base_name:
                suggestions[filename] = 'src/data/templates/' + filename.replace('.ts', '.ts')
            elif filename.endswith('.json'):
                suggestions[filename] = 'src/data/samples/' + filename
            elif filename.endswith('.sql'):
                suggestions[filename] = 'database/' + filename
            elif filename.endswith('.sh'):
                suggestions[filename] = 'scripts/' + filename
            elif filename.endswith('.md'):
                suggestions[filename] = 'docs/' + filename
            else:
                suggestions[filename] = 'src/utils/' + filename
        
        return suggestions

    def generate_report(self) -> Dict:
        """Generate comprehensive analysis report"""
        print("🔍 Analyzing project structure...")
        
        analyses = self.crawl_project()
        
        # Count issues by category
        extension_issues = []
        destination_suggestions = {}
        
        for category, file_analyses in analyses.items():
            for analysis in file_analyses:
                if analysis.suggested_extension != analysis.current_extension:
                    extension_issues.append(analysis)
        
        # Get destination suggestions for downloads
        if analyses['downloads']:
            destination_suggestions = self.suggest_file_destinations(analyses['downloads'])
        
        # Generate summary statistics
        total_files = sum(len(files) for files in analyses.values())
        files_with_issues = len(extension_issues)
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'project_root': str(self.project_root),
            'summary': {
                'total_files_analyzed': total_files,
                'files_with_extension_issues': files_with_issues,
                'downloads_files': len(analyses['downloads']),
                'src_files': len(analyses['src'])
            },
            'extension_issues': [
                {
                    'file': issue.filepath,
                    'current': issue.current_extension,
                    'suggested': issue.suggested_extension,
                    'reason': issue.reason,
                    'confidence': issue.confidence
                }
                for issue in extension_issues
            ],
            'destination_suggestions': destination_suggestions,
            'detailed_analysis': analyses
        }
        
        return report

    def print_report(self, report: Dict):
        """Print formatted report to console"""
        print("\n" + "="*60)
        print("🎯 PROJECT ANALYSIS REPORT")
        print("="*60)
        
        # Summary
        summary = report['summary']
        print(f"\n📊 SUMMARY:")
        print(f"  • Total files analyzed: {summary['total_files_analyzed']}")
        print(f"  • Files with extension issues: {summary['files_with_extension_issues']}")
        print(f"  • Files in downloads: {summary['downloads_files']}")
        print(f"  • Files in src: {summary['src_files']}")
        
        # Extension issues
        if report['extension_issues']:
            print(f"\n🚨 EXTENSION ISSUES:")
            for issue in report['extension_issues']:
                confidence_emoji = "🔴" if issue['confidence'] > 0.8 else "🟡" if issue['confidence'] > 0.6 else "🟢"
                print(f"  {confidence_emoji} {issue['file']}")
                print(f"    {issue['current']} → {issue['suggested']} ({issue['reason']})")
        
        # Destination suggestions
        if report['destination_suggestions']:
            print(f"\n📁 DESTINATION SUGGESTIONS:")
            for filename, destination in report['destination_suggestions'].items():
                print(f"  • {filename} → {destination}")
        
        print(f"\n✅ Report generated at: {report['timestamp']}")
        print("="*60)

def main():
    """Main execution function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Analyze React/TypeScript project files')
    parser.add_argument('--project-root', default='.', help='Project root directory')
    parser.add_argument('--output', help='Output JSON file path')
    parser.add_argument('--quiet', action='store_true', help='Suppress console output')
    
    args = parser.parse_args()
    
    analyzer = ProjectAnalyzer(args.project_root)
    report = analyzer.generate_report()
    
    if not args.quiet:
        analyzer.print_report(report)
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(report, f, indent=2)
        print(f"\n💾 Report saved to: {args.output}")

if __name__ == "__main__":
    main()
