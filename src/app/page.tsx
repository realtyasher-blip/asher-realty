import BengaluruAreas from "@/components/home/BengaluruAreas";
import BuyerCommandCentre from "@/components/home/BuyerCommandCentre";
import ConsultationSection from "@/components/home/ConsultationSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Hero from "@/components/home/Hero";
import MarketPulse from "@/components/home/MarketPulse";
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
        <BuyerCommandCentre />
        <FeaturedProjects />
        <MarketPulse />
        <BengaluruAreas />
        <ConsultationSection />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
