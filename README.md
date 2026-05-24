# 🐱 Tabby — Cozy Expense Splitter

Tabby is a cross-platform mobile application designed to simplify shared expense tracking. It enables groups to split costs intelligently, handle real-world edge cases, and settle balances with optimized payment flows.

Built with a strong focus on **engineering quality, algorithmic thinking, and real-world usability**, Tabby goes beyond basic expense apps by supporting flexible financial scenarios.

---

## 🚀 Why This Project Matters

Most expense splitters handle only simple equal splits.

Tabby is designed for **real-life situations**, including:
- One person covering others
- Partial participation in expenses
- Users included but not required to pay
- Minimizing the number of transactions needed to settle debts

This project demonstrates the ability to build **production-quality mobile software** with both **technical depth and product intuition**.

---

## ✨ Features

- 📱 Cross-platform mobile app (iOS + Android)
- 💸 Intelligent expense splitting:
  - Equal splits
  - Custom participant selection
  - Covered members (included but don’t pay)
  - “Covered by payer” (no repayment expected)
- 🧠 Real-time balance calculation
- 🔄 Optimized settlement suggestions
- ✏️ Edit & delete expenses
- 👥 Dynamic group member editing
- ⚠️ Confirmation modals for safe actions
- 💾 Persistent local storage (offline-first)
- 🎨 Clean, modern, user-friendly UI

---

## 🧠 Engineering Highlights

### 🔹 Advanced Financial Logic
Implemented a flexible system that supports:
- Partial participation in expenses  
- Covered members within shared costs  
- Dynamic recalculation of balances on updates  

---

### 🔹 Debt Settlement Algorithm
Designed a **greedy algorithm** to minimize the number of transactions:

- Converts raw balances into optimized payment flows  
- Reduces unnecessary payments between users  
- Handles uneven splits and real-world constraints  

---

### 🔹 State Management Architecture
- Built using **Zustand**
- Lightweight and scalable global state
- Clear separation between UI and business logic

---

### 🔹 TypeScript & Data Modeling
- Strongly typed models (`Group`, `Expense`)
- Safe handling of optional and conditional fields
- Improved reliability and maintainability

---

### 🔹 Offline-First System Design
- Data persisted using **AsyncStorage**
- Fully functional without backend
- Instant read/write performance

---

### 🔹 Cross-Platform Development
- Single codebase deployed to:
  - iOS Simulator
  - Android Emulator
- Debugged and ensured consistency across platforms

---

### 🔹 UX & Product Thinking
Designed for real-world usage:

- Supports “treat” scenarios (payer covers all)
- Handles edge cases without breaking logic
- Provides safe destructive actions (confirmation modals)
- Clean and intuitive interaction flow

---

### 🔹 Debugging & Iteration
- Resolved platform-specific issues (iOS vs Android)
- Fixed state synchronization bugs
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
  <img src="assets/screenshots/home.png" width="250" />
  <img src="assets/screenshots/create-group.png" width="250" />
  <img src="assets/screenshots/add-expense.png" width="250" />
</p>

<p align="center">
  <img src="assets/screenshots/group.png" width="250" />
  <img src="assets/screenshots/edit-group.png" width="250" />
</p>

---

## 🧪 Example Scenario

A group of 6 people shares a $108 expense:
- One person pays
- One member is covered (does not pay)

Tabby correctly:
- Splits cost across participants
- Excludes covered member from repayment
- Calculates accurate balances
- Generates optimized settlement payments

---

## 🚀 Getting Started

```bash
git clone https://github.com/szzbj720/tabby.git
cd tabby
npm install
npx expo start