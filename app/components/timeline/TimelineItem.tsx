import React from "react";

export interface TimelineItemProps {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: "primary" | "cyan" | "purple" | "amber" | "emerald" | "rose" | "indigo";
  keyProjects?: string[]; // Simple list for "Key Projects"
  projectList?: { name: string; type?: string }[]; // For things like "Izidok: ...", "Hitalent: ..."
  techStack?: string[];
  bulletPoints?: string[]; // For bullet lists like in 2022/2021
}

export default function TimelineItem({
  year,
  title,
  subtitle,
  description,
  icon,
  color,
  keyProjects,
  projectList,
  techStack,
  bulletPoints,
}: TimelineItemProps) {
  const theme = {
    primary: {
      dot: "bg-primary shadow-[0_0_20px_rgba(25,93,230,0.8)] border-primary",
      pill: "bg-primary/20 border-primary/20 text-primary-100 shadow-[0_0_10px_rgba(25,93,230,0.2)]",
      iconBg: "bg-primary/10 border-primary/20",
      iconColor: "text-primary",
      hoverBorder: "hover:border-primary/40",
      marker: "bg-primary", // For bullets/dots
      markerText: "text-primary-200", // Not always used but good to have
    },
    cyan: {
      dot: "bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] border-cyan-500",
      pill: "bg-cyan-500/10 border-cyan-500/20 text-cyan-200",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      iconColor: "text-cyan-400",
      hoverBorder: "hover:border-cyan-500/40",
      marker: "bg-cyan-500",
    },
    purple: {
      dot: "bg-white/20 group-hover:bg-purple-500 shadow-none group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] border-white/20 group-hover:border-purple-500",
      pill: "bg-purple-500/10 border-purple-500/20 text-purple-200",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-400",
      hoverBorder: "hover:border-purple-500/40",
      marker: "bg-purple-500", // Not strictly used in temp.html design for purple but safe fallback
    },
    amber: {
      dot: "bg-white/20 group-hover:bg-amber-500 shadow-none group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] border-white/20 group-hover:border-amber-500",
      pill: "bg-amber-500/10 border-amber-500/20 text-amber-200",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      iconColor: "text-amber-400",
      hoverBorder: "hover:border-amber-500/40",
      marker: "text-amber-500", // For list marker
    },
    emerald: {
      dot: "bg-white/20 group-hover:bg-emerald-500 shadow-none group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] border-white/20 group-hover:border-emerald-500",
      pill: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
      hoverBorder: "hover:border-emerald-500/40",
      marker: "bg-emerald-500",
    },
    rose: {
      dot: "bg-white/20 group-hover:bg-rose-500 shadow-none group-hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] border-white/20 group-hover:border-rose-500",
      pill: "bg-rose-500/10 border-rose-500/20 text-rose-200",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      iconColor: "text-rose-400",
      hoverBorder: "hover:border-rose-500/40",
      marker: "bg-rose-500",
    },
    indigo: {
      dot: "bg-white/20 group-hover:bg-indigo-500 shadow-none group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] border-white/20 group-hover:border-indigo-500",
      pill: "bg-indigo-500/10 border-indigo-500/20 text-indigo-200",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
      iconColor: "text-indigo-400",
      hoverBorder: "hover:border-indigo-500/40",
      marker: "bg-indigo-500",
    },
  }[color];

  const dotInnerClass =
    color === "primary" || color === "cyan"
      ? `w-2 h-2 rounded-full ${theme.marker} animate-pulse`
      : `w-2 h-2 rounded-full bg-white/20 group-hover:${theme.marker} transition-colors`;

  // Special handling for the dot since some have hover effects and some are static active
  const dotContainerClass =
    color === "primary" || color === "cyan"
      ? `absolute -left-[44px] md:-left-[60px] top-0 w-6 h-6 rounded-full bg-background-dark border-2 z-10 flex items-center justify-center ${theme.dot}`
      : `absolute -left-[44px] md:-left-[60px] top-0 w-6 h-6 rounded-full bg-background-dark border-2 z-10 flex items-center justify-center transition-all duration-300 ${theme.dot}`;

  return (
    <div className="relative group">
      <div className={dotContainerClass}>
        <div className={dotInnerClass}></div>
      </div>
      <div
        className={`glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 ${theme.hoverBorder}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${theme.pill}`}
            >
              {year}
            </span>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-white/60 text-sm md:text-base">{subtitle}</p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${theme.iconBg}`}
          >
            <span className={`material-symbols-outlined ${theme.iconColor}`}>
              {icon}
            </span>
          </div>
        </div>
        <p className="text-white/70 mb-4 leading-relaxed font-light">
          {description}
        </p>

        {/* Project List (e.g., Izidok/Hitalent specific items) */}
        {projectList && (
          <div className="mb-4 bg-white/5 rounded-lg p-4 border border-white/5 space-y-2">
            {projectList.map((project, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${project.name.includes("Izidok")
                    ? "bg-primary"
                    : "bg-cyan-400"
                    }`}
                ></div>
                <span className="text-sm text-white/80">
                  <strong className="text-white">{project.name}</strong>{" "}
                  {project.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Grid List (e.g., Frontend Ecosystem) */}
        {/* We can use keyProjects for this or a separate prop. Let's assume generic keyProjects if simple strings. 
            If it's the 2024 grid, we can pass generic strings in keyProjects. */}
        {keyProjects && (
          color === "purple" ? (
            // Special layout for 2023 Enterprise Systems (Key Projects label + pills)
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-white/30 w-full mb-1">Key Projects</span>
              {keyProjects.map((kp, idx) => (
                <span key={idx} className="bg-white/5 px-2 py-1 rounded border border-white/5 text-xs text-white/70">{kp}</span>
              ))}
            </div>
          ) : color === "cyan" ? (
            // Grid layout for 2024
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {keyProjects.map((kp, idx) => (
                <div key={idx} className="bg-white/5 px-3 py-2 rounded border border-white/5 text-xs text-white/80">{kp}</div>
              ))}
            </div>
          ) : color === "rose" ? (
            // Simple flex gap for 2020
            <div className="flex gap-4 mb-4">
              {keyProjects.map((kp, idx) => (
                <div key={idx} className="bg-white/5 px-3 py-1 rounded border border-white/5 text-xs text-white/80">{kp}</div>
              ))}
            </div>
          ) : color === "emerald" ? (
            // Text list for 2021
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70 mb-4">
              {keyProjects.map((kp, idx) => (
                <span key={idx}>• {kp}</span>
              ))}
            </div>
          ) : null
        )}

        {/* Bullet List (e.g., 2022) */}
        {bulletPoints && (
          <ul className={`list-disc list-inside text-sm text-white/70 mb-4 space-y-1 marker:${theme.marker}`}>
            {bulletPoints.map((bp, idx) => (
              <li key={idx}>{bp}</li>
            ))}
          </ul>
        )}

        {/* Tech Stack Pills */}
        {techStack && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
