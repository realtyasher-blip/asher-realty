import ConsultationSection from "@/components/home/ConsultationSection";
import FAQ from "@/components/home/FAQ";
import FeaturedDevelopers from "@/components/home/FeaturedDevelopers";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import HowItWorks from "@/components/home/HowItWorks";
import ProjectComparison from "@/components/home/ProjectComparison";
import SmartMatch from "@/components/home/SmartMatch";
import MarketIntelligence from "@/components/home/MarketIntelligence";
import PropertyDiscovery from "@/components/home/PropertyDiscovery";
import WhyAsher from "@/components/home/WhyAsher";
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
        <SmartMatch />
        <FeaturedProjects />
        <ProjectComparison />
        <MarketIntelligence />
        <PropertyDiscovery />
        <HowItWorks />
        <WhyAsher />
        <FeaturedDevelopers />
        <FAQ />
        <ConsultationSection />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
