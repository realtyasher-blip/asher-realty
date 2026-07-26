import type { Metadata } from "next";

import BuyerCalculators from "@/components/tools/BuyerCalculators";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Home Loan EMI & Buying Cost Calculator",
  description:
    "Estimate Bengaluru home-loan EMI, down payment, interest and initial purchase costs, then find projects matching your budget.",
};

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f4f5f7] pb-24 pt-32">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a16]">
              Buyer tools
            </p>
            <h1 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-7xl">
              Understand the cost before choosing the home.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-600">
              Use realistic assumptions to estimate monthly EMI and upfront
              cash. Then compare the result with active Bengaluru projects.
            </p>
          </div>
          <div className="mt-14">
            <BuyerCalculators />
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-6 text-slate-400">
            These results are indicative and are not a loan offer, financial
            advice or an exact statutory-cost statement. Confirm eligibility,
            rates and charges with your lender and legal advisor.
          </p>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
