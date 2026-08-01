import ConsultationSection from "@/components/home/ConsultationSection";
import FAQ from "@/components/home/FAQ";
import FeaturedDevelopers from "@/components/home/FeaturedDevelopers";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import HowItWorks from "@/components/home/HowItWorks";
import SmartMatch from "@/components/home/SmartMatch";
import KnowledgeHub from "@/components/home/KnowledgeHub";
import WhyAsher from "@/components/home/WhyAsher";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import DecisionIntelligence from "@/components/home/DecisionIntelligence";
import BuyerQuickStart from "@/components/home/BuyerQuickStart";

export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <Navbar />

      <main>
        <Hero />
        <TrustStrip />
        <BuyerQuickStart />
        <FeaturedProjects />
        <FeaturedDevelopers />
        <SmartMatch />
        <DecisionIntelligence />
        <KnowledgeHub />
        <HowItWorks />
        <WhyAsher />
        <FAQ />
        <ConsultationSection />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
