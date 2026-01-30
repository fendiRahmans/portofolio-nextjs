import Image from "next/image";
import { Suspense } from "react";
import DashboardButton from "./DashboardButton";
import { getChatEnabled } from "@/actions/settings";

async function ChatButton() {
  const isChatEnabled = await getChatEnabled();
  
  if (!isChatEnabled) return null;
  
  return (
    <a
      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/5 rounded-full text-sm font-medium transition-all backdrop-blur-md flex items-center gap-2"
      href="/chat"
    >
      <span>Let&apos;s Talk</span>
      <span className="material-symbols-outlined text-[16px]">
        arrow_forward
      </span>
    </a>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
      <div className="flex items-center gap-2">
        <Image
          src="/images/favicon-32x32.png"
          alt="DevPortfolio Logo"
          width={32}
          height={32}
          className="rounded-lg"
          priority
        />
        <span className="font-bold tracking-tight text-lg">DevPortfolio</span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Suspense fallback={null}>
          <DashboardButton />
        </Suspense>
        <a
          className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          href="#"
        >
          Resume
        </a>
        <Suspense fallback={null}>
          <ChatButton />
        </Suspense>
      </div>
    </nav>
  );
}
