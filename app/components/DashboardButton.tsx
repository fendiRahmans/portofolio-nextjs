import { isAuthenticated } from "@/actions/auth";
import Link from "next/link";

export default async function DashboardButton() {
  const loggedIn = await isAuthenticated();

  // Only show button if user is logged in
  if (!loggedIn) {
    return null;
  }

  return (
    <Link
      href="/admin/dashboard"
      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-full text-sm font-medium transition-all backdrop-blur-md flex items-center gap-2 text-blue-100 hover:text-white"
    >
      <span className="material-symbols-outlined text-[16px]">dashboard</span>
      <span>Dashboard</span>
    </Link>
  );
}
