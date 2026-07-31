import type { Metadata } from "next";
import { BrainCircuit, Database, ShieldCheck, Sparkles } from "lucide-react";

import DecisionLab from "@/components/decision/DecisionLab";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Bengaluru Buyer Decision Lab",
  description:
    "Build a personalised Bengaluru property decision profile and compare explainable project fit, visible costs, data confidence and buyer trade-offs.",
};

export default function DecisionLabPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f4f5f7] pb-24 pt-24">
        <section className="relative overflow-hidden bg-[#041421] py-16 text-white sm:py-20">
          <div className="premium-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-32 -top-36 size-[34rem] rounded-full bg-[#c9a227]/12 blur-[120px]" />
          <div className="container-shell relative grid gap-10 xl:grid-cols-[1fr_.7fr] xl:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#e4c462]">
                <BrainCircuit className="size-4" />
                Asher Buyer Decision OS
              </span>
              <h1 className="mt-7 max-w-5xl text-6xl font-medium leading-[.92] tracking-[-.04em] sm:text-7xl lg:text-[5.8rem]">
                Stop browsing.
                <span className="mt-2 block bg-gradient-to-r from-[#fff3c4] via-[#e4c462] to-[#b98e17] bg-clip-text text-transparent">
                  Start deciding.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
                One intelligent workspace that converts your budget, daily life and risk comfort into ranked Bengaluru projects—with every reason and uncertainty shown.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Sparkles, value: "Personal", label: "Fit model" },
                { icon: Database, value: projects.length, label: "Projects read" },
                { icon: ShieldCheck, value: "Visible", label: "Confidence" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
                  <Icon className="size-4 text-[#e4c462]" />
                  <p className="mt-4 text-lg font-bold">{value}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-white/32">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell relative z-10 -mt-5 pt-0">
          <DecisionLab />
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
