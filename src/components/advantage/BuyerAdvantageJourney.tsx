"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  GitCompareArrows,
  Home,
  MapPinned,
  MessageCircle,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const stages = [
  {
    id: "exploring",
    label: "Exploring",
    icon: Search,
    title: "Turn a broad idea into one useful buyer brief.",
    description:
      "Begin with work, budget, family needs and timeline. The Passport keeps the decision anchored to your life instead of builder inventory.",
    deliverables: [
      "An explainable Home Match based on your real priorities",
      "A small cross-builder shortlist with visible trade-offs",
      "A clear list of unknowns that need live confirmation",
    ],
    href: "/home-match",
    action: "Build my Home Match",
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
    icon: GitCompareArrows,
    title: "Challenge the shortlist before falling in love with it.",
    description:
      "Compare location, usable space, possession, phase facts and data confidence before a sales presentation shapes the decision.",
    deliverables: [
      "A side-by-side decision comparison",
      "The strongest reason for and against each option",
      "Current price and inventory questions for the advisor",
    ],
    href: "/compare",
    action: "Compare my strongest homes",
  },
  {
    id: "visiting",
    label: "Planning visits",
    icon: MapPinned,
    title: "Make one weekend produce a real decision.",
    description:
      "Group the best alternatives into one sensible route and carry the same questions into every sales office.",
    deliverables: [
      "A focused multi-project visit itinerary",
      "One reusable tower, view and cost checklist",
      "Visit notes that stay with your saved-home workspace",
    ],
    href: "/book-site-visit",
    action: "Plan my visit route",
  },
  {
    id: "booking",
    label: "Ready to book",
    icon: ShieldCheck,
    title: "Pause before the token and review the complete decision.",
    description:
      "Ask for the exact phase, written cost sheet, payment timing and unit-level details before committing.",
    deliverables: [
      "All-inclusive cost-sheet conversation",
      "Tower, phase, RERA and possession checklist",
      "A booking-readiness question pack for the developer",
    ],
    href: "/tools",
    action: "Review affordability and costs",
  },
  {
    id: "ownership",
    label: "Already booked",
    icon: Home,
    title: "Keep support after the booking form is signed.",
    description:
      "Use Asher as a continuing coordination desk for milestone questions, handover preparation and the practical next steps around ownership.",
    deliverables: [
      "Construction and payment-question coordination on request",
      "Handover and snagging-preparation checklist",
      "Guidance towards relevant independent specialists when needed",
    ],
    href: "/guides",
    action: "Open ownership guides",
  },
  {
    id: "next",
    label: "Next property",
    icon: RefreshCcw,
    title: "Make the next property decision easier than the first.",
    description:
      "Reuse what Asher already knows about your preferences, risk tolerance and ownership goals when you upgrade or invest again.",
    deliverables: [
      "A refreshed brief instead of starting from zero",
      "A portfolio-level conversation around the next objective",
      "The same buyer-side standards for every future shortlist",
    ],
    href: "/my-search",
    action: "Open my Buyer Passport",
  },
] as const;

const concerns = [
  "All-inclusive cost",
  "Commute and location",
  "Live inventory",
  "RERA and documents",
  "Handover support",
] as const;

export default function BuyerAdvantageJourney() {
  const [stageId, setStageId] = useState<(typeof stages)[number]["id"]>(
    "exploring"
  );
  const [concern, setConcern] = useState<(typeof concerns)[number]>(
    "All-inclusive cost"
  );

  const stage = stages.find((item) => item.id === stageId) ?? stages[0];
  const whatsappUrl = useMemo(() => {
    const message = `Hi Asher Realty, I want to start my free Buyer Passport. My current stage is ${stage.label} and my biggest concern is ${concern}. Please help me with the relevant buyer-side plan without sales pressure.`;
    return `https://wa.me/919019697170?text=${encodeURIComponent(message)}`;
  }, [concern, stage]);

  return (
    <section id="build-plan" className="bg-[#f0eee8] py-20 sm:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7411]">
            Your 60-second Advantage plan
          </p>
          <h2 className="mt-4 text-5xl font-medium leading-[0.98] tracking-[-0.03em] text-[#071a2f] sm:text-7xl">
            Start where you are.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Choose your current stage and biggest concern. The Passport shows
            the practical help available now—not a generic sales pitch.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-[#071a2f]/10 bg-white shadow-[0_30px_90px_rgba(7,26,47,.1)] xl:grid-cols-[.8fr_1.2fr]">
          <div className="bg-[#071a2f] p-6 text-white sm:p-9">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              <Sparkles className="size-4" /> Where are you today?
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {stages.map(({ id, label, icon: Icon }) => {
                const selected = id === stage.id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setStageId(id)}
                    className={`flex min-h-14 items-center justify-between rounded-2xl border px-4 text-left text-sm font-bold transition ${
                      selected
                        ? "border-[#e4c462]/45 bg-[#c9a227]/14 text-[#f0d477]"
                        : "border-white/8 bg-white/[0.04] text-white/62 hover:border-white/18 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="size-4" />
                      {label}
                    </span>
                    <ArrowRight className={`size-4 ${selected ? "opacity-100" : "opacity-25"}`} />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                What worries you most?
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {concerns.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={concern === item}
                    onClick={() => setConcern(item)}
                    className={`rounded-full border px-3 py-2 text-[10px] font-bold transition ${
                      concern === item
                        ? "border-[#e4c462] bg-[#e4c462] text-[#071a2f]"
                        : "border-white/12 text-white/52 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div key={`${stage.id}-${concern}`} className="collection-reveal p-6 sm:p-9 lg:p-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-[#fff5cf] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8d690b]">
                {stage.label} · {concern}
              </span>
              <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                <BadgeCheck className="size-4" /> Buyer-side plan
              </span>
            </div>

            <h3 className="mt-6 max-w-3xl text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">
              {stage.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              {stage.description}
            </p>

            <div className="mt-8 grid gap-3">
              {stage.deliverables.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#f8f8f6] p-4"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#071a2f]">
                    <Check className="size-3.5 text-[#e4c462]" />
                  </span>
                  <p className="text-sm font-semibold leading-6 text-[#071a2f]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href={stage.href}
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#071a2f]/15 px-6 text-sm font-bold text-[#071a2f] transition hover:border-[#c9a227] hover:bg-[#fffaf0]"
              >
                {stage.action}
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-label={`Buyer Passport ${stage.id} ${concern}`}
                className="shine-button inline-flex min-h-13 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                <MessageCircle className="mr-2 size-4" />
                Start my free Buyer Passport
              </a>
            </div>

            <p className="mt-5 text-[10px] leading-5 text-slate-400">
              Buyer Passport guidance is complimentary for property discovery.
              Specialist legal, lending, inspection or partner services may have
              separate terms and charges disclosed before engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
