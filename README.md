# 🐱 Tabby — Cozy Expense Splitter

Tabby is a cross-platform mobile application designed to simplify shared expense tracking. It enables groups to split costs intelligently, handle real-world edge cases like covered members, and settle balances with optimized payment suggestions.

Built with a focus on clean architecture, strong typing, and real-world financial logic, Tabby demonstrates both product thinking and engineering depth.

---

## ✨ Features

- 📱 **Cross-platform (iOS + Android)** using React Native + Expo  
- 💸 **Flexible expense splitting**
  - Equal splits
  - Custom participant selection
  - Covered members (included but don’t pay)
  - “Covered by payer” (no repayment expected)
- 🧠 **Automatic balance calculation**
- 🔄 **Optimized settlement suggestions**
- ✏️ **Edit & delete expenses**
- 👥 **Edit group members dynamically**
- ⚠️ **Confirmation modals** for destructive actions
- 💾 **Offline persistence** with AsyncStorage
- 🎨 **Modern, polished mobile UI**

---

## 🧠 Engineering Highlights

### 🔹 Custom Financial Logic
Designed a flexible system supporting:
- Partial participation in expenses  
- Covered members within shared costs  
- Dynamic recalculation of balances on every update  

---

### 🔹 Debt Settlement Algorithm
Implemented a **greedy algorithm** to minimize transactions:

- Converts raw balances into optimized payment flows  
- Reduces unnecessary transfers between users  
- Handles uneven splits and real-world scenarios  

---

### 🔹 State Management
- Built with **Zustand**
- Lightweight global store with reactive updates
- Clear separation between UI and business logic

---

### 🔹 Type Safety (TypeScript)
- Strongly typed models:
  - `Group`
  - `Expense`
- Optional and conditional fields handled safely
- Reduces runtime errors and improves maintainability

---

### 🔹 Offline-First Architecture
- Data persisted using **AsyncStorage**
- No backend required
- Instant read/write performance
- Fully functional offline experience

---

### 🔹 Cross-Platform Development
- Single codebase deployed to:
  - iOS Simulator
  - Android Emulator
- Ensured consistent UI/UX across platforms

---

### 🔹 UX & Edge Case Handling
Designed for real-world use cases:
- One user pays for everyone
- Some members are covered (don’t pay)
- Dynamic group edits without breaking logic
- Safe deletion and settlement via confirmation modals

---

### 🔹 Debugging & Iteration
- Resolved platform-specific issues (iOS vs Android)
- Handled Expo runtime and emulator inconsistencies
- Iteratively refined UI and logic through testing

---

## 🛠️ Tech Stack

- **React Native**
- **Expo**
- **TypeScript**
- **Zustand (State Management)**
- **AsyncStorage (Persistence)**

---

## 📸 Screenshots

<p align="center">
  <img src="images/screenshots/home.png" width="250" />
  <img src="images/screenshots/create-group.png" width="250" />
  <img src="images/screenshots/add-expense.png" width="250" />
</p>

<p align="center">
  <img src="images/screenshots/group.png" width="250" />
  <img src="images/screenshots/edit-group.png" width="250" />
</p>

---

## 🚀 Getting Started

```bash
git clone https://github.com/szzbj720/tabby.git
cd tabby
npm install
npx expo start