import Link from "next/link";
import Background from "../components/Background";
import Dock from "../components/Dock";

export default function About() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen relative selection:bg-primary/30">
      <Background />

      {/* Navbar Placeholder/Back Link */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 pointer-events-none md:pointer-events-auto">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Logo could go here if needed, but keeping it clean for split layout */}
        </div>
        <div className="hidden md:flex items-center gap-4 pointer-events-auto">
          <Link
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors backdrop-blur-md bg-black/20 rounded-full border border-white/5"
            href="/"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative min-h-screen flex flex-col md:flex-row overflow-hidden z-20">
        {/* Left Side: Profile (Fixed on Desktop) */}
        <section className="w-full md:w-[40%] h-screen sticky top-0 flex flex-col items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Signature Branding */}
            <div className="mb-12">
              <h1 className="text-5xl text-primary mb-2 font-bold font-display">Alex Sterling</h1>
              <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent"></div>
            </div>
            {/* Profile Frame */}
            <div className="glass-panel p-3 rounded-xl relative group">
              <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-background-dark rounded-lg overflow-hidden aspect-[4/5] border border-white/10">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9WgTlBdSmiEh4MyIcn6mM2PQJTaI8nX6agLr9HRR39kCZ2QwPjllwPwtqA62QAMuImdyKwfwPYYcUjV1M05yasT4EUhGeyDfN3lyX0wwokz-pbfxgioTLYRHaKGrYSWJRriXMB8fxuStJTN9MHMeYMU8JpRuqaPXNIopoP_OYoqVg9Cpt3Sm1FStZf8Bz7ID6QM0JnOUv_9K1MpW-IskY7dDNLiy0JGz1Zc1Kn9fELnoUtiNUC9RVT-UIRjUj1Mej2iz47lAlcKSO")',
                  }}
                  title="Professional portrait of a male developer in a dark studio setting"
                ></div>
              </div>
            </div>
            <div className="mt-8 space-y-2">
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                Senior Fullstack Developer
              </p>
              <p className="text-slate-400 font-light flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">
                  location_on
                </span>
                Based in San Francisco, CA
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Narrative (Scrollable) */}
        <section className="w-full md:w-[60%] h-screen overflow-y-auto no-scrollbar p-8 lg:p-16 xl:p-24 pb-32">

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

            {/* Values Section */}
            <div className="mt-20">
              <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                Core Values
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-6 rounded-xl">
                  <span className="material-symbols-outlined text-primary mb-4">diamond</span>
                  <h4 className="font-display font-semibold text-lg mb-2">Code Quality</h4>
                  <p className="text-sm text-slate-400">
                    Clean, maintainable, and scalable architecture isn&apos;t a luxury—it&apos;s the foundation.
                  </p>
                </div>
                <div className="glass-card p-6 rounded-xl">
                  <span className="material-symbols-outlined text-primary mb-4">ads_click</span>
                  <h4 className="font-display font-semibold text-lg mb-2">User Centricity</h4>
                  <p className="text-sm text-slate-400">
                    I build products that people love to use, prioritizing accessibility and performance.
                  </p>
                </div>
                <div className="glass-card p-6 rounded-xl">
                  <span className="material-symbols-outlined text-primary mb-4">bolt</span>
                  <h4 className="font-display font-semibold text-lg mb-2">Extreme Agility</h4>
                  <p className="text-sm text-slate-400">
                    Rapid prototyping and iterative delivery to stay ahead in competitive markets.
                  </p>
                </div>
                <div className="glass-card p-6 rounded-xl">
                  <span className="material-symbols-outlined text-primary mb-4">neurology</span>
                  <h4 className="font-display font-semibold text-lg mb-2">AI Mastery</h4>
                  <p className="text-sm text-slate-400">
                    Leveraging LLMs and neural networks to enhance software capabilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="mt-20">
              <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">interests</span>
                Obsessions
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Generative AI",
                  "System Architecture",
                  "UI Motion Design",
                  "Edge Computing",
                  "Human-Computer Interaction",
                  "Analog Photography",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="glass-card px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Spacer for Dock */}
            <div className="h-32"></div>
          </div>
        </section>
      </main>
      <Dock />
    </div>
  );
}
