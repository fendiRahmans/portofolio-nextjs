import React from "react";

interface NarrativeSectionProps {
  title: string;
  content: string;
}

export default function NarrativeSection({ title, content }: NarrativeSectionProps) {
  return (
    <div className="max-w-2xl mt-20 md:mt-0">
      {/* Breadcrumb/Header */}
      <div className="flex items-center gap-2 text-primary text-sm font-display font-medium uppercase tracking-[0.2em] mb-4">
        <span className="w-8 h-px bg-primary"></span>
        About Me
      </div>
      <h2 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-8">
        {title}
      </h2>
      <div
        className="space-y-6 text-lg text-slate-400 leading-relaxed font-light"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
