# 🐱 Tabby — Cozy Expense Splitter

Tabby is a cross-platform mobile app that helps groups effortlessly track shared expenses, split costs intelligently, and settle balances with minimal friction.

Built with a focus on real-world financial scenarios, Tabby supports uneven splits, covered members, and optimized payment settlements.

---

## ✨ Features

- 📱 Cross-platform (iOS + Android) using React Native + Expo  
- 💸 Flexible expense splitting
  - Equal splits
  - Custom participants
  - Covered members (included but don’t pay)
  - “Covered by payer” (no repayment)
- 🧠 Automatic balance calculation
- 🔄 Optimized settlement suggestions
- ✏️ Edit & delete expenses
- 👥 Edit group members dynamically
- ⚠️ Confirmation modals for destructive actions
- 💾 Offline persistence with AsyncStorage
- 🎨 Clean, modern mobile UI

---

## 🧠 Engineering Highlights

### Custom Financial Logic
- Supports partial participation and real-world expense scenarios  
- Handles covered members within shared costs  
- Dynamically recalculates balances on updates  

---

### Debt Settlement Algorithm
- Implemented a greedy algorithm to minimize transactions  
- Converts balances into optimized payment flows  
- Reduces unnecessary transfers between users  

---

### State Management
- Built using Zustand  
- Lightweight global state with reactive updates  
- Clean separation of UI and business logic  

---

### Type Safety
- Fully written in TypeScript  
- Strongly typed models for Group and Expense  
- Safe handling of optional fields  

---

### Offline-first Architecture
- Uses AsyncStorage for persistent local data  
- No backend required  
- Instant read/write performance  

---

### Cross-platform Development
- Single codebase deployed to:
  - iOS Simulator
  - Android Emulator  
- Ensured UI/UX consistency across platforms  

---

### UX & Edge Case Handling
- One person pays for everyone  
- Some members don’t pay back  
- Dynamic group edits without breaking logic  
- Safe deletion and settlement confirmation  

---

## 🛠️ Tech Stack

- React Native  
- Expo  
- TypeScript  
- Zustand  
- AsyncStorage  

---

## 📸 Screenshots

<p align="center">
  <img src="screenshots/home.png" width="250" />
  <img src="screenshots/create-group.png" width="250" />
  <img src="screenshots/add-expense.png" width="250" />
</p>

<p align="center">
  <img src="screenshots/group.png" width="250" />
  <img src="screenshots/edit-group.png" width="250" />
</p>

---

## 🚀 Getting Started

```bash
git clone https://github.com/szzbj720/tabby.git
cd tabby
npm install
npx expo start