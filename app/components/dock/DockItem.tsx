import React from "react";

interface DockItemProps {
  icon: string;
  label: string;
  href?: string;
  isActive?: boolean;
  variant?: "default" | "primary";
}

export default function DockItem({
  icon,
  label,
  href = "#",
  isActive = false,
  variant = "default",
}: DockItemProps) {
  const baseClasses =
    "group relative flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-200 hover:-translate-y-2 hover:scale-110";

  const variants = {
    default: "hover:bg-white/10",
    primary: "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
  };

  const iconColor =
    variant === "primary"
      ? "text-white"
      : isActive
        ? "text-white" // Active state color if needed, currently assumes home is active via dot
        : "text-white/70 group-hover:text-white";

  return (
    <a className={`${baseClasses} ${variants[variant]}`} href={href}>
      <span className={`material-symbols-outlined ${iconColor} text-[24px]`}>
        {icon}
      </span>
      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs py-1 px-2 rounded-md backdrop-blur-sm border border-white/10 text-center">
        {label}
      </span>
      {isActive && (
        <span className="absolute -bottom-1 w-1 h-1 bg-white/50 rounded-full"></span>
      )}
    </a>
  );
}
