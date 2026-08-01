import BengaluruAreas from "@/components/home/BengaluruAreas";
import ConsultationSection from "@/components/home/ConsultationSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
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
        <FeaturedProjects />
        <BengaluruAreas />
        <WhyAsher />
        <ConsultationSection />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
