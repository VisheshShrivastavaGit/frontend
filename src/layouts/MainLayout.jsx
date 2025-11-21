import React, { useState } from "react";
import { SidebarNew } from "../components/SidebarNew";
import Appbar from "../components/Appbar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Provide a way for Appbar to open sidebar
  window.openSidebar = () => setSidebarOpen(true);
  window.closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Appbar onOpenSidebar={() => setSidebarOpen(true)} />
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex lg:w-64 md:w-20 w-full h-20 md:h-full flex-col justify-between lg:justify-between items-start gap-5 p-2 border-r border-gray-200 dark:border-gray-800">
          <SidebarNew />
        </aside>
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-lg p-4" onClick={e => e.stopPropagation()}>
              <button className="mb-4 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200" onClick={() => setSidebarOpen(false)}>Close</button>
              <SidebarNew />
            </div>
          </div>
        )}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
