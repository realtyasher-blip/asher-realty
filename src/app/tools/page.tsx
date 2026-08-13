import type { Metadata } from "next";

import BuyerCalculators from "@/components/tools/BuyerCalculators";
import PublicPropertyCalculators from "@/components/tools/PublicPropertyCalculators";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Bengaluru Property Calculators | Buy, Rent, Own & Sell",
  description:
    "Plan Bengaluru property costs with home-loan EMI, buying cash, rental move-in cost, rental yield and seller net-before-tax estimates.",
};

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f4f5f7] pb-24 pt-32">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a16]">
              Bengaluru property tools
            </p>
            <h1 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-7xl">
              Plan before you buy, rent, own or sell.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-600">
              Explore the numbers behind a property decision, from monthly EMI
              and upfront buying cash to rental move-in cost, rental yield and
              the amount a seller may retain before tax.
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
          <PublicPropertyCalculators />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
