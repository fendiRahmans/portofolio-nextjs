import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen relative selection:bg-primary/30">
      <Background />
      <Navbar />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 lg:py-40 flex flex-col md:flex-row gap-8 items-stretch min-h-[85vh]">
        <ContactInfo />
        <ContactForm />
      </main>

      <Dock />
      <div className="h-20"></div>
    </div>
  );
}
