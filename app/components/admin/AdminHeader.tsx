"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/actions/auth";
import { useSidebar } from "./AdminLayout";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

type User = {
  id: number;
  name: string;
  email: string;
} | null;

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [user, setUser] = useState<User>(null);
  const { toggle } = useSidebar();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  return (
    <header className="glass-panel border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between gap-4">
      {/* Left Section: Menu button + Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={toggle}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-white">menu</span>
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{title}</h1>
          {subtitle && <p className="text-white/50 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="text-right hidden md:block">
          <p className="text-white text-sm font-medium">
            {user?.name || "Admin User"}
          </p>
          <p className="text-white/40 text-xs">
            {user?.email || "admin@portfolio.com"}
          </p>
        </div>
        <div className="size-8 sm:size-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[16px] sm:text-[20px]">
            person
          </span>
        </div>

        {/* Divider - hidden on mobile */}
        <div className="h-8 w-px bg-white/10 mx-1 sm:mx-2 hidden sm:block"></div>

        <LogoutButton />
      </div>
    </header>
  );
}
