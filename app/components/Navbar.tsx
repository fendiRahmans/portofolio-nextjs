export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
          <span className="material-symbols-outlined text-[20px]">terminal</span>
        </div>
        <span className="font-bold tracking-tight text-lg">DevPortfolio</span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <a
          className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          href="#"
        >
          Resume
        </a>
        <a
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/5 rounded-full text-sm font-medium transition-all backdrop-blur-md flex items-center gap-2"
          href="#"
        >
          <span>Let&apos;s Talk</span>
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </a>
      </div>
    </nav>
  );
}
