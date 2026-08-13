import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CalendarCheck,
  FileCheck2,
  KeyRound,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import PublicRequirementForm from "@/components/forms/PublicRequirementForm";

type Mode = "rent" | "resale";

export default function PublicMarketLanding({ mode }: { mode: Mode }) {
  const rental = mode === "rent";
  const title = rental ? "Find a rental that works in real life." : "Buy a resale home with fewer blind spots.";
  const description = rental
    ? "Share your work hub, monthly budget and move-in needs. Asher Realty helps identify relevant owner and managed options, confirm availability and coordinate visits."
    : "Compare ready and occupied homes on usable area, property age, document readiness, total acquisition cost and neighbourhood fit—not only asking price.";
  const checks = rental
    ? [
        "Monthly rent, deposit and maintenance split",
        "Availability, furnishing and parking",
        "Commute and move-in practicality",
        "Owner or representative confirmation",
      ]
    : [
        "Area basis and price-per-square-foot context",
        "Occupancy, age and handover condition",
        "Document-review coordination",
        "Acquisition cost and visit planning",
      ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#041421] py-18 text-white sm:py-24">
        <div className="premium-grid absolute inset-0 opacity-25" />
        <div className="absolute -right-40 top-0 size-[34rem] rounded-full bg-[#c9a227]/10 blur-3xl" />
        <div className="container-shell relative grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
              {rental ? <KeyRound className="size-4" /> : <BadgeCheck className="size-4" />}
              {rental ? "Bengaluru rental assistance" : "Bengaluru resale assistance"}
            </span>
            <h1 className="mt-6 text-6xl font-medium leading-[.96] sm:text-7xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-white/62 sm:text-base">{description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {checks.map((check) => (
                <div key={check} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4 text-xs leading-5 text-white/65">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#e4c462]" />{check}
                </div>
              ))}
            </div>
          </div>
          <PublicRequirementForm mode={mode} />
        </div>
      </section>

      <section className="bg-[#f3f5f7] py-20 sm:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b10]">A managed journey</p>
            <h2 className="mt-4 text-5xl font-medium text-[#071a2f]">From requirement to the next sensible step.</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: MapPin, title: "Understand the need", text: "Locality, commute, budget, timing and non-negotiables become one clear brief." },
              { icon: FileCheck2, title: "Check the option", text: "Availability, owner or representative, commercial terms and key property facts are reviewed." },
              { icon: CalendarCheck, title: "Coordinate the visit", text: "Useful choices are grouped into a focused route with clear meeting points." },
              { icon: Calculator, title: rental ? "Clarify move-in cost" : "Clarify acquisition cost", text: rental ? "Rent, deposit, maintenance and move-in timing are placed together." : "Asking price, taxes, registration and other visible costs are considered together." },
            ].map(({ icon: Icon, title: itemTitle, text }) => (
              <article key={itemTitle} className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
                <Icon className="size-6 text-[#a47b10]" />
                <h3 className="mt-5 text-2xl font-semibold text-[#071a2f]">{itemTitle}</h3>
                <p className="mt-3 text-xs leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-6 rounded-[1.75rem] bg-[#071a2f] p-7 text-center text-white sm:p-9 lg:flex-row lg:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">Own a Bengaluru property?</p>
              <h3 className="mt-3 text-3xl font-medium">Submit it privately for {rental ? "rental" : "resale"} review.</h3>
              <p className="mt-2 text-xs leading-6 text-white/50">Nothing is published automatically, and sensitive documents are not collected in the public form.</p>
            </div>
            <Link href={`/post-property?intent=${rental ? "rent" : "sell"}`} className="inline-flex h-12 shrink-0 items-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f]">
              Post my property<ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
          <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
            Public rental and resale inventory is added only after manual review. Availability and transaction readiness still require confirmation.
          </p>
        </div>
      </section>
    </>
  );
}
