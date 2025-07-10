# K-12 Lesson Plan App

A comprehensive, accessible lesson planning application for K-12 educators or students.

## Features
- 🎯 Accessibility-first design
- Traditional curriculum and Arts
- Knowlege level not Age based 
- 🎭 Performing arts curriculum integration
- 👥 Multi-user support (Teachers, Parents, Students, Self-Study)
- 🔒 Encrypted data storage
- 📱 PWA + Mobile app support

## 🚀 Setup
```bash
npm install
npm run setup           # Custom project setup
```
## Development
```bash
npm start
```

## Testing
```bash
npm run test:database
```

## Project Setup Script
- [shell setup script][scripts/setup-script.sh]
- [setup doc to create Project guide][scripts/create_project_guide.py]. 
   python create_project_guide.py ../my-new-project lesson-plan-app

## 📂 File Structure
```
src/
├── components/     # React components
├── database/       # Database schema and operations
├── navigation/     # App navigation
├── screens/        # Screen components
├── utils/          # Utility functions
├── constants/      # App constants
└── types/          # TypeScript type definitions
```

---

## ⚙️ Tools & Dependencies
| Tool | Version | Purpose |
|-----|---------:|--------|
| Node | ≥18.x LTS | Runtime |
| Expo SDK | ~49.0.15 | Mobile app / PWA |
| React Native | 0.72.6 | Cross-platform UI |
| Jest | ^29.7.0 | Unit tests |
| @testing-library/react-native | ^12.4.2 | Component tests |
| ESLint + Prettier | | Linting & formatting |

> 📦 Full list: see [`package.json`](./package.json)

---
## Documentation
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database.md)
- [Development Log](docs/development_log.md)
- [Project Guide][PROJECT_GUIDE.md]
- [Next Steps][NEXT_STEPS.md] To remember next set of steps on the plan while development

---
## 🌱 Branching Strategy
- `main`: production-ready code
- `dev`: active development & integration
- `feature/*`: short-lived branches for specific tasks

---

## 🧪 Testing
- Unit tests: `npm run test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`
- Database test placeholder: `npm run test:database`

---

## 🔧 CI/CD (planned)
- GitHub Actions:
  - Lint & type-check
  - Run unit tests
- Future: auto-build & deploy docs

---
## Development (commands)
npm start               # Expo CLI
npm run android         # Run on Android
npm run ios             # Run on iOS
npm run web             # Run as PWA

## 📄 Project Setup Script

- Generate project guide & automate Git setup:
python scripts/create_project_guide.py ../new-project lesson-plan-app
- Handles placeholders, Git init, remote add
- Guides beginners on using git & gh CLI
- Explains common Git/SSH errors
