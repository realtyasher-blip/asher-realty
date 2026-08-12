import type { Metadata } from "next";

import ReraWatch from "@/components/intelligence/ReraWatch";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Bengaluru RERA Watch | Recently Approved Projects",
  description:
    "Review recently approved Bengaluru RERA projects with registration dates, phase evidence, carpet-area and UDS checks, buyer notes and official record actions.",
};

export default function ReraWatchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <ReraWatch />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
