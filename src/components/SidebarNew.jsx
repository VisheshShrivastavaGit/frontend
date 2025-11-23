import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { title: "Home", to: "/dashboard", icon: HomeIcon },
  { title: "Today's Courses", to: "/attendance", icon: CalendarIcon },
  { title: "All Courses", to: "/courses", icon: BookIcon },
  { title: "Settings", to: "/settings", icon: SettingsIcon },
  { title: "Profile", to: "/profile", icon: UserIcon },
];

function IconWrapper({ children }) {
  return <span className="inline-flex items-center mr-2">{children}</span>;
}

export function SidebarNew() {
  return (
    <div className="flex flex-col gap-3">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) =>
            `w-full flex items-center px-3 py-2 rounded transition-colors ${isActive
              ? "bg-blue-900 text-blue-200 font-bold"
              : "text-gray-300 hover:bg-gray-800"
            }`
          }
        >
          <IconWrapper>{it.icon()}</IconWrapper>
          <span className="md:hidden lg:inline-block">{it.title}</span>
        </NavLink>
      ))}
    </div>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l9-9 9 9v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 2v4M8 2v4M3 10h18"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 20l9-5-9-5-9 5 9 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 12l9-5-9-5-9 5 9 5z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.3 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.3 3.3A2 2 0 0 1 7.12.47l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V0a2 2 0 0 1 4 0v.09c.04.6.42 1.1 1 1.51h.12c.63.21 1.2.67 1.44 1.29l.06.06a2 2 0 0 1 2.83 2.83l-.06.06c-.21.43-.21.92 0 1.35.21.43.21.92 0 1.35z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
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
  );
}
