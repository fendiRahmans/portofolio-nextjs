import React from "react";
import Background from "../Background";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-background-dark text-white font-display min-h-screen relative overflow-hidden">
      <Background />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="relative z-10 ml-64 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
