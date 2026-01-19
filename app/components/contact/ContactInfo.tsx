import React from "react";

export default function ContactInfo() {
  return (
    <section className="w-full md:w-5/12">
      <div className="glass-heavy p-8 lg:p-14 rounded-3xl h-full flex flex-col relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-auto">
            <p className="font-display text-primary tracking-[0.3em] uppercase text-xs mb-6 font-bold">
              Contact
            </p>
            <h2 className="font-display text-4xl lg:text-6xl font-bold leading-[1.1] mb-8">
              Let’s Build <br />the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Future Together
              </span>
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md mb-12">
              I'm currently specialized in building high-performance web applications. Let's discuss your next project or potential collaboration.
            </p>
          </div>

          <div className="space-y-4">
            <a
              className="glass-card p-5 rounded-2xl flex items-center gap-5"
              href="mailto:hello@alexsterling.dev"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">
                  mail
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-display font-bold">
                  Direct Email
                </p>
                <p className="text-slate-200 font-medium">
                  hello@alexsterling.dev
                </p>
              </div>
            </a>
            <a
              className="glass-card p-5 rounded-2xl flex items-center gap-5"
              href="#"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-2xl">
                  link
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-display font-bold">
                  LinkedIn
                </p>
                <p className="text-slate-200 font-medium">
                  linkedin.com/in/alexsterling
                </p>
              </div>
            </a>
            <a
              className="glass-card p-5 rounded-2xl flex items-center gap-5"
              href="#"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-300 text-2xl">
                  code
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-display font-bold">
                  GitHub
                </p>
                <p className="text-slate-200 font-medium">
                  github.com/alexsterling
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
