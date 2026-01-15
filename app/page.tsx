import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TechStack from "./components/TechStack";
import Experience from "./components/Experience";
import Dock from "./components/Dock";
import Background from "./components/Background";

export default function Home() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen relative selection:bg-primary/30">
      <Background />
      <Navbar />
      <main className="relative z-10 pt-32 pb-40 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <Hero />
        <TechStack />
        <Experience />
      </main>
      <Dock />
    </div>
  );
}
