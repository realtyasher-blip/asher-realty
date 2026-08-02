import AdvisorConcierge from "@/components/home/AdvisorConcierge";
import BuyerAdvantagePreview from "@/components/home/BuyerAdvantagePreview";
import CuriosityStudio from "@/components/home/CuriosityStudio";
import Hero from "@/components/home/Hero";
import MarketPulse from "@/components/home/MarketPulse";
import ProjectSpotlight from "@/components/home/ProjectSpotlight";
import TrustStrip from "@/components/home/TrustStrip";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <Navbar />

      <main>
        <Hero />
        <TrustStrip />
        <CuriosityStudio />
        <ProjectSpotlight />
        <MarketPulse />
        <BuyerAdvantagePreview />
        <AdvisorConcierge />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
