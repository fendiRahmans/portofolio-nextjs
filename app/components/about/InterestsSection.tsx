import React from "react";

interface InterestsSectionProps {
  interests: string[];
}

export default function InterestsSection({ interests }: InterestsSectionProps) {
  if (!interests || interests.length === 0) return null;

  return (
    <div className="mt-20">
      <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">interests</span>
        Obsessions
      </h3>
      <div className="flex flex-wrap gap-3">
        {interests.map((item, index) => (
          <div
            key={index}
            className="glass-card px-4 py-2 rounded-full flex items-center gap-2"
          >
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
