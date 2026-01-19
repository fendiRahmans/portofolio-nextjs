import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";

export default function ContactPage() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen relative selection:bg-primary/30">
      <Background />
      <Navbar />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 lg:py-40 flex flex-col md:flex-row gap-8 items-stretch min-h-[85vh]">
        {/* Left Section: Info */}
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

        {/* Right Section: Form */}
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
                className="w-full group relative overflow-hidden bg-white text-navy-deep font-display font-bold py-5 rounded-2xl transition-all hover:bg-opacity-90 active:scale-[0.99]"
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
      </main>

      <Dock />
      <div className="h-20"></div>
    </div>
  );
}
