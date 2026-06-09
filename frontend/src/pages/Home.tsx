import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import TrustedBy from "../components/landing/TrustedBy";
import Features from "../components/landing/Features";
import Pipeline from "../components/landing/Pipeline";
import LivePreview from "../components/preview/LivePreview";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-white antialiased selection:bg-brand-purple/30">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <Pipeline />
        <LivePreview />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
