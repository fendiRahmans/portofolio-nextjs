import React, { forwardRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: string;
  containerClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ icon, containerClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={`relative group ${containerClassName}`}>
        <textarea
          ref={ref}
          className={`peer input-glass w-full rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${icon ? "pl-14" : "px-5"
            } pr-5 py-4 min-h-[150px] resize-none ${className}`}
          placeholder={props.placeholder || " "}
          {...props}
        />
        {icon && (
          <span className="absolute left-4.5 top-5 material-symbols-outlined text-white/40 group-focus-within:text-primary peer-[:not(:placeholder-shown)]:text-primary text-[22px] pointer-events-none z-20 transition-all duration-300">
            {icon}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
