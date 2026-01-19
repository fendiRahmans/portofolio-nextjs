import React from "react";

export default function CoreValues() {
  const values = [
    {
      icon: "diamond",
      title: "Code Quality",
      description: "Clean, maintainable, and scalable architecture isn't a luxury—it's the foundation.",
    },
    {
      icon: "ads_click",
      title: "User Centricity",
      description: "I build products that people love to use, prioritizing accessibility and performance.",
    },
    {
      icon: "bolt",
      title: "Extreme Agility",
      description: "Rapid prototyping and iterative delivery to stay ahead in competitive markets.",
    },
    {
      icon: "neurology",
      title: "AI Mastery",
      description: "Leveraging LLMs and neural networks to enhance software capabilities.",
    },
  ];

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
