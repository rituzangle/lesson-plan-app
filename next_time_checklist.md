# Next Time Checklist - Lesson Plan App

## Immediate Tasks (Priority Order)
1. **File Organization Structure**
   - Clarify .ts file placement (scripts/ vs src/types/ vs src/data/)
   - Set up consistent naming conventions
   - Create copy script for artifact management

2. **Modular Architecture Setup**
   - Break down large components into smaller, focused files
   - Implement proper TypeScript interfaces and types
   - Create clear separation of concerns

3. **Database & Storage Implementation**
   - Set up AsyncStorage with encryption wrapper
   - Create user isolation system
   - Implement shared lesson plan templates structure

4. **File Management Automation**
   - Create setup script to move files from downloads to destinations
   - Implement consistent artifact naming matching script names
   - Add destination comments to all artifacts

## Questions to Address
- **TypeScript Files**: Where should curriculum/template .ts files go?
  - Option A: `src/data/curriculum/` for data files
  - Option B: `src/types/` for type definitions
  - Option C: `scripts/` for utility scripts

## Current Status
- GitHub auto-sync scripts: ✅ Ready
- Master reference file: 🔄 Needs creation
- Modular approach: 🔄 In progress

## Message Size Optimization
- Use GitHub references instead of large inline code
- Create reusable component library
- Implement incremental development approach