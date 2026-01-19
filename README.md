# 🇩🇪 German Address Validator

A simple, modern and responsive web application designed to validate German postal codes (PLZ) and localities in real-time.It leverages the **Open PLZ API** to provide an effortless user experience for address verification.

---

## ✨ Features

- **🚀 Real-time Validation**: Instantly verifies localities and postal codes as you type.
- **⏱️ Smart Debouncing**: Implements a 1-second debounce to minimize API calls and ensure a smooth UI.
- **🔄 Cross-Field Sync**: 
  - **By Locality**: Automatically suggests postal codes. If multiple exist, it transforms into an intuitive dropdown.
  - **By PLZ**: Instantly fetches the corresponding city/town name.
- **🎨 Modern Design**: Features a simple interface, Plus Jakarta Sans typography, and minimal fluid animations.
- **📱 Responsive Layout**: Fully optimized for desktop, tablet, and mobile viewing.
- **🛡️ Error Handling**: Real-time feedback for invalid inputs with graceful error states.

---

## 🛠️ Technologies Involved

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for blazing-fast development.
- **[TypeScript](https://www.typescriptlang.org/)**: Static typing for more reliable and maintainable code.
- **[Open PLZ API](https://www.openplzapi.org/)**: The engine behind the German address data.
- **CSS3**: Custom variables, flexbox, and keyframe animations for a premium feel.

---

## 🚀 How to Run

### Prerequisites
- Node.js (v18.x or later)
- npm

### Installation
1. Clone the project.
2. Install dependencies:
   ```bash
   npm install

   or (if you are facing dep. issues)

    npm install --force 
   ```

### Development
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 📄 License
This project was created as part of a technical challenge for **Digital Product School❤️**.

---
*Powered by Open PLZ API*
