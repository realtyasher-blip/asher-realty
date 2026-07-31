"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Database,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { corridorIntelligence } from "@/data/intelligence";
import { projects } from "@/data/projects";

const launchMix = [
  { name: "South", value: 38, colour: "bg-[#c9a227]" },
  { name: "North", value: 28, colour: "bg-[#315b7a]" },
  { name: "East", value: 26, colour: "bg-[#5f8b78]" },
  { name: "Other", value: 8, colour: "bg-slate-300" },
];

const scoreLabels = {
  employment: "Employment access",
  connectivity: "Connectivity",
  family: "Family infrastructure",
  lifestyle: "Lifestyle depth",
  longTerm: "Long-term optionality",
};

export default function DecisionIntelligence({ compact = false }: { compact?: boolean }) {
  const [selectedSlug, setSelectedSlug] = useState("east-bengaluru");
  const selected =
    corridorIntelligence.find((item) => item.slug === selectedSlug) ||
    corridorIntelligence[0];

  const catalogue = useMemo(() => {
    const developers = new Set(projects.map((project) => project.developer)).size;
    const reraCount = projects.filter((project) => project.rera).length;
    const newLaunches = projects.filter((project) => project.status === "New launch").length;
    const underConstruction = projects.filter((project) => project.status === "Under construction").length;
    return {
      developers,
      reraCoverage: Math.round((reraCount / projects.length) * 100),
      newLaunches,
      underConstruction,
    };
  }, []);

  return (
    <section id="intelligence" className="content-auto-section overflow-hidden bg-white py-24 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#071a2f] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              <Database className="size-4" />
              Asher Intelligence
            </span>
            <h2 className="mt-6 text-5xl font-medium leading-[1.04] text-[#071a2f] sm:text-6xl">
              Numbers that help you ask better questions.
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-slate-600">
              Market research, catalogue coverage and practical corridor signals—translated into decisions a Bengaluru buyer can actually use.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Building2, value: projects.length, label: "Curated projects" },
              { icon: Users, value: catalogue.developers, label: "Leading builders" },
              { icon: ShieldCheck, value: `${catalogue.reraCoverage}%`, label: "RERA disclosed" },
              { icon: BadgeCheck, value: "30 Jul", label: "Catalogue checked" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4">
                <Icon className="size-4 text-[#b08a16]" />
                <p className="mt-4 text-2xl font-bold text-[#071a2f]">{value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-7 xl:grid-cols-[0.92fr_1.08fr]">
          <article className="overflow-hidden rounded-[2rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_80px_rgba(7,26,47,.16)] sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#e4c462]">
                  Bengaluru launch mix
                </p>
                <h3 className="mt-3 text-3xl font-medium">Where Q2 supply appeared</h3>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-white/50">
                Q2 2026
              </span>
            </div>

            <div className="mt-8 overflow-hidden rounded-full bg-white/10">
              <div className="flex h-4 w-full">
                {launchMix.map((item) => (
                  <span
                    key={item.name}
                    className={item.colour}
                    style={{ width: `${item.value}%` }}
                    title={`${item.name}: ${item.value}%`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {launchMix.map((item) => (
                <div key={item.name}>
                  <p className="text-2xl font-bold">{item.value}%</p>
                  <p className="mt-1 text-xs text-white/45">{item.name}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <TrendingUp className="size-4 text-[#e4c462]" />
                <p className="mt-3 text-2xl font-bold">12,544</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.11em] text-white/40">Homes launched</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <BarChart3 className="size-4 text-[#e4c462]" />
                <p className="mt-3 text-2xl font-bold">+4% YoY</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.11em] text-white/40">Launch momentum</p>
              </div>
            </div>
            <p className="mt-5 text-[10px] leading-5 text-white/35">
              Source: Cushman &amp; Wakefield, Bengaluru Residential MarketBeat Q2 2026. Market-level supply data is context—not a return forecast.
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-[#f7f8fa] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b08a16]">
                  Asher Decision Index
                </p>
                <h3 className="mt-2 text-3xl font-medium text-[#071a2f]">Compare corridor fit</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {corridorIntelligence.map((corridor) => (
                  <button
                    key={corridor.slug}
                    type="button"
                    onClick={() => setSelectedSlug(corridor.slug)}
                    className={`rounded-full px-3 py-2 text-[10px] font-bold transition ${
                      selected.slug === corridor.slug
                        ? "bg-[#071a2f] text-white"
                        : "border border-slate-200 bg-white text-slate-500 hover:border-[#c9a227]"
                    }`}
                  >
                    {corridor.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h4 className="text-2xl font-semibold text-[#071a2f]">{selected.name}</h4>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{selected.headline}</p>
              </div>
              <span className="w-fit rounded-full bg-[#fff3c4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7a5b08]">
                {selected.signal}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {Object.entries(selected.scores).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[120px_1fr_34px] items-center gap-3 sm:grid-cols-[150px_1fr_38px]">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {scoreLabels[key as keyof typeof scoreLabels]}
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-[#315b7a] to-[#c9a227]"
                      style={{ width: `${value}%` }}
                    />
                  </span>
                  <span className="text-right text-xs font-bold text-[#071a2f]">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">Strong for</p>
                <p className="mt-2 text-xs leading-6 text-slate-600">{selected.bestFor.join(" · ")}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">Verify carefully</p>
                <p className="mt-2 text-xs leading-6 text-slate-600">{selected.watchouts.join(" · ")}</p>
              </div>
            </div>

            <p className="mt-5 flex gap-2 text-[10px] leading-5 text-slate-400">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-[#b08a16]" />
              Scores are Asher Realty’s transparent decision-support model, not appreciation predictions. They are designed to structure an advisor conversation.
            </p>
          </article>
        </div>

        {!compact && (
          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-[#c9a227]/25 bg-[#fffaf0] p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-[#071a2f]">
                Want the numbers translated to your daily life?
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Compare commute, family needs, budget and delivery risk with one buyer-side advisor.
              </p>
            </div>
            <Link
              href="/intelligence"
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-[#071a2f] px-6 text-xs font-bold text-white transition hover:bg-[#c9a227] hover:text-[#071a2f]"
            >
              Open Intelligence Centre
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
