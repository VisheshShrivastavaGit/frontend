import React from "react";
import { useTheme } from "../contexts/ThemeProvider";
import { useGoogleAuth } from "../contexts/GoogleAuthProvider";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";

function UserButton() {
  return (
    <Link
      to="/profile"
      className="flex items-center gap-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      <span className="hidden sm:inline">Profile</span>
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

function MobileSidebarButton({ onOpenSidebar }) {
  return (
    <button
      className="md:hidden px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      title="Open menu"
      onClick={onOpenSidebar}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

function DemoModeBadge() {
  const { handleLogout } = useGoogleAuth();

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">
      <span className="text-sm font-medium">🎯 Demo Mode</span>
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

export default function Appbar({ onOpenSidebar }) {
  const { theme, toggle } = useTheme();
  const { isDemoMode } = useGoogleAuth();

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ">
      <div className="flex items-center gap-2">
        <MobileSidebarButton onOpenSidebar={onOpenSidebar} />
        <span className="font-bold text-lg text-gray-900 dark:text-white hidden md:inline">
          Track Your Attendance
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-4 w-auto">
        {isDemoMode && <DemoModeBadge />}
        <div className="hidden md:block w-64">
          <Searchbar />
        </div>
        <button
          onClick={toggle}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          title="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <UserButton />
      </div>
    </header>
  );
}
