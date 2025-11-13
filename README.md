# 🚗 Roslin Service Logs

A modern web application for managing and tracking vehicle service logs with draft management, auto-save functionality, and persistent storage.

## ✨ Features

### 📝 Service Log Management

- Create, edit, and delete vehicle service logs
- Track provider ID, service order, car ID, odometer readings, and engine hours
- Record start/end dates and detailed service descriptions
- Categorize services as Planned, Unplanned, or Emergency

### 💾 Draft System

- Auto-save drafts every 300ms as you type
- Create multiple drafts and switch between them
- Visual save status indicators ("Saving..." / "Draft saved")
- Persist drafts across browser sessions using LocalStorage
- Delete individual drafts or clear all at once

### 🔍 Advanced Filtering

- Search by provider ID, service order, or car ID
- Filter by start date range
- Filter by service type (Planned/Unplanned/Emergency)
- Real-time filtering with instant results

### 🎨 Modern UI/UX

- Clean, responsive design with Tailwind CSS
- Radix UI components for accessibility
- Color-coded service type badges
- Modal confirmations for destructive actions
- Date formatting with intuitive display (e.g., "Nov 13, 2025")

### 🔒 Data Persistence

- LocalStorage integration for client-side persistence
- Redux state management for predictable data flow
- Data survives page refreshes and browser restarts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/LynxCatDev/Roslin-Service-Logs.git
cd Roslin-Service-Logs
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

### Core

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool and dev server

### State Management

- **Redux Toolkit 2.10.1** - Global state management
- **React Redux 9.2.0** - React bindings for Redux

### Form Management

- **Formik 2.4.9** - Form handling and validation
- **Yup 1.7.1** - Schema validation

### UI Components

- **Radix UI** - Accessible component primitives
  - @radix-ui/react-label
  - @radix-ui/react-select
  - @radix-ui/react-dialog
  - @radix-ui/react-icons
  - @radix-ui/themes (Table component)
- **Tailwind CSS 4.1.17** - Utility-first styling

### Utilities

- **date-fns 4.1.0** - Date formatting and manipulation

## 📂 Project Structure

```
src/
├── components/
│   ├── ServiceLogForm.tsx      # Main form with draft management
│   ├── ServiceLogTable.tsx     # Table with filters and actions
│   ├── EditServiceLogDialog.tsx # Edit modal
│   ├── ConfirmDialog.tsx       # Reusable confirmation modal
│   └── DraftDialog.tsx         # Draft selection modal
├── store/
│   ├── store.ts                # Redux store configuration
│   ├── serviceLogSlice.ts      # Service logs state
│   ├── draftSlice.ts           # Drafts state with auto-save
│   └── hooks.ts                # Typed Redux hooks
├── utils/
│   ├── localStorage.ts         # LocalStorage utilities
│   └── dateUtils.ts            # Date helper functions
├── types/
│   └── index.ts                # TypeScript interfaces
├── App.tsx                     # Root component
└── main.tsx                    # Entry point
```

## 🎯 Key Features Explained

### Auto-Save System

The application automatically saves your draft every 300ms after you stop typing. The save status is displayed in real-time:

- **"Saving..."** - Changes are being persisted
- **"Draft saved"** ✓ - All changes have been saved

### Draft Management

- Click **"Create Draft"** to save your current form as a draft
- Switch between drafts by clicking draft buttons in the top card
- **"Delete Draft"** removes the currently active draft
- **"Clear All Drafts"** removes all drafts at once (with confirmation)

### Date Auto-Update

When you change the start date, the end date automatically updates to be one day later, streamlining data entry for typical service logs.

### Data Persistence

All service logs and drafts are stored in the browser's LocalStorage, ensuring your data persists even after closing the browser or refreshing the page.

## 🧪 Development

### Code Quality

```bash
npm run lint
```

### Type Checking

```bash
npm run build
```

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**LynxCatDev**

- GitHub: [@LynxCatDev](https://github.com/LynxCatDev)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React, TypeScript, and Vite
