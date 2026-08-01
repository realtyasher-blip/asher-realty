import type { Metadata } from "next";

import MyHomeSearch from "@/components/buyer/MyHomeSearch";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "My Home Search",
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
              My home search
            </p>
            <h1 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-7xl">
              One clear step at a time.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Set three preferences, save promising homes, compare your best
              two and plan visits—without creating an account.
            </p>
          </div>
          <div className="mt-12">
            <MyHomeSearch />
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
