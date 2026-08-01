import type { Metadata } from "next";

import BuyerDashboard from "@/components/buyer/BuyerDashboard";
import BuyerDecisionToolkit from "@/components/buyer/BuyerDecisionToolkit";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "My Property Search",
  description:
    "Continue your Bengaluru property search with saved homes, recently viewed projects, personalised matches and clear next steps.",
};

export default function MySearchPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f4f5f7] pb-24 pt-32">
        <div className="container-shell">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a16]">
              Your buyer decision centre
            </p>
            <h1 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-7xl">
              Your property search, all in one place.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Pick up where you left off, refine your preferences and move from
              browsing to a confident shortlist without creating an account.
            </p>
          </div>
          <div className="mt-12">
            <BuyerDashboard />
            <BuyerDecisionToolkit />
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
