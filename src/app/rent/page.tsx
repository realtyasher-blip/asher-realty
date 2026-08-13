import type { Metadata } from "next";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PublicMarketLanding from "@/components/marketplace/PublicMarketLanding";

export const metadata: Metadata = {
  title: "Rent a Home in Bengaluru | Assisted Rental Search",
  description: "Share your Bengaluru rental requirement and get help comparing rent, deposit, maintenance, availability, commute and suitable homes.",
};

export default function RentPage() {
  return <><Navbar /><main className="pt-20"><PublicMarketLanding mode="rent" /></main><Footer /><FloatingWhatsApp /></>;
}
