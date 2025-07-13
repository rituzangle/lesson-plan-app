# 🧮 Copi Checklist – Storage & Migration Planning  
📆 Date: 07-12-25 🌆 Evening  
📁 Filename: copi_checklist_071225_evening.md

---

## ✅ Part 1: Storage Monitoring Dashboard

### 🎯 Goal
Create a light dashboard to monitor storage use across local (AsyncStorage) and cloud (Supabase)

### 🔧 Component
**Artifact ID:** `StorageStats.tsx`  
**Location:** `src/components/StorageStats.tsx`

### 🛠️ To Do
- [x] Use `AsyncStorage.getAllKeys()` to tally local keys  
- [x] Query Supabase records (`/lessons`) to estimate cloud volume  
- [ ] Add this dashboard to home or settings screen  
- [ ] Format output with playful icons (✨ optional)

---

## 🚀 Part 2: SQLite Migration Strategy

### 🎯 Goal
Transition sensitive and relational data from AsyncStorage to SQLite (when relational logic becomes essential)

### 🛠️ Steps to Prep
- [x] Identify data needing relationships (e.g. students ↔ lessons)
- [x] Design schema using [dbdiagram.io](https://dbdiagram.io/)
- [ ] Choose wrapper: `react-native-sqlite-storage` or `expo-sqlite`
- [ ] Write migration script from AsyncStorage → SQLite
- [ ] Add fallback reads if SQLite not initialized
- [ ] Gradually retire AsyncStorage once stable

### 🧠 Storage Strategy Notes
- 🔐 AES-256 encryption applied client-side before syncing to Supabase  
- 🧳 Local user scope stays isolated  
- 🔄 Git auto-sync logs track artifact progress  
- 📦 Est. user data size: ~0.5–1MB with moderate lesson volume

---

## 📝 Bonus: Migration Logging Tips

Use Git reports + markdown checklist files (`copi_checklist_`) to:
- Track migrated entries
- Mark milestone steps
- Prevent duplicate syncs

Consider a dedicated progress file:  
**`progress-report-07-12-25-evening.md`**

---

## 💬 Final Notes

All built with zero budget and infinite gratitude to the open-source cosmos 🌌  
Next Up: Success screen ideas, markdown support for summaries, or migration starter scripts—just wink and I’m in 😄



