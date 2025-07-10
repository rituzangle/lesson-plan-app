# Lesson Plan App - Project Structure

## Repository: `lesson-plan-app`
**GitHub:** `rituzangle/lesson-plan-app`

## Directory Structure

```
lesson-plan-app/
├── README.md
├── package.json
├── app.json
├── expo-env.d.ts
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── .gitignore
├── .env.example
├── .env.local
│
├── docs/
│   ├── architecture.md
│   ├── development-log.md
│   ├── api-reference.md
│   ├── deployment-guide.md
│   ├── index.md
│   ├── user-stories.md
│   ├── privacy-policy.md
│   ├── PROJECT_GUIDE.md
│   └── testing-strategy.md
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Loading/
│   │   ├── lesson/
│   │   │   ├── LessonCard/
│   │   │   ├── LessonBuilder/
│   │   │   └── LessonViewer/
│   │   ├── student/
│   │   │   ├── StudentDashboard/
│   │   │   ├── ProgressTracker/
│   │   │   └── BreakReminder/
│   │   └── parent/
│   │       ├── ParentDashboard/
│   │       ├── ChildManager/
│   │       └── ReportGenerator/
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── UserTypeScreen.tsx
│   │   │   └── SetupScreen.tsx
│   │   ├── lesson/
│   │   │   ├── LessonPlanScreen.tsx
│   │   │   ├── LessonBuilderScreen.tsx
│   │   │   └── LessonViewScreen.tsx
│   │   ├── student/
│   │   │   ├── StudentHomeScreen.tsx
│   │   │   ├── StudyScreen.tsx
│   │   │   └── ProgressScreen.tsx
│   │   └── parent/
│   │       ├── ParentHomeScreen.tsx
│   │       ├── ChildManagementScreen.tsx
│   │       └── ReportsScreen.tsx
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── lessonService.ts
│   │   │   ├── assessmentService.ts
│   │   │   └── userService.ts
│   │   ├── storage/
│   │   │   ├── localStorage.ts
│   │   │   ├── secureStorage.ts
│   │   │   └── cloudSync.ts
│   │   ├── ai/
│   │   │   ├── lessonGenerator.ts
│   │   │   ├── assessmentGenerator.ts
│   │   │   └── adaptiveEngine.ts
│   │   └── export/
│   │       ├── pdfExporter.ts
│   │       └── reportGenerator.ts
│   │
│   ├── utils/
│   │   ├── constants/
│   │   │   ├── subjects.ts
│   │   │   ├── grades.ts
│   │   │   └── breakActivities.ts
│   │   ├── helpers/
│   │   │   ├── dateUtils.ts
│   │   │   ├── validationUtils.ts
│   │   │   └── encryptionUtils.ts
│   │   └── hooks/
│   │       ├── useLocalStorage.ts
│   │       ├── useTimer.ts
│   │       └── useProgressTracker.ts
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── lesson.ts
│   │   ├── assessment.ts
│   │   ├── student.ts
│   │   └── common.ts
│   │
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── lightTheme.ts
│   │   │   └── darkTheme.ts
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   └── navigation/
│       ├── AppNavigator.tsx
│       ├── AuthNavigator.tsx
│       ├── MainNavigator.tsx
│       └── types.ts
│
├── python-backend/
│   ├── requirements.txt
│   ├── main.py
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── lesson_generator.py
│   │   ├── assessment_engine.py
│   │   ├── curriculum_mapper.py
│   │   └── ai_tutor.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── lesson_models.py
│   │   ├── user_models.py
│   │   └── assessment_models.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── encryption.py
│   │   ├── validators.py
│   │   └── helpers.py
│   └── tests/
│       ├── __init__.py
│       ├── test_lesson_generator.py
│       └── test_assessment_engine.py
│
├── scripts/
│   ├── setup.sh
│   ├── build.sh
│   ├── deploy.sh
│   ├── test.sh
│   ├── code-gen.py
│   └── git-sync.sh
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── sounds/
│
└── tests/
    ├── __tests__/
    ├── e2e/
    └── utils/
```

## Key Features by Module

### Core Modules
- **Authentication & Onboarding**: User type detection, child setup
- **Lesson Planning**: AI-powered lesson generation, customization
- **Student Interface**: Patient, encouraging learning environment
- **Assessment Engine**: Adaptive testing, progress tracking
- **Export System**: PDF generation, report creation
- **Privacy & Security**: Local-first storage, encryption

### Technology Stack
- **Frontend**: React Native (Expo), TypeScript
- **Backend**: Python (FastAPI), SQLite/PostgreSQL
- **AI/ML**: OpenAI API, TensorFlow Lite
- **Storage**: Local SQLite, optional cloud sync
- **Export**: PDF generation, structured reports

## Development Workflow
1. Modular development with independent components
2. Automated testing and deployment
3. Git-based collaboration with proper branching
4. Documentation-driven development
5. Privacy-first approach with GDPR compliance