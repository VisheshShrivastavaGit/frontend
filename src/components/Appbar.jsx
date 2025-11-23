import React from "react";
import { useAuth } from "../contexts/AppProvider";
import { Link } from "react-router-dom";

function UserButton() {
  return (
    <Link
      to="/profile"
      className="flex items-center gap-2 px-2 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
    >
      <span>Profile</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 14a4 4 0 0 1-8 0"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
        />
      </svg>
    </Link>
  );
}

function DemoModeBadge() {
  const { handleLogout } = useAuth();

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900 text-yellow-200 border border-yellow-700">
      <span className="text-sm font-medium">Demo Mode</span>
      <button
        onClick={handleLogout}
        className="text-xs hover:underline"
        title="Exit demo mode"
      >
        Exit
      </button>
    </div>
  );
}

export default function Appbar() {
  const { isDemoMode } = useAuth();

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-white">
          Track Your Attendance
        </span>
      </div>
      <div className="flex items-center gap-4">
        {isDemoMode && <DemoModeBadge />}
        <UserButton />
      </div>
    </header>
  );
}
