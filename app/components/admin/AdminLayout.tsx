"use client";

import React, { useState, createContext, useContext } from "react";
import Background from "../Background";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Context for sidebar state
interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within AdminLayout");
  }
  return context;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarContextValue: SidebarContextType = {
    isOpen: isSidebarOpen,
    toggle: () => setIsSidebarOpen((prev) => !prev),
    open: () => setIsSidebarOpen(true),
    close: () => setIsSidebarOpen(false),
  };

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <div className="bg-background-dark text-white font-display min-h-screen relative overflow-hidden">
        <Background />

        {/* Sidebar */}
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="relative z-10 lg:ml-64 min-h-screen flex flex-col">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
