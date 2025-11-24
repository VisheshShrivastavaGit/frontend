# Attendance Tracker - Frontend 🎨

A modern, desktop-first React application for tracking course attendance. Built with simplicity, performance, and seamless Google integration in mind.

## 🚀 Features

- **OAuth 2.0 Authentication**: Secure sign-in with Google (Authorization Code Flow).
- **Google Calendar Sync**: Automatically syncs attendance status (Present/Absent) to your Google Calendar with color-coded events.
- **Permanent Dark Mode**: Sleek, eye-friendly dark UI.
- **Dashboard**: Visual overview of attendance stats and course status.
- **Course Management**: Create, edit, and delete courses with ease.
- **Attendance Tracking**: Mark classes as Present, Absent, or Cancelled.
- **Demo Mode**: Try all features without signing in (Local Storage).
- **Smart Analytics**: Color-coded indicators for attendance criteria (Green/Red).

## 🛠️ Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Permanent Dark Mode)
- **Routing**: React Router DOM v6
- **State Management**: React Context API (Unified `AppProvider`)
- **Auth**: `@react-oauth/google`
- **Icons**: Heroicons
- **HTTP Client**: Axios (with interceptors & auto-cookie handling)

## 📂 Project Structure

```
src/
├── api.js              # Axios configuration
├── App.jsx             # Route definitions
├── main.jsx            # Entry point & Providers
├── components/         # Reusable UI components
│   ├── Appbar.jsx     # Top navigation
│   ├── SidebarNew.jsx # Desktop sidebar
│   ├── CourseCard.jsx # Course display
│   └── Skeleton.jsx   # Loading states
├── contexts/
│   ├── AppProvider.jsx  # Unified Auth + Data context
│   └── DemoProvider.jsx # Demo mode logic
├── layouts/
│   └── MainLayout.jsx   # Desktop-only layout wrapper
├── pages/              # Main application views
│   ├── Dashboard.jsx   # Home & stats
│   ├── Attendance.jsx  # Daily tracking
│   ├── Courses.jsx     # Course list
│   ├── Settings.jsx    # Data management
│   └── Profile.jsx     # User profile
└── utils/              # Helper functions
```

## 🏃‍♂️ Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file in the root:
    ```env
    VITE_API_URL=http://localhost:3000
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🎯 Key Design Decisions

- **Desktop-Only**: Optimized for browser usage on laptops/desktops.
- **Unified Context**: Merged multiple contexts into a single `AppProvider` for easier maintenance.
- **Secure Auth**: Uses HttpOnly cookies for session management (no tokens in localStorage).
- **Axios Layer**: Centralized API configuration for automatic cookie handling.
