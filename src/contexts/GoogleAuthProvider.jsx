import React, { createContext, useContext, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useDemo } from "./DemoProvider";

const GoogleAuthContext = createContext(null);

export function useGoogleAuth() {
  return useContext(GoogleAuthContext);
}

function LoginButton({ onSuccess }) {
  const login = useGoogleLogin({
    onSuccess: onSuccess,
    flow: "auth-code",
    scope: "openid email profile https://www.googleapis.com/auth/calendar",
    onError: () => console.log("Login Failed"),
  });

  return (
    <button
      onClick={() => login()}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      Sign in with Google
    </button>
  );
}

export default function GoogleAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const demo = useDemo();

  const backendUrl = import.meta.env.VITE_API_URL || "";
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  React.useEffect(() => {
    // If demo mode is active, use demo user
    if (demo?.isDemoMode) {
      setUser(demo.getDemoUser());
      setLoading(false);
      return;
    }

    // Check if user is already logged in by calling a protected endpoint
    fetch(backendUrl + "/auth/me", {
      credentials: "include", // Important: send cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // Not logged in or error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [backendUrl, demo?.isDemoMode]);

  async function handleLoginSuccess(codeResponse) {
    setLoading(true);
    const { code } = codeResponse;
    console.log("Google code:", code);
    try {
      // Send Google auth code to backend
      const res = await fetch(backendUrl + "/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: allow cookies to be set
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        setUser(data.user);
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (e) {
      console.error("Login error:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    // If in demo mode, exit demo instead
    if (demo?.isDemoMode) {
      demo.exitDemo();
      return;
    }

    try {
      await fetch(backendUrl + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
  }

  function handleDemoLogin() {
    demo.enterDemo();
    setUser(demo.getDemoUser());
  }

  const value = { user, loading, handleLogout, isDemoMode: demo?.isDemoMode };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleAuthContext.Provider value={value}>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        ) : user ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Attendance Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track your attendance with ease
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <LoginButton onSuccess={handleLoginSuccess} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                    or
                  </span>
                </div>
              </div>

              <button
                onClick={handleDemoLogin}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                Try Demo Mode
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center max-w-xs">
              Demo mode lets you explore the app without signing in. Your data
              will be stored locally in your browser.
            </p>
          </div>
        )}
      </GoogleAuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
