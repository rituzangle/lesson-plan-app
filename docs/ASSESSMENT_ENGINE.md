# Assessment Engine Documentation

## Overview
The Assessment Engine provides academic level evaluation for K-12 students based on competency rather than age. It integrates Bloom's Taxonomy and supports multi-domain assessment across Mathematics, Reading, Science, and Performing Arts.

## Features
- **Academic Level Assessment**: Competency-based evaluation
- **Bloom's Taxonomy Integration**: Six levels of cognitive complexity
- **Multi-Domain Support**: Math, Reading, Science, Arts
- **Adaptive Questions**: AI-powered question selection
- **Accessibility First**: WCAG 2.1 AA compliance
- **Privacy Compliant**: GDPR-ready data handling

## Architecture
```
src/components/assessment/
├── AssessmentEngine.tsx          # Main component
├── DiagnosticAssessment.tsx      # Initial evaluation
├── AdaptiveQuestionSelector.tsx  # AI question selection
├── PerformanceAnalytics.tsx      # Results dashboard
└── AccessibilityFeatures.tsx    # A11y components
```

## Usage
```typescript
import AssessmentEngine from './components/assessment/AssessmentEngine';

<AssessmentEngine 
  studentId="student_001"
  domain="mathematics"
  accessibilityMode={true}
  onComplete={handleAssessmentComplete}
/>
```

## Database Schema
See `docs/database.md` for complete schema documentation.

## Testing
- Unit tests: `npm run test:assessment`
- Accessibility tests: `npm run test:accessibility`
- Integration tests: `npm run test:integration`

## Development
- Follow the daily checklist in `DAILY_CHECKLIST.md`
- Use the GitHub Actions workflow for automated testing
- Commit changes automatically via the workflow

Last updated: $(date)
