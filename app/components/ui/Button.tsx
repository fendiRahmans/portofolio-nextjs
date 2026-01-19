import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glass";
  isLoading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  isLoading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:shadow-primary/25",
    glass: "glass-btn-subtle text-white/70 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-xl">
            progress_activity
          </span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {children}
          {icon && (
            <span className="material-symbols-outlined text-xl">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
};
