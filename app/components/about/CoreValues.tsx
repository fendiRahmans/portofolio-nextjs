import React from "react";

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface CoreValuesProps {
  values: CoreValue[];
}

export default function CoreValues({ values }: CoreValuesProps) {
  if (!values || values.length === 0) return null;

  return (
    <div className="mt-20">
      <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">auto_awesome</span>
        Core Values
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {values.map((value, index) => (
          <div key={index} className="glass-card p-6 rounded-xl">
            <span className="material-symbols-outlined text-primary mb-4">
              {value.icon}
            </span>
            <h4 className="font-display font-semibold text-lg mb-2">
              {value.title}
            </h4>
            <p className="text-sm text-slate-400">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
