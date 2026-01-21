"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const token = localStorage.getItem("admin_token");

    // Logic 1: If user is logged in and visits login page, redirect to dashboard
    if (pathname === "/admin/login" && token) {
      router.push("/admin/dashboard");
    }

    // Logic 2: If user is NOT logged in and tries to access other admin pages, redirect to login
    if (pathname !== "/admin/login" && !token) {
      router.push("/admin/login");
    }
  }, [pathname, isMounted, router]);

  // Optional: Add a loading state or return null while checking to prevent flash of content
  // using a simple "isAuthChecked" state if desired. 
  // For now, we render children but the useEffect will trigger redirect fast.

  return <>{children}</>;
}
