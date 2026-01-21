"use client";

import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Clear local storage
    localStorage.removeItem("admin_token");

    // 2. Call server action to clear cookie
    await logout();

    // 3. Redirect (should be handled by server action redirect, but safe to have client side push technically, though server redirect is better)
    // The server action 'logout' has redirect() so this might throw an error if we wait for it.
    // However, since we are calling it as an async function, we can just let it run.
    // Better yet, we can't `await` a server action that redirects in client component easily without catching the redirect error if we want to do more stuff.
    // But for a simple logout, letting the server redirect is fine.
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
      title="Logout"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
    </button>
  );
}
