export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        Available for hire
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent pb-2">
        Frontend Specialist & <br className="hidden md:block" /> Fullstack Developer
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed mb-8">
        AI-Adaptive Learner crafting pixel-perfect digital experiences. I blend
        modern architecture with premium, motion-rich interfaces.
      </p>
      <div className="flex gap-4">
        <button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-[0_0_20px_rgba(25,93,230,0.3)] hover:shadow-[0_0_30px_rgba(25,93,230,0.5)] flex items-center gap-2">
          <span>View Projects</span>
        </button>
        <button className="h-12 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all backdrop-blur-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">download</span>
          <span>CV</span>
        </button>
      </div>
    </section>
  );
}
