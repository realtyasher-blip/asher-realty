import type { Metadata } from "next";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PublicMarketLanding from "@/components/marketplace/PublicMarketLanding";

export const metadata: Metadata = {
  title: "Resale Homes in Bengaluru | Buyer and Owner Assistance",
  description: "Get help finding or selling a Bengaluru resale property with clear property facts, cost context, document-review coordination and managed visits.",
};

export default function ResalePage() {
  return <><Navbar /><main className="pt-20"><PublicMarketLanding mode="resale" /></main><Footer /><FloatingWhatsApp /></>;
}
