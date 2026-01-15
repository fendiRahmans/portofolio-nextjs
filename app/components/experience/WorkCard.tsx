import React from "react";

interface WorkCardProps {
  company: string;
  role: string;
  period: string;
  descriptions: string[];
  techStack: string[];
  icon: string;
  color: "primary" | "cyan";
}

export default function WorkCard({
  company,
  role,
  period,
  descriptions,
  techStack,
  icon,
  color,
}: WorkCardProps) {
  const theme = {
    primary: {
      blobConfig: "bg-primary/20 -right-20 -top-20 group-hover:bg-primary/30",
      iconBg: "bg-white/5 border-white/10",
      iconColor: "text-primary",
      period: "bg-primary/20 border-primary/20 text-primary-200",
      titleHover: "group-hover:text-primary-100",
      checkIcon: "text-primary",
      borderHover: "hover:border-primary/30",
    },
    cyan: {
      blobConfig: "bg-cyan-500/10 -left-20 -bottom-20 group-hover:bg-cyan-500/20",
      iconBg: "bg-white/5 border-white/10",
      iconColor: "text-cyan-400",
      period: "bg-white/5 border-white/10 text-white/60",
      titleHover: "group-hover:text-cyan-100",
      checkIcon: "text-cyan-500",
      borderHover: "hover:border-cyan-500/30",
    },
  };

  const styles = theme[color];

  return (
    <div
      className={`glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between md:row-span-2 backdrop-blur-xl transition-all duration-500 ${styles.borderHover}`}
    >
      <div
        className={`absolute w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-all duration-500 ${styles.blobConfig}`}
      ></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border shadow-inner ${styles.iconBg}`}
          >
            <span
              className={`material-symbols-outlined text-4xl ${styles.iconColor}`}
            >
              {icon}
            </span>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md ${styles.period}`}
          >
            {period}
          </span>
        </div>
        <h3
          className={`text-3xl font-bold text-white mb-2 transition-colors ${styles.titleHover}`}
        >
          {company}
        </h3>
        <p className="text-lg text-white/60 font-light mb-6">{role}</p>
        <div className="space-y-4">
          {descriptions.map((desc, index) => (
            <div key={index} className="flex items-start gap-3">
              <span
                className={`material-symbols-outlined text-sm mt-1 ${styles.checkIcon}`}
              >
                check_circle
              </span>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-6">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-white/60"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
