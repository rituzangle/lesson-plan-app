# Next Time Checklist - July 12, 2025

## IMMEDIATE PRIORITIES (Do First)
1. **File Organization Crisis** - Move downloads to correct locations
2. **Setup Script Fix** - Make auto-setup work properly
3. **App.ts vs App.tsx** - Resolve TypeScript vs React confusion
4. **Architecture Documentation** - Create/update architecture.md

## GITHUB INFO
- Repository: https://github.com/rituzangle/lesson-plan-app
- Current branch: main
- Status: Auth system foundation complete

## FILES NEEDING PLACEMENT
Located in `~/Downloads` → `<MY-APP>/downloads/`:
- `app_with_auth.ts` → **NEEDS**: Should this be `App.tsx` in `src/`?
- `encryption_service.ts` → `src/services/`
- `enhanced_setup_auto-fixer.sh` → `scripts/`
- `sample_curriculum_data.json` → `src/data/`
- `smart_test_runner.sh` → `scripts/`
- `supabase_schema.sql` → `database/`
- `test_runner.sh` → `scripts/`

## TECH STACK CONFIRMED
- React + TypeScript + Supabase
- Expo for mobile (PWA + iOS/Android)
- Auth system: Multi-role with accessibility
- Mac M3 development environment
- GitHub integration active

## CURRENT STATUS
✅ **Complete**: AuthContext, AuthService, route protection, role-based navigation
🔄 **In Progress**: File organization, setup automation
⏳ **Next**: Core app features, architecture docs

## OPTIMIZATION STRATEGY
- GitHub auto-sync to prevent message size limits
- Modular artifacts with consistent naming
- Progress reports for status tracking
- Reference files for cross-chat continuity

## QUESTIONS TO RESOLVE
1. Should `app_with_auth.ts` become `App.tsx` in `src/`?
2. Where do curriculum TypeScript files go? (`performing_arts_curriculum.ts`)
3. Database strategy: AsyncStorage now, SQLite later?
4. Encryption: AES-256 for sensitive data?

## SUCCESS METRICS
- App runs locally on Mac M3
- Files in correct locations
- Setup script automates everything
- Architecture clearly documented