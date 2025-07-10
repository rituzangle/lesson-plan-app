# K-12 Lesson Plan App

A comprehensive, inclusive lesson planning application for K–12 educators, parents, or self-learners.

---

## ✨ Features
- 🎯 Accessibility-first design
- 📚 Traditional curriculum and Arts
- ✅ Knowlege level not Age based Planning
- 🎭 Performing arts curriculum integration
- 👥 Multi-user support (Teachers, Parents, Students, Self-Study)
- 🔒 Encrypted data storage
- 📱 PWA + Mobile app support (Expo/React Native)

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

## 🚀 Setup
```bash
npm install
npm run setup           # Custom project setup
