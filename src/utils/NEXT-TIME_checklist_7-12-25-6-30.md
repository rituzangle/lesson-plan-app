# Next Time Checklist - July 12, 2025

## 🚨 PRIORITY ISSUES TO RESOLVE

### 1. File Extension & Naming Inconsistencies
**Problem**: Downloaded files have wrong extensions (.ts vs .tsx) and unclear destinations
- `App.ts` → Should be `App.tsx` (React component)
- `app_with_auth.ts` → Should be `src/App.tsx` or separate auth component
- `performing_arts_curriculum.ts` & `performing_arts_templates.ts` → Need proper placement

### 2. Missing File Destinations
**Downloads folder contents need proper homes**:
```
downloads/
├── app_with_auth.ts → src/App.tsx
├── encryption_service.ts → src/services/encryption.ts
├── performing_arts_curriculum.ts → src/data/curriculum/performing_arts.ts
├── performing_arts_templates.ts → src/data/templates/performing_arts.ts
├── enhanced_setup_auto-fixer.sh → scripts/
├── smart_test_runner.sh → scripts/
├── test_runner.sh → scripts/
├── sample_curriculum_data.json → src/data/samples/
└── supabase_schema.sql → database/
```

### 3. AuthContext Dependencies Analysis
**Need to examine**: `src/components/AuthContext.ts` for missing artifacts
- Check imports and dependencies
- Verify all referenced services exist
- Ensure type definitions match

## 🔧 IMMEDIATE ACTIONS NEEDED

### Step 1: File Organization Script
Create enhanced `setup-script.sh` that:
- Moves files from downloads to correct destinations
- Fixes file extensions automatically
- Validates TypeScript/React file types
- Creates missing directories

### Step 2: Naming Convention Enforcement
- Artifact ID = exact filename
- Comments include full path
- Script references match artifact names
- Consistent .ts/.tsx/.js/.jsx extensions

### Step 3: GitHub Auto-sync
- Implement auto-commit/push after file moves
- Create reference files for cross-chat continuity
- Add progress tracking

## 📋 ARCHITECTURE COMPLIANCE

### Current Structure Analysis
```
src/
├── components/     # React components (.tsx)
├── services/       # Business logic (.ts)
├── types/         # TypeScript definitions (.ts)
├── data/          # Static data & templates (.ts/.json)
├── database/      # DB operations (.ts)
├── navigation/    # Navigation logic (.tsx)
├── screens/       # Screen components (.tsx)
├── utils/         # Utility functions (.ts)
└── constants/     # App constants (.ts)
```

### Missing Directories to Create
- `src/data/curriculum/`
- `src/data/templates/`
- `src/data/samples/`

## 🎯 GOALS FOR NEXT SESSION

1. **Resolve file placement confusion** - Clear map of where each file belongs
2. **Fix extension mismatches** - Ensure .ts/.tsx consistency
3. **Complete AuthContext analysis** - Find missing dependencies
4. **Create automated file mover** - Script to handle downloads → destinations
5. **Update documentation** - Reflect actual file structure

## 📱 MAC M3 COMMANDS REFERENCE

### Quick Start Commands
```bash
# Navigate to project
cd ~/lesson_plan_App

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser (PWA)

# Testing
npm run test
npm run test:watch
npm run test:coverage
```

### File Management Commands
```bash
# Check downloads folder
ls downloads/

# Run setup script (when fixed)
bash scripts/setup-script.sh

# Git status
git status
git add .
git commit -m "Fix file organization"
git push origin main
```

## 🔄 MESSAGE SIZE OPTIMIZATION STRATEGY

1. **Use GitHub references** instead of inline code
2. **Create smaller, focused artifacts** (< 50 lines each)
3. **Implement auto-sync scripts** for immediate GitHub updates
4. **Reference master files** across conversations
5. **Incremental development** approach

## 📝 SUMMARY FOR NEXT TIME

**Current Status**: File organization chaos needs immediate attention
**Priority**: Fix file extensions and destinations before continuing development
**Tools Ready**: GitHub repo structure is good, just need proper file placement
**Next Focus**: AuthContext analysis and dependency resolution

---
*Remember: You work on Mac M3, prefer Python for tools, learning React/TSX, want PWA + mobile apps for App Store deployment*