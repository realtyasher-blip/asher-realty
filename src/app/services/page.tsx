import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  Building2,
  Camera,
  FileCheck2,
  Hammer,
  Home,
  KeyRound,
  MessageCircle,
  MoveRight,
  Paintbrush,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "End-to-End Real Estate Services in Bengaluru",
  description: "Explore Asher Realty support for buying, renting, selling, tenant search, valuation, loans, documents, inspections, interiors and moving in Bengaluru.",
};

const services = [
  { icon: SearchCheck, title: "Buy and shortlist", text: "New projects and resale choices compared around budget, commute, usable space and possession." },
  { icon: KeyRound, title: "Rental search", text: "Requirement matching, commercial-term checks and managed property visits for tenants." },
  { icon: Building2, title: "Resale assistance", text: "Owner intake, positioning review, buyer enquiries, visit coordination and negotiation support." },
  { icon: Home, title: "Rent-out assistance", text: "Landlord intake, tenant-search coordination, visit scheduling and commercial-term support." },
  { icon: BadgeIndianRupee, title: "Property valuation review", text: "A practical market-positioning conversation using comparable asking data and property specifics—not a guaranteed valuation." },
  { icon: Banknote, title: "Home-loan coordination", text: "Eligibility and lender-introduction support. Approval, pricing and terms remain with the lender." },
  { icon: FileCheck2, title: "Document-review coordination", text: "Checklist preparation and introductions to appropriate legal professionals where a legal opinion is required." },
  { icon: ShieldCheck, title: "Home inspection", text: "Independent snagging or condition-review coordination before handover, purchase or move-in." },
  { icon: Camera, title: "Photography and presentation", text: "Professional media and listing-presentation support for approved owner properties." },
  { icon: Paintbrush, title: "Interiors and renovation", text: "Requirement scoping and introductions to suitable implementation partners." },
  { icon: MoveRight, title: "Packers and movers", text: "Move planning and service-provider coordination for local or intercity relocation." },
  { icon: Hammer, title: "Property management", text: "Periodic owner support for occupancy, renewals and maintenance coordination, subject to an agreed service scope." },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f3f5f7] pt-20">
        <section className="relative overflow-hidden bg-[#041421] py-18 text-white sm:py-24">
          <div className="premium-grid absolute inset-0 opacity-25" />
          <div className="container-shell relative grid gap-10 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4c462]">End-to-end property support</p>
              <h1 className="mt-5 max-w-4xl text-6xl font-medium leading-[.96] sm:text-7xl">One place for the work that begins before—and continues after—the property search.</h1>
            </div>
            <div>
              <p className="text-sm leading-8 text-white/60">Choose only what you need. Asher coordinates the journey and clearly identifies when a licensed lender, lawyer, inspector or other specialist partner is delivering the service.</p>
              <a href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20need%20help%20with%20a%20Bengaluru%20property%20service." target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f]"><MessageCircle className="mr-2 size-4" />Discuss my requirement</a>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="container-shell">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="group flex min-h-72 flex-col rounded-[1.6rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#c9a227]/50 hover:shadow-[0_20px_60px_rgba(7,26,47,.1)]">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]"><Icon className="size-5" /></span>
                    <span className="text-3xl font-light text-slate-100">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold text-[#071a2f]">{title}</h2>
                  <p className="mt-4 text-xs leading-6 text-slate-500">{text}</p>
                  <a href={`https://wa.me/919019697170?text=${encodeURIComponent(`Hi Asher Realty, I would like to discuss ${title.toLowerCase()} in Bengaluru.`)}`} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center pt-6 text-xs font-bold text-[#9a7410]">Ask about this service<ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" /></a>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[1.75rem] bg-[#071a2f] p-7 text-white sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4c462]">Own a property?</p>
                <h2 className="mt-4 text-4xl font-medium">Begin with a private owner review.</h2>
                <p className="mt-4 text-xs leading-6 text-white/55">Submit essential facts for resale or rent-out assistance. Nothing is made public automatically.</p>
                <Link href="/post-property" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f]">Post a property<ArrowRight className="ml-2 size-4" /></Link>
              </div>
              <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-7 text-amber-950 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Transparent scope</p>
                <h2 className="mt-4 text-4xl font-medium text-[#071a2f]">Know who is doing what.</h2>
                <p className="mt-4 text-xs leading-6 text-amber-900/70">Asher Realty does not issue government records, legal opinions or loan approvals. When a specialist or partner is required, their role, fees and terms are disclosed before you proceed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
