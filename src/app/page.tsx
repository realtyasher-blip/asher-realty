import ConsultationSection from "@/components/home/ConsultationSection";
import FAQ from "@/components/home/FAQ";
import FeaturedDevelopers from "@/components/home/FeaturedDevelopers";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import HowItWorks from "@/components/home/HowItWorks";
import PropertyDiscovery from "@/components/home/PropertyDiscovery";
import WhyAsher from "@/components/home/WhyAsher";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <Navbar />

      <main>
        <Hero />
        <TrustStrip />
        <FeaturedProjects />
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
