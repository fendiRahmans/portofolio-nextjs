import Link from "next/link";
import Background from "../components/Background";
import Dock from "../components/Dock";
import ProfileSection from "../components/about/ProfileSection";
import NarrativeSection from "../components/about/NarrativeSection";
import CoreValues from "../components/about/CoreValues";
import InterestsSection from "../components/about/InterestsSection";
import { getAbout } from "@/actions/about";

export default async function About() {
  const { data } = await getAbout();

  const profile = {
    name: data?.name || "Name",
    title: data?.title || "Title",
    location: data?.location || "Location",
    imageUrl: data?.imageUrl || "",
  };

  const narrative = {
    title: data?.narrativeTitle || "About Me",
    content: data?.narrativeContent || "Content coming soon...",
  };

  const coreValues = data?.coreValues || [];
  const interests = data?.interests || [];

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
        <ProfileSection
          name={profile.name}
          title={profile.title}
          location={profile.location}
          imageUrl={profile.imageUrl}
        />

        {/* Right Side: Narrative (Scrollable) */}
        <section className="w-full md:w-[60%] h-screen overflow-y-auto no-scrollbar p-8 lg:p-16 xl:p-24 pb-32">
          <NarrativeSection
            title={narrative.title}
            content={narrative.content}
          />
          <CoreValues values={coreValues} />
          <InterestsSection interests={interests} />

          {/* Footer Spacer for Dock */}
          <div className="h-32"></div>
        </section>
      </main>
      <Dock />
    </div>
  );
}
