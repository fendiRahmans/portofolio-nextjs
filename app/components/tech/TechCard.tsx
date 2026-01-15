import React, { ReactNode } from "react";

interface TechCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

export default function TechCard({
  title,
  description,
  icon,
  className = "",
}: TechCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 flex flex-col gap-4 group cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between">
        {icon}
        <span className="material-symbols-outlined text-white/20 group-hover:text-white/60 transition-colors text-[20px]">
          arrow_outward
        </span>
      </div>
      <div>
        <h4 className="text-white font-semibold text-lg">{title}</h4>
        <p className="text-white/40 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}
