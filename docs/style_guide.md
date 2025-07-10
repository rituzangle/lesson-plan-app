# ✏️ Coding Style & Naming Guide

Consistent style improves readability, maintainability & AI prompt context.

---

## ✅ General
- Follow [PEP8](https://peps.python.org/pep-0008/) for Python parts
- Use ESLint + Prettier defaults for TypeScript/JavaScript
- Prefer clarity over brevity in names & comments

---

## 🧩 Naming conventions

| Item             | Style              | Example                    |
|------------------|-------------------:|---------------------------|
| React component  | PascalCase         | `LessonList`              |
| Functions        | camelCase          | `fetchLessonPlans()`      |
| Variables        | camelCase          | `selectedSubject`         |
| Constants        | UPPER_SNAKE_CASE   | `MAX_LESSONS`             |
| File names       | kebab-case         | `lesson-card.tsx`         |
| CSS/Style files  | kebab-case         | `lesson-card.module.css`  |

---

## 📦 Project structure
- `components/`: shared, reusable UI
- `screens/`: top-level views
- `utils/`: helpers (pure functions)
- `constants/`: enums & app config
- `types/`: TypeScript types/interfaces

---

## ✏️ Comments
- Explain *why* something is done, not just *what*
- Use full sentences when possible
- Keep up to date — remove outdated comments

---

## 🤖 LLM-friendly
- Use clear, descriptive commit messages
- Write docstrings & README updates alongside code changes
- Reference related docs or ChatGPT sessions in commit or log

---

📅 **Last updated:** 2025-07-09

