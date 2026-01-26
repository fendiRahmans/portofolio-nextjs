import { getCareers } from "@/actions/career";
import { getSetting } from "@/actions/settings";
import WorkCard from "./experience/WorkCard";

export default async function Experience() {
  const { success, data } = await getCareers();
  const careers = success && data ? data : [];

  // Calculate years from data
  let minYear = new Date().getFullYear();
  let maxYear = new Date().getFullYear();
  let hasData = false;

  if (careers.length > 0) {
    const years = careers.flatMap(c => {
      const matches = c.year.match(/\d{4}/g);
      return matches ? matches.map(Number) : [];
    });

    if (years.length > 0) {
      minYear = Math.min(...years);
      maxYear = Math.max(...years);
      hasData = true;
    }

    // Check for "Present" or "Now" to set maxYear to current year
    const hasPresent = careers.some(c =>
      c.year.toLowerCase().includes('present') ||
      c.year.toLowerCase().includes('now')
    );

    if (hasPresent) {
      maxYear = new Date().getFullYear();
    }
  }

  const defaultSubtitle = hasData
    ? `Building scalable solutions since ${minYear}`
    : "Building scalable solutions since 2019";

  const defaultPeriod = hasData
    ? `${minYear} — ${maxYear}`
    : "2019 — 2025";

  const subtitle = (await getSetting("experience_subtitle")) || defaultSubtitle;
  const period = (await getSetting("experience_period")) || defaultPeriod;

  return (
    <section className="w-full max-w-6xl mx-auto px-2 md:px-0 mb-32 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Professional Experience
          </h2>
          <p className="text-white/40">{subtitle}</p>
        </div>
        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-8 mb-2"></div>
        <div className="flex items-center gap-2 text-sm text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{period}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(240px,auto)] mb-12">
        {careers.map((career) => (
          <WorkCard
            key={career.id}
            company={career.title}
            role={career.subtitle}
            period={career.year}
            icon={career.icon}
            color={career.color as any}
            descriptions={career.description.split("\n")}
            techStack={career.techStack || []}
          />
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <a
          className="glass-btn-subtle group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white/80 hover:text-white text-sm font-medium tracking-wide relative overflow-hidden"
          href="/career"
        >
          <span className="relative z-10">View Full Career Path</span>
          <span className="material-symbols-outlined relative z-10 text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -inset-1 bg-white/10 blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
        </a>
      </div>
    </section>
  );
}
