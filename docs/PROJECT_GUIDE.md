# 📚 Project Guide & Next Steps  
Version: 2025-07-09

This file documents project philosophy, next steps, ethical guidelines, and dev practices.  
Include in each repo so an LLM (or human) can quickly get full context.

Use with create_project_guide.py, to:
- setup things like project name and git

Project README.md: 
- [Project GitHub Repository](https://github.com/rituzangle/lesson-plan-app)
---

## ✅ Done:
- Created GitHub repo and pushed initial files  
  SSH URL: `git@github.com:rituzangle/lesson-plan-app.git`
  > `git@github.com:rituzangle/<REPO-NAME>.git`

---
---
## Create or Update NEXTSTEPS.md
- after each artifact addition, update []
---
## 🚀 Next Steps (project-specific):
> Replace/add here:
- Initialize Expo project (`npx create-expo-app`)
- Set up folder structure: `app/`, `components/`, `assets/`
- Configure database for parent/guardian/tutor or self-use
- Onboarding: “Who is this for?” (self, child, group)
- Base plans on knowledge level vs age
- Build onboarding flow: user type → child/older/self config
- MVP: subject selection, templates, reminders, PDF export

---

## 📓 Always:
- Update dev log / changelog each completed step
- Use logs each session to plan next steps
- Sync with GitHub regularly; track with `git diff` & timestamps
- Automate repetitive tasks (scripts, file moves, changelog updates)
- Archive old logs to keep repo lightweight

---

## 🛡 Ritu’s Requirements:
- Inclusive design, privacy, accessibility
- Ethical standards:
  - Avoid tracking unless strictly needed
  - Encrypt data at rest & in transit
  - Cultural & linguistic respect in translation/localization
- Codebase:
  - Pythonic (where Python)
  - Modular, scalable, future-friendly
  - Clear comments, docstrings, version & date stamps
- Components:
  - Separate artifacts with version/date & path
  - Automate placement and update logs
- Ask for `rituzangle` as GitHub username in scripts
- Use SSH URL:  
git@github.com:rituzangle/.git

- Link to LLM conversation URLs for continuity

---

## 🧰 Practical:
- Keep code modules small & focused
- Document:
- Tools & dependencies (Expo SDK, Node, major libs)
- Branch strategy (main, dev, feature/*)
- Plans for linting, tests, CI/CD

---

## ⚙️ Automation Tips:
- Use `sed` or small Python scripts to update:
- Repo name
- Project title
- Date stamp
- Example:
```bash
sed -i '' 's/<REPO-NAME>/my-new-project/g' PROJECT_GUIDE.md

## A bit about Git 
- Friendly even if you haven't heard of 'git' outside of 🧙‍♀️ Hogwarts or UK!
- Experts can just hit Enter to skip
- LLMs can “read” the script output and follow instructions (saves tokens)
- Works cross-platform
-   1️⃣ Check if git is installed → suggest if missing
-   2️⃣ Check if gh is installed → suggest + guide to install
-   3️⃣ Offer to auto-create repo if gh is available
-   4️⃣ Helps resolve 'missing repo' error
-   5️⃣ Explainations in plain language:
-   6️⃣ “You can do this later. Here’s how.”      
-   7️⃣  If all else fails, print manual git steps

> 8️⃣ 9️⃣ 🔟 🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚 🕛

> is this a comment

## ❓ Why this file:
- Helps LLMs & new contributors understand philosophy, ethics & structure
- Saves tokens: context lives in docs, not repeated in prompts
    How?: upload this file instead of repeated typing for new asks 
- Reduces repetition
- Avoids repeating philosophy, style & ethics
- Keeps philosophy, ethics, and dev style visible to everyone on the team
- Provides visibility of dev context to team & future contributors
- Beginner and 🧙‍♀️ Wizard friendly
- Easy to diff & keep fresh
- Keeps dev process transparent & future-proof
