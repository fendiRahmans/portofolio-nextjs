import TechCard from "./tech/TechCard";

export default function TechStack() {
  return (
    <section className="w-full max-w-5xl glass-panel rounded-3xl p-1 md:p-2 relative overflow-hidden mb-24">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-center md:justify-between">
        <h3 className="text-white/90 font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            layers
          </span>
          Core Technologies
        </h3>
        <div className="hidden md:flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <TechCard
          title="Next.js"
          description="App Router, SSR, Server Actions"
          icon={
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/10 shadow-lg">
              <span className="material-symbols-outlined text-white text-[24px]">
                code_blocks
              </span>
            </div>
          }
        />
        <TechCard
          title="TypeScript"
          description="Strict typing, Interfaces, Generics"
          icon={
            <div className="w-12 h-12 rounded-xl bg-[#3178C6] flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-lg">TS</span>
            </div>
          }
        />
        <TechCard
          title="Tailwind CSS"
          description="Design Systems, Animation, JIT"
          icon={
            <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/20 flex items-center justify-center border border-[#38BDF8]/30 shadow-lg">
              <span className="material-symbols-outlined text-[#38BDF8] text-[24px]">
                palette
              </span>
            </div>
          }
        />
        <TechCard
          title="Node.js"
          description="Express, NestJS, Microservices"
          icon={
            <div className="w-12 h-12 rounded-xl bg-[#339933]/20 flex items-center justify-center border border-[#339933]/30 shadow-lg">
              <span className="material-symbols-outlined text-[#339933] text-[24px]">
                dns
              </span>
            </div>
          }
        />
        <TechCard
          title="Flutter"
          description="Cross-platform, Dart, Riverpod"
          icon={
            <div className="w-12 h-12 rounded-xl bg-[#02569B]/20 flex items-center justify-center border border-[#02569B]/30 shadow-lg">
              <span className="material-symbols-outlined text-[#02569B] text-[24px]">
                smartphone
              </span>
            </div>
          }
        />
        <TechCard
          title="PostgreSQL"
          description="Supabase, Prisma, SQL"
          icon={
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-lg">
              <span className="material-symbols-outlined text-orange-500 text-[24px]">
                database
              </span>
            </div>
          }
        />
        <TechCard
          className="md:col-span-2"
          title="DevOps & Tools"
          description="Docker, AWS, Git, Figma"
          icon={
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm z-30">
                <span className="material-symbols-outlined text-xs text-white">
                  terminal
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm z-20">
                <span className="material-symbols-outlined text-xs text-white">
                  folder_zip
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm z-10">
                <span className="material-symbols-outlined text-xs text-white">
                  deployed_code
                </span>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
