import type { Metadata } from "next";
import { BadgeCheck, BrainCircuit, Database, ShieldCheck } from "lucide-react";

import HomeMatchStudio from "@/components/buyer/HomeMatchStudio";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "AI Home Match for Bengaluru Buyers",
  description:
    "Build a simple Bengaluru buyer brief and see explainable project matches based on work hub, home size, budget, timeline and priorities.",
};

export default function HomeMatchPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f4f5f7] pb-24 pt-24">
        <section className="relative overflow-hidden bg-[#041421] pb-24 pt-16 text-white sm:pb-28 sm:pt-20">
          <div className="premium-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-24 -top-32 size-[34rem] rounded-full bg-[#c9a227]/12 blur-[115px]" />
          <div className="container-shell relative grid gap-10 xl:grid-cols-[1fr_.72fr] xl:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                <BrainCircuit className="size-4" /> Asher Home Match
              </span>
              <h1 className="mt-7 max-w-4xl text-5xl font-medium leading-[.94] tracking-[-.04em] sm:text-7xl lg:text-[5.5rem]">
                Your life first.
                <span className="mt-2 block bg-gradient-to-r from-[#fff3c4] via-[#e4c462] to-[#b98e17] bg-clip-text text-transparent">Then the property.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
                Answer three short questions. We&apos;ll rank relevant Bengaluru projects, explain the fit and keep uncertainty visible.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Database, value: projects.length, label: "Projects read" },
                { icon: BadgeCheck, value: "No paid", label: "Top position" },
                { icon: ShieldCheck, value: "Visible", label: "Trade-offs" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
                  <Icon className="size-4 text-[#e4c462]" />
                  <p className="mt-4 text-lg font-bold">{value}</p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.1em] text-white/32">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell relative z-10 -mt-10">
          <HomeMatchStudio />
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
