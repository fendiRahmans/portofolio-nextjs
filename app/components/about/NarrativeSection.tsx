import React from "react";

export default function NarrativeSection() {
  return (
    <div className="max-w-2xl mt-20 md:mt-0">
      {/* Breadcrumb/Header */}
      <div className="flex items-center gap-2 text-primary text-sm font-display font-medium uppercase tracking-[0.2em] mb-4">
        <span className="w-8 h-px bg-primary"></span>
        About Me
      </div>
      <h2 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-8">
        An{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
          AI-adaptive learner
        </span>{" "}
        building the future of the web.
      </h2>
      <div className="space-y-6 text-lg text-slate-400 leading-relaxed font-light">
        <p>
          With over <span className="text-white font-medium">5 years of experience</span>, I specialize in crafting
          high-end digital experiences that sit at the intersection of design and engineering. My journey began
          with a fascination for how pixels move, which evolved into a deep mastery of the full stack.
        </p>
        <p>
          I define myself as an <span className="text-white font-medium">AI-adaptive learner</span>. In an era
          where technology shifts weekly, I don&apos;t just use tools; I integrate AI into my workflow to accelerate
          development cycles and focus on what truly matters:{" "}
          <span className="italic">uncompromising user experience.</span>
        </p>
      </div>
    </div>
  );
}
