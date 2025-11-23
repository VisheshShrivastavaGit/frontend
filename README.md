# Frontend - Attendance Tracker

A modern React-based attendance tracking application with Google OAuth authentication, demo mode, and real-time attendance management.

## 🚀 Features

- **Google OAuth 2.0 Authentication** - Secure login with Google accounts
- **Demo Mode** - Try the application without signing up
- **Daily Attendance Tracking** - Mark attendance with duplicate prevention
- **Google Calendar Integration** - Automatically creates color-coded calendar events
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Real-time Updates** - Instant feedback on attendance marking

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **@react-oauth/google** - Google OAuth implementation
- **Tailwind CSS** - Utility-first CSS framework (if used)

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/                    # API client and HTTP utilities
│   │   └── index.js           # Axios/fetch wrapper
│   ├── components/            # Reusable UI components
│   │   ├── Appbar.jsx        # Navigation bar with theme toggle
│   │   ├── MainLayout.jsx    # Main layout wrapper
│   │   └── ProtectedRoute.jsx # Route guard for authentication
│   ├── contexts/              # React Context providers
│   │   ├── DemoProvider.jsx       # Demo mode state management
│   │   ├── GoogleAuthProvider.jsx # OAuth authentication
│   │   ├── DataProvider.jsx       # Course data management
│   │   └── ThemeProvider.jsx      # Dark/light theme
│   ├── pages/                 # Page components
│   │   ├── Dashboard.jsx     # Overview and statistics
│   │   ├── Attendance.jsx    # Daily attendance marking
│   │   ├── Courses.jsx       # Course list view
│   │   ├── CourseForm.jsx    # Create/edit courses
│   │   ├── CourseDetail.jsx  # Individual course details
│   │   └── Settings.jsx      # App settings and preferences
│   ├── utils/                 # Utility functions
│   │   ├── demoData.js       # Demo mode data generator
│   │   └── attendanceTracking.js # Daily tracking logic
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                    # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── vercel.json               # Vercel deployment config
```

## 🛠️ Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |

## 🎯 Key Features Explained

### 1. Google OAuth Authentication
- Users log in with their Google account
- Requests Calendar API scope for event creation
- Stores auth token in HTTP-only cookies

### 2. Demo Mode
- Client-side simulation using localStorage
- No backend required
- Sample courses and data pre-loaded
- Perfect for testing and demonstrations

### 3. Daily Attendance Tracking
- Prevents marking the same course twice per day
- Uses localStorage with date-based keys
- Persists across page refreshes
- Auto-resets next day

### 4. Context Architecture
```
DemoProvider (outermost)
└── ThemeProvider
    └── GoogleAuthProvider
        └── DataProvider
            └── App (with routing)
```

## 🔄 Data Flow

1. **Authentication Flow**
   ```
   User clicks login → Google OAuth popup → 
   Authorization code → Backend validates → 
   JWT token in cookie → User authenticated
   ```

2. **Course Management**
   ```
   User creates course → DataProvider checks mode →
   If demo: Save to localStorage
   If real: POST to backend API → Database
   ```

3. **Attendance Marking**
   ```
   User marks attendance → Check localStorage (today's marks) →
   If not marked: Update course stats + Create calendar event →
   Save mark to localStorage → Disable button
   ```

## 🎨 Styling

- Uses Tailwind CSS utilities (or custom CSS)
- Dark mode support via ThemeProvider
- Responsive grid layouts
- Custom color schemes for attendance status

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import repository in Vercel dashboard
   - Configure environment variables
   - Deploy automatically

3. **Environment Variables on Vercel**
   - `VITE_API_URL` - Your backend URL
   - `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID

### Manual Build

```bash
npm run build
# Output in dist/ folder
# Serve with any static host
```

## 🧪 Testing Demo Mode

1. Click "Try Demo Mode" on login page
2. Explore with sample courses
3. Try marking attendance
4. Refresh page - data persists
5. Click "Exit" to return to login

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers supported

## 🐛 Common Issues

### "Network Error" when marking attendance
- Check `VITE_API_URL` is correct
- Ensure backend is running
- Check CORS settings on backend

### Google OAuth not working
- Verify `VITE_GOOGLE_CLIENT_ID` is set
- Check authorized origins in Google Console
- Ensure redirect URIs are configured

### Demo mode data lost
- Demo data is in localStorage
- Clearing browser data removes it
- This is expected behavior

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Your License Here]
