#!/usr/bin/env python3
"""Quick Dependency Check - Lightweight version"""
import os, re
from pathlib import Path

def quick_check():
    src = Path("src")
    missing, found = [], []
    
    for f in src.rglob("*.tsx"):
        try:
            content = f.read_text()
            imports = re.findall(r"from\s+['\"]([^'\"]+)['\"]", content)
            for imp in imports:
                if imp.startswith('./') or imp.startswith('../'):
                    target = (f.parent / imp).with_suffix('.tsx')
                    if target.exists():
                        found.append(str(target.relative_to(src)))
                    else:
                        missing.append(f"{f.name} → {imp}")
        except: pass
    
    print(f"✅ Found: {len(set(found))}")
    print(f"❌ Missing: {len(missing)}")
    for m in missing[:10]: print(f"  {m}")
    return missing, found

if __name__ == "__main__":
    quick_check()
