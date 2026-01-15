import React from "react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: "red" | "yellow";
  techStack?: string[];
  description?: string;
  period?: string;
  type: "enterprise" | "freelance";
}

export default function ProjectCard({
  title,
  subtitle,
  icon,
  color,
  techStack,
  description,
  period,
  type,
}: ProjectCardProps) {
  const styles = {
    red: {
      blob: "bg-red-500/10 right-0 top-0 group-hover:bg-red-500/20 blur-[60px] w-32 h-32",
      iconBg: "bg-red-500/20 border-red-500/30",
      iconColor: "text-red-500",
      borderHover: "hover:border-red-500/30",
    },
    yellow: {
      blob: "bg-yellow-500/10 left-0 bottom-0 group-hover:bg-yellow-500/20 blur-[50px] w-24 h-24",
      iconBg: "bg-yellow-500/20 border-yellow-500/30",
      iconColor: "text-yellow-500",
      borderHover: "hover:border-yellow-500/30",
    },
  }[color];

  // Enterprise Layout
  if (type === "enterprise") {
    return (
      <div
        className={`glass-card rounded-3xl p-6 relative overflow-hidden group flex-1 flex flex-col justify-center backdrop-blur-xl transition-all duration-500 ${styles.borderHover}`}
      >
        <div
          className={`absolute rounded-full pointer-events-none ${styles.blob}`}
        ></div>
        <div className="relative z-10 mb-4 flex justify-between items-center">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${styles.iconBg}`}
          >
            <span className={`font-bold ${styles.iconColor}`}>{icon}</span>
          </div>
          <span className="text-xs text-white/40 font-mono">{period}</span>
        </div>
        <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
        <p className="text-white/50 text-sm mb-4">{subtitle}</p>
        <p className="text-white/40 text-sm leading-relaxed">{description}</p>
      </div>
    );
  }

  // Freelance Layout
  return (
    <div
      className={`glass-card rounded-3xl p-6 relative overflow-hidden group h-[180px] flex flex-col justify-center backdrop-blur-xl transition-all duration-500 ${styles.borderHover}`}
    >
      <div
        className={`absolute rounded-full pointer-events-none ${styles.blob}`}
      ></div>
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${styles.iconBg}`}
        >
          <span className={`material-symbols-outlined text-sm ${styles.iconColor}`}>
            {icon}
          </span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <p className="text-xs text-white/40">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {techStack?.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
