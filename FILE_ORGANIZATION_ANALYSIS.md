# File Organization Analysis & Missing Artifacts

## Current Downloads Directory Structure:
```
~/Downloads/lesson_plan_App/downloads/
├── app_with_auth.ts           # Should be: src/App.tsx
├── encryption_service.ts      # Should be: src/services/encryption.ts
├── next_time_checklist.md     # Should be: docs/next_time_checklist.md
├── smart_test_runner.sh       # Should be: scripts/smart_test_runner.sh
├── enhanced_setup_auto-fixer.sh # Should be: scripts/enhanced_setup_auto-fixer.sh
├── sample_curriculum_data.json # Should be: src/data/sample_curriculum_data.json
├── supabase_schema.sql        # Should be: database/supabase_schema.sql
├── test_runner.sh             # Should be: scripts/test_runner.sh
├── performing_arts_curriculum.ts # Should be: src/data/performing_arts_curriculum.ts
└── performing_arts_templates.ts  # Should be: src/data/performing_arts_templates.ts
```

## Missing Artifacts for AuthContext.ts:

Based on typical AuthContext implementation, these files are likely missing:

### 1. Authentication Types
- **File**: `src/types/auth.ts`
- **Purpose**: TypeScript interfaces for user, auth state, tokens

### 2. Authentication Service
- **File**: `src/services/auth.ts`
- **Purpose**: Login, logout, token management

### 3. User Context/Provider
- **File**: `src/contexts/UserContext.tsx`
- **Purpose**: User profile and preferences management

### 4. Storage Service
- **File**: `src/services/storage.ts`
- **Purpose**: AsyncStorage wrapper with encryption

### 5. API Client
- **File**: `src/services/api.ts`
- **Purpose**: HTTP client with auth headers

## File Extension Fixes:

### React Components (.tsx):
- app_with_auth.ts → App.tsx
- Any component files → .tsx

### TypeScript Modules (.ts):
- encryption_service.ts → ✓ (correct)
- performing_arts_curriculum.ts → ✓ (correct)
- performing_arts_templates.ts → ✓ (correct)

### Shell Scripts (.sh):
- smart_test_runner.sh → ✓ (correct)
- enhanced_setup_auto-fixer.sh → ✓ (correct)
- test_runner.sh → ✓ (correct)

## Recommended Project Structure:
```
lesson-plan-app/
├── src/
│   ├── components/
│   │   └── AuthContext.ts (current - needs dependencies)
│   ├── contexts/
│   │   └── UserContext.tsx (missing)
│   ├── services/
│   │   ├── auth.ts (missing)
│   │   ├── encryption.ts (from downloads)
│   │   ├── storage.ts (missing)
│   │   └── api.ts (missing)
│   ├── types/
│   │   └── auth.ts (missing)
│   ├── data/
│   │   ├── sample_curriculum_data.json (from downloads)
│   │   ├── performing_arts_curriculum.ts (from downloads)
│   │   └── performing_arts_templates.ts (from downloads)
│   └── App.tsx (from downloads as app_with_auth.ts)
├── scripts/
│   ├── smart_test_runner.sh (from downloads)
│   ├── enhanced_setup_auto-fixer.sh (from downloads)
│   ├── test_runner.sh (from downloads)
│   └── setup-script.sh (needs updating)
├── database/
│   └── supabase_schema.sql (from downloads)
├── docs/
│   ├── architecture.md (missing)
│   ├── next_time_checklist.md (from downloads)
│   └── progress_report.md (exists but needs update)
└── README.md (needs updating)
```

## Naming Convention Rules:
1. **Artifact ID = Exact filename** (including extension)
2. **Comments include full path**: `// File: src/services/auth.ts`
3. **Script references match artifact names exactly**
4. **Extensions follow conventions**: .tsx for React, .ts for TypeScript modules

## Action Items:
1. Create missing dependency files
2. Update setup-script.sh with correct file mappings
3. Create architecture.md
4. Update README.md
5. Create Mac M3 run commands doc