import React from "react";
import { SidebarNew } from "../components/SidebarNew";
import Appbar from "../components/Appbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Appbar />
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 h-screen flex-col items-start gap-5 p-2 border-r border-gray-800">
          <SidebarNew />
        </aside>
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
