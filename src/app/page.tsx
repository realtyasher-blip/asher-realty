import AdvisorConcierge from "@/components/home/AdvisorConcierge";
import BuyerAdvantagePreview from "@/components/home/BuyerAdvantagePreview";
import CuriosityStudio from "@/components/home/CuriosityStudio";
import Hero from "@/components/home/Hero";
import MarketPulse from "@/components/home/MarketPulse";
import PublicJourney from "@/components/home/PublicJourney";
import PublicUtilityHub from "@/components/home/PublicUtilityHub";
import ProjectSpotlight from "@/components/home/ProjectSpotlight";
import TrustStrip from "@/components/home/TrustStrip";
import TrueCostPreview from "@/components/home/TrueCostPreview";
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
        <PublicJourney />
        <PublicUtilityHub />
        <TrustStrip />
        <CuriosityStudio />
        <ProjectSpotlight />
        <MarketPulse />
        <BuyerAdvantagePreview />
        <TrueCostPreview />
        <AdvisorConcierge />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
