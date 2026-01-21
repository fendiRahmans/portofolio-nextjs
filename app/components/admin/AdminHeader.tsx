"use client";

import React from "react";
import LogoutButton from "./LogoutButton";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="glass-panel border-b border-white/10 px-8 py-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-white/50 text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Admin Profile */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-medium">Admin User</p>
          <p className="text-white/40 text-xs">admin@portfolio.com</p>
        </div>
        <div className="size-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">
            person
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <LogoutButton />
      </div>
    </header>
  );
}
