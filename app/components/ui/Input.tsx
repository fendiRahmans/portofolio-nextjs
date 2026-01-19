import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, containerClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={`relative group ${containerClassName}`}>
        <input
          ref={ref}
          className={`peer input-glass w-full rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${icon ? "pl-14" : "px-5"
            } pr-5 py-4 ${className}`}
          placeholder={props.placeholder || " "}
          {...props}
        />
        {icon && (
          <span className="absolute left-4.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/40 group-focus-within:text-primary peer-[:not(:placeholder-shown)]:text-primary text-[22px] pointer-events-none z-20 transition-all duration-300">
            {icon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
