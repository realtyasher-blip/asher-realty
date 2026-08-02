import type { Metadata } from "next";

import BuyerDecisionToolkit from "@/components/buyer/BuyerDecisionToolkit";
import MyHomeSearch from "@/components/buyer/MyHomeSearch";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "My Buyer Passport",
  description:
    "Keep your Bengaluru property preferences, saved homes, comparisons, visit planning and booking checks together in one buyer workspace.",
};

export default function MySearchPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f4f5f7] pb-24 pt-32">
        <div className="container-shell">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a16]">
              Asher Buyer Passport
            </p>
            <h1 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-7xl">
              Your property decisions, together in one place.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Keep your preferences, saved homes, comparisons, visit plan and
              verification checklist together on this device—without creating
              an account.
            </p>
          </div>
          <div className="mt-12">
            <MyHomeSearch />
          </div>
          <div className="mt-10">
            <BuyerDecisionToolkit />
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
