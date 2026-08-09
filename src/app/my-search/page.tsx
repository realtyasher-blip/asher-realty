import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

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
          <Link
            href="/true-cost"
            className="mt-8 flex max-w-4xl items-center justify-between gap-5 rounded-[1.5rem] border border-[#c9a227]/30 bg-[#fffaf0] p-5 transition hover:-translate-y-0.5 hover:border-[#c9a227] hover:shadow-[0_15px_45px_rgba(201,162,39,.12)] sm:p-6"
          >
            <span className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
                <Calculator className="size-5" />
              </span>
              <span>
                <strong className="block text-base text-[#071a2f]">
                  Have a builder quote? Open TrueCost Room
                </strong>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Decode the likely all-in commitment and compare real quotes.
                </span>
              </span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-[#b08a16]" />
          </Link>
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
