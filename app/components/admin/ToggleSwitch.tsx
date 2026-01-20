"use client";

import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${checked
            ? "bg-green-500/30 border-green-500/50"
            : "bg-white/10 border-white/20"
          } border`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full transition-all duration-300 ${checked
              ? "translate-x-6 bg-green-400 shadow-lg shadow-green-500/50"
              : "translate-x-1 bg-white/60"
            }`}
        />
      </button>
      {label && (
        <span className={`text-sm font-medium ${checked ? "text-green-400" : "text-white/50"}`}>
          {label}
        </span>
      )}
    </div>
  );
}
