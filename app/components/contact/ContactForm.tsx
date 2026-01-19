import React from "react";

export default function ContactForm() {
  return (
    <section className="w-full md:w-7/12">
      <div className="glass-form p-8 lg:p-14 rounded-3xl h-full flex flex-col justify-center">
        <form action="#" className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label
                className="block text-xs font-display font-bold uppercase tracking-widest text-slate-400 ml-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-6 py-4 rounded-2xl input-glass text-white placeholder:text-slate-600 font-body"
                id="name"
                name="name"
                placeholder="Enter your name"
                type="text"
              />
            </div>
            <div className="space-y-3">
              <label
                className="block text-xs font-display font-bold uppercase tracking-widest text-slate-400 ml-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-6 py-4 rounded-2xl input-glass text-white placeholder:text-slate-600 font-body"
                id="email"
                name="email"
                placeholder="email@example.com"
                type="email"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label
              className="block text-xs font-display font-bold uppercase tracking-widest text-slate-400 ml-1"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              className="w-full px-6 py-4 rounded-2xl input-glass text-white placeholder:text-slate-600 font-body resize-none"
              id="message"
              name="message"
              placeholder="Describe your project vision..."
              rows={8}
            ></textarea>
          </div>
          <button
            className="w-full group relative overflow-hidden bg-white text-slate-950 font-display font-bold py-5 rounded-2xl transition-all hover:bg-opacity-90 active:scale-[0.99]"
            type="submit"
          >
            <span className="relative flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Send Message
              <span className="material-symbols-outlined text-xl">
                arrow_forward
              </span>
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
