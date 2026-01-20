import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  icon?: string;
}

export const Label = ({
  children,
  icon,
  className = "",
  ...props
}: LabelProps) => {
  return (
    <label
      className={`flex items-center gap-2 text-sm font-medium text-white/70 mb-2 ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[16px] text-white/50">
          {icon}
        </span>
      )}
      {children}
    </label>
  );
};
