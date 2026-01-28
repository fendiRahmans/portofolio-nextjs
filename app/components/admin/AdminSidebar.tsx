"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  icon: string;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "layers", label: "Tech Stack", href: "/admin/tech-stack" },
  { icon: "person", label: "About", href: "/admin/about" },
  { icon: "work_history", label: "Career", href: "/admin/career" },
  { icon: "mail", label: "Messages", href: "/admin/contact" },
  { icon: "settings", label: "Settings", href: "/admin/settings" },
];

import { logout } from "@/actions/auth";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    localStorage.removeItem("admin_token");
    await logout();
  };

  return (
    <>
      {/* Mobile Overlay - only visible on mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:pointer-events-none lg:opacity-0 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      {/* On mobile: hidden by default, slides in when isOpen is true */}
      {/* On desktop (lg+): always visible */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 glass-sidebar border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
                <span className="material-symbols-outlined text-[22px]">
                  admin_panel_settings
                </span>
              </div>
              <div>
                <span className="font-bold text-white text-lg">Admin</span>
                <p className="text-white/40 text-xs">Portfolio Manager</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-white/60">close</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-4 px-3">
            Menu
          </p>
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
