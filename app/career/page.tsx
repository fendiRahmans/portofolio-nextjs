import Link from "next/link";
import Background from "../components/Background";
import Dock from "../components/Dock";
import TimelineItem from "../components/timeline/TimelineItem";

export default function CareerTimeline() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen relative selection:bg-primary/30">
      <Background />
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
            <span className="material-symbols-outlined text-[20px]">
              terminal
            </span>
          </div>
          <span className="font-bold tracking-tight text-lg">DevPortfolio</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            href="/"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-40 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <section className="w-full max-w-4xl mx-auto px-4 md:px-0 mb-32 relative z-10">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Career Timeline
              </h2>
              <p className="text-white/40">
                A journey through code and innovation (2019-2025)
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-8 mb-2"></div>
            <button className="text-sm text-primary hover:text-white transition-colors flex items-center gap-1 group">
              Download Full Resume{" "}
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="relative pl-8 md:pl-12 border-l border-white/5 space-y-12 pb-8">
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary via-purple-500 to-transparent shadow-[0_0_15px_rgba(25,93,230,0.6)]"></div>

            <TimelineItem
              year="2025 — Present"
              title="Izidok & Hitalent"
              subtitle="Lead Fullstack & Mobile Architect"
              description="Spearheading the fullstack architecture for the Izidok telemedicine platform and developing the native Hitalent Android ecosystem."
              icon="devices"
              color="primary"
              projectList={[
                { name: "Izidok:", type: "Fullstack Laravel Development" },
                { name: "Hitalent:", type: "Android Flutter App" },
              ]}
              techStack={["Laravel", "Vue.js", "Flutter", "Dart"]}
            />

            <TimelineItem
              year="2024"
              title="Frontend Ecosystem"
              subtitle="Hitalent, Gaidz & Otca Meyer"
              description="Delivered high-performance frontend applications using Next.js and Nuxt.js. Focused on scalable admin panels, dashboards, and user-facing platforms."
              icon="code_blocks"
              color="cyan"
              keyProjects={[
                "Hitalent V3 (Next.js)",
                "Gaidz (Next.js)",
                "Otca Meyer (Nuxt.js)",
                "Superadmin & Personalia",
              ]}
              techStack={["Next.js", "Nuxt.js", "React", "Tailwind"]}
            />

            <TimelineItem
              year="2023"
              title="Enterprise Systems"
              subtitle="OutSystems & Banking Solutions"
              description="Developed critical banking modules and enterprise applications. Specialized in low-code OutSystems solutions and secure React integrations."
              icon="apartment"
              color="purple"
              keyProjects={[
                "NNA",
                "DDMA",
                "Sectara",
                "GTQ",
                "BAT Mobile",
                "BSI Risk (React)",
                "Eduline (Nuxt)",
              ]}
              techStack={["OutSystems", "React.js", "Nuxt.js", "SQL Server"]}
            />

            <TimelineItem
              year="2022"
              title="Fullstack Solutions"
              subtitle="Diverse Client Projects"
              description="Built custom POS systems, non-profit platforms, and educational tools."
              icon="web"
              color="amber"
              bulletPoints={[
                "Cashier Danarhadi",
                "STC Save the Children Platform",
                "Siswa Bekawan Education Tool",
              ]}
              techStack={["Web Development", "POS Systems"]}
            />

            <TimelineItem
              year="2021"
              title="System Migrations"
              subtitle="Web Development & Themes"
              description="Executed system migrations and developed employee management systems."
              icon="sync_alt"
              color="emerald"
              keyProjects={[
                "Migrasi Sipedet",
                "Daftar Karyawan",
                "Tema Jejak Hati",
                "Navila",
                "Pisuka",
              ]}
              techStack={["System Migration", "PHP"]}
            />

            <TimelineItem
              year="2020"
              title="App Support"
              subtitle="Fintech & Services"
              description="Provided technical support and development for Cashme Indosat integration and online dating platforms."
              icon="support_agent"
              color="rose"
              keyProjects={["Cashme Indosat", "Dating Online Support"]}
            />

            <TimelineItem
              year="2019"
              title="The Beginning"
              subtitle="Junior Fullstack Developer"
              description="Developed the **Tiketing Bus Tami Jaya** system, streamlining transport booking operations." // Bold not supported natively in description string unless parsed, but sticking to prop contract
              icon="directions_bus"
              color="indigo"
              techStack={["PHP", "CodeIgniter", "MySQL"]}
            />
          </div>
        </section>
      </main>
      <Dock />
    </div>
  );
}
