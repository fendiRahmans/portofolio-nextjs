import Link from "next/link";
import Image from "next/image";
import Background from "../components/Background";
import Dock from "../components/Dock";
import TimelineItem from "../components/timeline/TimelineItem";
import { getCareers } from "@/actions/career";
import { getSetting } from "@/actions/settings";

export default async function CareerTimeline() {
  const { success, data } = await getCareers();
  const careers = success && data ? data : [];

  // Logic to determine dynamic header text (Same as Experience component)
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

    const hasPresent = careers.some(c =>
      c.year.toLowerCase().includes('present') ||
      c.year.toLowerCase().includes('now')
    );

    if (hasPresent) {
      maxYear = new Date().getFullYear();
    }
  }

  const defaultSubtitle = hasData
    ? `A journey through code and innovation (${minYear}-${maxYear})`
    : "A journey through code and innovation (2019-2025)";

  // We can reuse the same settings or use new ones if specific to this page. 
  // For consistency with the specific request, I'll check if there are specific career page settings, 
  // but falling back to the calculated period is a safe bet.
  // The user didn't explicitly ask for separate settings for this page's header text, 
  // but the "Experience" component uses 'experience_subtitle/period'.
  // I will use a generic 'career_subtitle' if they want to override this specific page's text, 
  // or just default to the calculated string.

  const headerSubtitle = (await getSetting("career_subtitle")) || defaultSubtitle;

  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen relative selection:bg-primary/30">
      <Background />
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
                {headerSubtitle}
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

            {careers.map((career) => (
              <TimelineItem
                key={career.id}
                year={career.year}
                title={career.title}
                subtitle={career.subtitle}
                description={career.description}
                icon={career.icon}
                color={career.color as any}
                projectList={career.projectList || undefined}
                keyProjects={career.keyProjects || undefined}
                techStack={career.techStack || undefined}
                bulletPoints={career.bulletPoints || undefined}
              />
            ))}
          </div>
        </section>
      </main>
      <Dock />
    </div>
  );
}
