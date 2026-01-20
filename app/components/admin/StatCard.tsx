import React from "react";

interface StatCardProps {
  icon: string;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({
  icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/20",
  title,
  value,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5">
      <div className="flex items-start justify-between">
        <div className={`size-12 rounded-xl ${iconBgColor} flex items-center justify-center border border-white/10`}>
          <span className={`material-symbols-outlined text-[24px] ${iconColor}`}>
            {icon}
          </span>
        </div>

        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"
            }`}>
            <span className="material-symbols-outlined text-[16px]">
              {trend.isPositive ? "trending_up" : "trending_down"}
            </span>
            {trend.value}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-white/50 text-sm">{title}</p>
        <div className="text-3xl font-bold text-white mt-1">{value}</div>
        {subtitle && (
          <p className="text-white/40 text-xs mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
