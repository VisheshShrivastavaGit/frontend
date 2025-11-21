import React, { createContext, useContext, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

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

  const backendUrl = import.meta.env.VITE_API_URL || "";
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  React.useEffect(() => {
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
  }, [backendUrl]);

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

  const value = { user, loading, handleLogout };

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
          <div className="flex items-center justify-center min-h-screen">
            <LoginButton onSuccess={handleLoginSuccess} />
          </div>
        )}
      </GoogleAuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
