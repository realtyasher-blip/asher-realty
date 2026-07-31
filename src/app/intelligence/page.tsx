import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import DecisionIntelligence from "@/components/home/DecisionIntelligence";
import MarketIntelligence from "@/components/home/MarketIntelligence";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { benchmarkPrinciples, dueDiligenceChecks } from "@/data/intelligence";

export const metadata: Metadata = {
  title: "Bengaluru Property Intelligence Centre",
  description:
    "Buyer-friendly Bengaluru property data, corridor decision signals, market research and a practical project due-diligence framework.",
};

export const revalidate = 86400;

export default function IntelligencePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-20">
        <section className="relative overflow-hidden bg-[#071a2f] py-20 text-white sm:py-28">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_82%_20%,#c9a227_0,transparent_28%),linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:auto,64px_64px,64px_64px]" />
          <div className="container-shell relative grid gap-12 xl:grid-cols-[1fr_.72fr] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                <Database className="size-4" />
                Bengaluru Property Intelligence
              </span>
              <h1 className="mt-7 max-w-4xl text-6xl font-medium leading-[.98] sm:text-7xl">
                See the market.
                <span className="mt-2 block text-[#e4c462]">Understand the decision.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">
                A transparent buyer intelligence centre combining current research, curated project coverage and the practical checks that brochures rarely explain.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="tel:+919019697170"
                  className="inline-flex h-13 items-center rounded-full bg-[#c9a227] px-7 text-sm font-bold text-[#071a2f]"
                >
                  Discuss the data
                  <ArrowRight className="ml-2 size-4" />
                </a>
                <a
                  href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20am%20reviewing%20your%20Bengaluru%20Property%20Intelligence%20Centre.%20Please%20help%20me%20apply%20the%20data%20to%20my%20property%20search."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center rounded-full border border-white/15 px-7 text-sm font-bold text-white"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Ask an advisor
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                Data integrity promise
              </p>
              <div className="mt-6 space-y-5">
                {[
                  ["Source date shown", "Every market number is tied to a period and named source."],
                  ["No return promises", "Signals explain context; they do not predict appreciation."],
                  ["Live facts verified", "Price, tower, unit and possession require current confirmation."],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                    <div>
                      <p className="text-sm font-bold">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/45">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <DecisionIntelligence compact />

        <section className="bg-[#f5f6f8] py-24 sm:py-28">
          <div className="container-shell">
            <div className="grid gap-10 xl:grid-cols-[.72fr_1.28fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b08a16]">
                  The buyer verification stack
                </p>
                <h2 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
                  Eight checks before you reserve a home.
                </h2>
                <p className="mt-6 max-w-xl leading-8 text-slate-600">
                  Use this framework across every builder. Asher can prepare the questions and coordinate the answers before your decision.
                </p>

                <div className="mt-8 rounded-[1.5rem] bg-[#071a2f] p-6 text-white">
                  <FileCheck2 className="size-6 text-[#e4c462]" />
                  <p className="mt-4 text-xl font-medium">Get a buyer-ready verification brief</p>
                  <p className="mt-2 text-xs leading-6 text-white/48">
                    Share your shortlisted project and we will organise the exact price, unit, phase and site-visit questions to ask.
                  </p>
                  <a
                    href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20please%20prepare%20a%20buyer%20verification%20brief%20for%20my%20shortlisted%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex h-11 items-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f]"
                  >
                    Request my brief
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {dueDiligenceChecks.map((item, index) => (
                  <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-[#fff3c4] text-[#8b6a0f]">
                        <CheckCircle2 className="size-5" />
                      </span>
                      <span className="text-3xl font-light text-slate-200">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[#071a2f]">{item.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-slate-500">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-shell rounded-[2rem] border border-slate-200 p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b08a16]">
              Platform standard
            </p>
            <h2 className="mt-4 text-4xl font-medium text-[#071a2f]">What a modern buyer experience should deliver</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {benchmarkPrinciples.map((principle) => (
                <div key={principle} className="rounded-2xl bg-[#f7f8fa] p-5">
                  <CheckCircle2 className="size-5 text-[#b08a16]" />
                  <p className="mt-4 text-xs font-semibold leading-6 text-[#071a2f]">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MarketIntelligence />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
