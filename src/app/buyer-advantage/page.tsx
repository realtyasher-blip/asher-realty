import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleAlert,
  Eye,
  FileCheck2,
  Handshake,
  MessageCircle,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import BuyerAdvantageJourney from "@/components/advantage/BuyerAdvantageJourney";
import AdvisorAdvantage from "@/components/home/AdvisorAdvantage";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Asher Buyer Advantage & Buyer Passport",
  description:
    "Build one Bengaluru buyer brief, compare properties, request dated checks, plan visits and continue receiving buyer-side support after booking.",
};

const promises = [
  {
    icon: UserRoundCheck,
    title: "Permission-first contact",
    text: "No surprise calling chain. You choose when an advisor enters the journey and can ask us to stop at any time.",
  },
  {
    icon: Eye,
    title: "Visible unknowns",
    text: "If current inventory, price, phase or possession needs confirmation, the platform says so clearly.",
  },
  {
    icon: FileCheck2,
    title: "Dated information",
    text: "Project briefs show their review date so public information is never presented as permanently current.",
  },
  {
    icon: Handshake,
    title: "Commercial transparency",
    text: "Where Asher acts as a channel partner, that relationship should be disclosed without changing your freedom to compare.",
  },
  {
    icon: ShieldCheck,
    title: "No invented urgency",
    text: "Availability and offer deadlines need current source confirmation. Pressure is not treated as buyer guidance.",
  },
  {
    icon: BadgeCheck,
    title: "Specialists when required",
    text: "Legal, lending and inspection questions should go to qualified professionals, with scope and charges agreed separately.",
  },
];

const included = [
  "Explainable cross-builder Home Match",
  "Saved-home and comparison workspace on this device",
  "All-inclusive cost and payment-timing conversation",
  "Tower, phase, RERA and possession question pack",
  "Focused site-visit planning",
  "Booking and handover preparation guidance",
  "A reusable brief for future property decisions",
];

export default function BuyerAdvantagePage() {
  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    "Hi Asher Realty, I would like to understand the Asher Buyer Advantage and start my free Buyer Passport."
  )}`;

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#041421] pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
          <div className="premium-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-40 top-10 size-[34rem] rounded-full bg-[#c9a227]/10 blur-3xl" />
          <div className="container-shell relative">
            <div className="grid gap-12 xl:grid-cols-[1.05fr_.95fr] xl:items-end">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e4c462]">
                  <BadgeCheck className="size-4" /> Asher Buyer Advantage
                </p>
                <h1 className="mt-6 max-w-5xl text-6xl font-medium leading-[0.92] tracking-[-0.04em] sm:text-8xl">
                  One buyer brief.
                  <span className="mt-2 block text-[#e4c462]">
                    Every property decision.
                  </span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                  The Buyer Passport makes Asher more useful at every stage—from
                  the first shortlist to handover and the next property you buy.
                  You keep control; the advisor enters when a human check matters.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#build-plan"
                    className="shine-button inline-flex min-h-14 items-center justify-center rounded-full bg-[#c9a227] px-7 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                  >
                    Start my free Buyer Passport
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                  <Link
                    href="/my-search"
                    className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/18 px-7 text-sm font-bold text-white transition hover:border-[#e4c462] hover:text-[#e4c462]"
                  >
                    Open my current Passport
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl sm:p-9">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                  Included in the buyer journey
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {included.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/[0.05] p-4">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      <p className="text-xs font-semibold leading-6 text-white/72">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 flex items-start gap-2 text-[10px] leading-5 text-white/38">
                  <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-[#e4c462]" />
                  No guaranteed appreciation, lowest-price or legal-clearance
                  claims. Specialist services remain subject to separate scope.
                </p>
              </div>
            </div>
          </div>
        </section>

        <BuyerAdvantageJourney />

        <section className="bg-white py-20 sm:py-28">
          <div className="container-shell">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7411]">
                Asher Buyer Bill of Rights
              </p>
              <h2 className="mt-4 text-5xl font-medium leading-[0.98] text-[#071a2f] sm:text-7xl">
                Loyalty must be earned with clarity.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                These are the service standards the platform is designed around.
                They protect your freedom to compare and make informed decisions.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {promises.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-[1.6rem] border border-slate-200 bg-[#f8f8f6] p-6"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold text-[#071a2f]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <AdvisorAdvantage />

        <section className="bg-[#f0eee8] py-20 sm:py-24">
          <div className="container-shell">
            <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-white p-7 shadow-[0_24px_80px_rgba(7,26,47,.09)] sm:p-10 lg:flex-row lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7411]">
                  Begin without pressure
                </p>
                <h2 className="mt-3 max-w-3xl text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">
                  Give Asher one real buyer question to solve.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Start with cost, commute, live inventory, documents or the visit
                  route. Useful service is the first benefit.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-label="Buyer Advantage closing CTA"
                className="shine-button inline-flex min-h-14 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-7 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                <MessageCircle className="mr-2 size-4" />
                Start my Buyer Passport
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
