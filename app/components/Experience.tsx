import WorkCard from "./experience/WorkCard";
import ProjectCard from "./experience/ProjectCard";

export default function Experience() {
  return (
    <section className="w-full max-w-6xl mx-auto px-2 md:px-0 mb-32 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Professional Experience
          </h2>
          <p className="text-white/40">Building scalable solutions since 2019</p>
        </div>
        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-8 mb-2"></div>
        <div className="flex items-center gap-2 text-sm text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>2019 — 2025</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px] mb-12">
        <WorkCard
          company="Izidok"
          role="Lead Fullstack Architect"
          period="2021 — Present"
          icon="rocket_launch"
          color="primary"
          descriptions={[
            "Spearheaded migration to Laravel 10 microservices architecture, improving uptime by 99.9%.",
            "Managed a cross-functional team of 8 developers for the core telemedicine platform.",
          ]}
          techStack={["Laravel", "Vue.js", "AWS"]}
        />
        <WorkCard
          company="Hitalent"
          role="Mobile Tech Lead"
          period="2020 — 2021"
          icon="code_off"
          color="cyan"
          descriptions={[
            "Built the flagship job-seeking Android app using Flutter with over 50k+ downloads.",
            "Implemented real-time chat and video interview features using WebRTC.",
          ]}
          techStack={["Flutter", "Dart", "Firebase"]}
        />
        <div className="flex flex-col gap-6 md:row-span-2 h-full">
          <ProjectCard
            type="enterprise"
            title="Enterprise Systems"
            subtitle="Danamon & BSI Banking"
            icon="OS"
            color="red"
            period="2019-2020"
            description="Developed secure internal tools using OutSystems low-code platform for major banking institutions."
          />
          <ProjectCard
            type="freelance"
            title="Ticketing Bus"
            subtitle="Freelance Project"
            icon="directions_bus"
            color="yellow"
            techStack={["Vue.js", "Node"]}
          />
        </div>
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
