import React from "react";
import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthProvider";

export default function ProtectedRoute({ children }) {
  // const auth = useAuth();
  // if (auth.loading) return <div className="p-6">Checking authentication…</div>;
  // if (!auth.user) return <Navigate to="/auth" replace />;
  return children;
}
