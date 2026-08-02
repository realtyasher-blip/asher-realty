"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  BriefcaseBusiness,
  Check,
  CircleAlert,
  GitCompareArrows,
  Heart,
  IndianRupee,
  MapPin,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import {
  buyerBriefSummary,
  defaultBuyerPreferences,
  readBuyerPreferences,
  scoreProject,
  writeBuyerPreferences,
  type BuyerPreferences,
} from "@/lib/buyerProfile";
import {
  projectDataConfidence,
  projectDecisionCaution,
  projectFitBand,
  projectSourceLabel,
} from "@/lib/decisionEngine";
import {
  BUYER_WORKSPACE_EVENT,
  COMPARISON_KEY,
  FAVOURITES_KEY,
  readBuyerWorkspace,
  toggleBuyerWorkspaceItem,
  writeBuyerWorkspaceList,
} from "@/lib/buyerWorkspace";
import { cn } from "@/lib/utils";

const workHubs = [
  { value: "Whitefield / ITPL", label: "Whitefield / ITPL", detail: "East Bengaluru tech corridor" },
  { value: "ORR / Bellandur", label: "ORR / Bellandur", detail: "Outer Ring Road employment belt" },
  { value: "Manyata Tech Park", label: "Manyata / Hebbal", detail: "North Bengaluru work hub" },
  { value: "Electronic City", label: "Electronic City", detail: "South Bengaluru tech hub" },
  { value: "CBD / MG Road", label: "CBD / MG Road", detail: "Central Bengaluru access" },
  { value: "Airport / Devanahalli", label: "Airport / Devanahalli", detail: "Airport and aerospace corridor" },
  { value: "Flexible", label: "I am flexible", detail: "Show the strongest citywide options" },
];

const budgets = ["Up to ₹2 Cr", "₹2–3 Cr", "₹3 Cr+", "Flexible"];
const timelines = ["Ready–2 years", "2–4 years", "4+ years", "Flexible"];
const priorities = [
  "Balanced",
  "Metro & commute",
  "Open space & lifestyle",
  "Rental & appreciation",
  "Large home",
];

const stepLabels = ["Work & area", "Home & budget", "Plan", "Matches"];

function matchTone(label: string) {
  if (label === "Strong match") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (label === "Good match") return "bg-[#fff8df] text-[#7a5b08] border-[#ead88e]";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

export default function HomeMatchStudio() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] =
    useState<BuyerPreferences>(defaultBuyerPreferences);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const syncWorkspace = () => {
      setFavourites(readBuyerWorkspace().favourites);
    };

    const timer = window.setTimeout(() => {
      const stored = readBuyerPreferences();
      const params = new URLSearchParams(window.location.search);
      const workHub = params.get("workHub");
      const configuration = params.get("bhk");
      const budget = params.get("budget");

      const next: BuyerPreferences = {
        ...stored,
        workHub: workHub || stored.workHub,
        configuration: configuration || stored.configuration,
        budget: budget || stored.budget,
      };

      const cameFromQuickSearch = Boolean(workHub || configuration || budget);
      if (cameFromQuickSearch) {
        next.customized = true;
        writeBuyerPreferences(next);
        setStep(3);
      }

      setPreferences(next);
      syncWorkspace();
    }, 0);

    window.addEventListener(BUYER_WORKSPACE_EVENT, syncWorkspace);
    window.addEventListener("storage", syncWorkspace);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_WORKSPACE_EVENT, syncWorkspace);
      window.removeEventListener("storage", syncWorkspace);
    };
  }, []);

  const ranked = useMemo(
    () =>
      projects
        .map((project) => scoreProject(project, preferences))
        .sort((left, right) => right.score - left.score),
    [preferences]
  );

  const topMatches = ranked.slice(0, 3);
  const preview = topMatches[0];

  function updatePreference<K extends keyof BuyerPreferences>(
    key: K,
    value: BuyerPreferences[K]
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function showMatches() {
    const next = { ...preferences, corridor: "Flexible", customized: true };
    setPreferences(next);
    writeBuyerPreferences(next);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetMatch() {
    setPreferences(defaultBuyerPreferences);
    setStep(0);
    setNotice("");
  }

  function toggleSaved(slug: string, name: string) {
    const next = toggleBuyerWorkspaceItem(FAVOURITES_KEY, slug);
    setFavourites(next);
    setNotice(next.includes(slug) ? `${name} saved to My Search.` : `${name} removed from saved homes.`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function compareTopTwo() {
    const slugs = topMatches.slice(0, 2).map(({ project }) => projectSlug(project.name));
    writeBuyerWorkspaceList(COMPARISON_KEY, slugs);
    window.location.assign(`/compare?projects=${slugs.join(",")}`);
  }

  const advisorMessage = encodeURIComponent(
    `Hi Asher Realty, I completed Home Match. My brief is ${buyerBriefSummary(preferences)}. My suggested matches are ${topMatches
      .map(({ project }) => project.name)
      .join(", ")}. Please verify current pricing, preferred-stack availability and help me plan sensible site visits.`
  );

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(7,26,47,.12)]">
      <div className="border-b border-slate-200 bg-[#071a2f] px-5 py-5 text-white sm:px-8">
        <div className="grid grid-cols-4 gap-2">
          {stepLabels.map((label, index) => {
            const complete = step > index;
            const active = step === index;
            return (
              <div key={label} className="min-w-0">
                <div className={cn("h-1 rounded-full", complete || active ? "bg-[#c9a227]" : "bg-white/10")} />
                <p className={cn("mt-2 truncate text-[9px] font-bold uppercase tracking-[0.1em]", complete || active ? "text-white" : "text-white/30") }>
                  {index + 1}. {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {step < 3 ? (
        <div className="grid xl:grid-cols-[1.05fr_.95fr]">
          <section className="p-6 sm:p-9 lg:p-12">
            {step === 0 && (
              <div>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fff4c9] text-[#8b6810]">
                  <BriefcaseBusiness className="size-5" />
                </span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-[#9a7412]">Start with your weekday</p>
                <h2 className="mt-3 text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">Where should home make life easier?</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">Choose your main work anchor. We use it as a corridor lens—not as a promise of exact travel time.</p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {workHubs.map((hub) => (
                    <button
                      key={hub.value}
                      type="button"
                      onClick={() => updatePreference("workHub", hub.value)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#c9a227]",
                        preferences.workHub === hub.value
                          ? "border-[#c9a227] bg-[#fff9e8] shadow-[0_10px_28px_rgba(201,162,39,.12)]"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-sm font-bold text-[#071a2f]">{hub.label}</span>
                          <span className="mt-1 block text-[10px] leading-5 text-slate-400">{hub.detail}</span>
                        </span>
                        {preferences.workHub === hub.value && (
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#071a2f] text-white"><Check className="size-3.5" /></span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fff4c9] text-[#8b6810]">
                  <BedDouble className="size-5" />
                </span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-[#9a7412]">Shape the home</p>
                <h2 className="mt-3 text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">What fits your household and budget?</h2>

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Home size</p>
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {["1", "2", "3", "4"].map((value) => (
                      <button key={value} type="button" onClick={() => updatePreference("configuration", value)} className={cn("h-14 rounded-2xl border text-sm font-bold transition", preferences.configuration === value ? "border-[#071a2f] bg-[#071a2f] text-white" : "border-slate-200 bg-[#f7f8fa] text-[#071a2f] hover:border-[#c9a227]") }>
                        {value} BHK
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Comfortable all-in budget band</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {budgets.map((value) => (
                      <button key={value} type="button" onClick={() => updatePreference("budget", value)} className={cn("flex h-14 items-center justify-between rounded-2xl border px-5 text-sm font-bold transition", preferences.budget === value ? "border-[#c9a227] bg-[#fff9e8] text-[#071a2f]" : "border-slate-200 bg-white text-slate-600 hover:border-[#c9a227]") }>
                        <span>{value}</span>
                        <IndianRupee className="size-4 text-[#a47b10]" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] leading-5 text-slate-400">Unknown-price projects are not treated as within budget until a live cost sheet is confirmed.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fff4c9] text-[#8b6810]">
                  <Target className="size-5" />
                </span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-[#9a7412]">Make the ranking yours</p>
                <h2 className="mt-3 text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">What matters most in the decision?</h2>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <label>
                    <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Buying for</span>
                    <select value={preferences.purpose} onChange={(event) => updatePreference("purpose", event.target.value)} className="mt-3 h-14 w-full rounded-2xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#071a2f] outline-none focus:border-[#c9a227]">
                      <option>Self-use</option>
                      <option>Investment</option>
                    </select>
                  </label>
                  <label>
                    <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Move-in preference</span>
                    <select value={preferences.timeline} onChange={(event) => updatePreference("timeline", event.target.value)} className="mt-3 h-14 w-full rounded-2xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#071a2f] outline-none focus:border-[#c9a227]">
                      {timelines.map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Top priority</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {priorities.map((value) => (
                      <button key={value} type="button" onClick={() => updatePreference("priority", value)} className={cn("rounded-full border px-4 py-3 text-xs font-bold transition", preferences.priority === value ? "border-[#071a2f] bg-[#071a2f] text-white" : "border-slate-200 bg-white text-slate-500 hover:border-[#c9a227]") }>
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-9 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex h-12 items-center rounded-full px-4 text-sm font-bold text-slate-500 transition hover:bg-slate-100 disabled:invisible">
                <ArrowLeft className="mr-2 size-4" /> Back
              </button>
              {step < 2 ? (
                <button type="button" onClick={() => setStep((current) => current + 1)} className="inline-flex h-12 items-center rounded-full bg-[#071a2f] px-6 text-sm font-bold text-white transition hover:bg-[#0d2948]">
                  Continue <ArrowRight className="ml-2 size-4" />
                </button>
              ) : (
                <button type="button" onClick={showMatches} className="shine-button inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]">
                  <Sparkles className="mr-2 size-4" /> Show my matches
                </button>
              )}
            </div>
          </section>

          <aside className="relative hidden min-h-[680px] overflow-hidden bg-[#041421] p-9 text-white xl:block">
            <div className="premium-grid absolute inset-0 opacity-30" />
            <div className="absolute -right-28 -top-20 size-80 rounded-full bg-[#c9a227]/15 blur-[95px]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e4c462]">
                  <Sparkles className="size-3.5" /> Live preview
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">{projects.length} projects read</span>
              </div>

              <p className="mt-8 text-sm leading-7 text-white/50">Your answers continuously reorder the catalogue. No builder pays for the top position.</p>

              {preview && (
                <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={preview.project.image} alt={preview.project.name} fill className="object-cover" sizes="420px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041421] via-transparent to-transparent" />
                    <div className="absolute inset-x-5 bottom-5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#e4c462]">Current leading match</p>
                      <p className="mt-1 text-3xl font-semibold">{preview.project.name}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="flex items-start gap-2 text-xs leading-6 text-white/55"><MapPin className="mt-1 size-3.5 shrink-0 text-[#e4c462]" />{preview.project.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {preview.reasons.slice(0, 3).map((reason) => <span key={reason} className="rounded-full bg-white/[0.07] px-3 py-2 text-[9px] font-bold text-white/65">{reason}</span>)}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-white/10 p-5">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e4c462]"><ShieldCheck className="size-4" /> Honest matching</p>
                <p className="mt-3 text-xs leading-6 text-white/45">Commute is a corridor proxy until route-time data is checked. Prices and units are reconfirmed before a visit.</p>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <section className="bg-[#f4f5f7] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700"><Check className="size-4" /> Buyer brief active</span>
              <h2 className="mt-5 text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">Three places to begin—not another endless list.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">{buyerBriefSummary(preferences)}. Match labels are directional; the exact unit, cost sheet and travel pattern are verified with you before a visit.</p>
            </div>
            <button type="button" onClick={resetMatch} className="inline-flex h-11 w-fit items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-[#071a2f] transition hover:border-[#c9a227]"><RotateCcw className="mr-2 size-4" /> Change answers</button>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            {topMatches.map(({ project, score, reasons }, index) => {
              const slug = projectSlug(project.name);
              const saved = favourites.includes(slug);
              const confidence = projectDataConfidence(project);
              const band = projectFitBand(score);

              return (
                <article key={project.name} className="group overflow-hidden rounded-[1.65rem] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(7,26,47,.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(7,26,47,.12)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                    <Image src={project.image} alt={project.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 1280px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041421]/90 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-[#071a2f] text-xs font-extrabold text-white">#{index + 1}</span>
                    <button type="button" onClick={() => toggleSaved(slug, project.name)} aria-label={saved ? `Remove ${project.name} from saved homes` : `Save ${project.name}`} className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/92 text-[#071a2f] shadow-md"><Heart className={cn("size-5", saved && "fill-rose-500 text-rose-500")} /></button>
                    <div className="absolute inset-x-5 bottom-5 text-white">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#e4c462]">{project.developer}</p>
                      <h3 className="mt-1 text-3xl font-semibold">{project.name}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full border px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.1em]", matchTone(band))}>{band}</span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">{confidence.label} data</span>
                    </div>

                    <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-slate-500"><MapPin className="mt-1 size-3.5 shrink-0 text-[#a47b10]" />{project.location}</p>
                    <div className="mt-4 space-y-2">
                      {reasons.slice(0, 3).map((reason) => <p key={reason} className="flex items-center gap-2 text-xs font-semibold text-[#071a2f]/75"><Check className="size-3.5 text-emerald-600" />{reason}</p>)}
                    </div>

                    <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <p className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.11em] text-amber-700"><CircleAlert className="size-3.5" /> Check before visiting</p>
                      <p className="mt-2 text-[11px] leading-5 text-amber-950/65">{projectDecisionCaution(project)}</p>
                    </div>

                    <p className="mt-4 text-[9px] font-semibold text-slate-400">{projectSourceLabel(project)}</p>
                    <Link href={`/projects/${slug}`} className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#071a2f] text-xs font-bold text-white transition hover:bg-[#0d2948]">Open buyer brief <ArrowRight className="ml-2 size-4" /></Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 rounded-[1.75rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_70px_rgba(7,26,47,.14)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">Next best step</p>
              <h3 className="mt-2 text-2xl font-semibold">Compare the top two—or let an advisor validate all three.</h3>
              <p className="mt-2 text-xs leading-6 text-white/45">Your buyer brief and suggested projects travel with the conversation.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={compareTopTwo} className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-5 text-xs font-bold text-white transition hover:border-[#c9a227]"><GitCompareArrows className="mr-2 size-4 text-[#e4c462]" /> Compare top two</button>
              <a href={`https://wa.me/919019697170?text=${advisorMessage}`} target="_blank" rel="noopener noreferrer" data-analytics-label="Home Match advisor review" className="shine-button inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"><MessageCircle className="mr-2 size-4" /> Review with advisor</a>
            </div>
          </div>
        </section>
      )}

      {notice && <div role="status" className="fixed bottom-24 right-4 z-[90] rounded-2xl bg-[#071a2f] px-5 py-4 text-xs font-bold text-white shadow-[0_18px_55px_rgba(0,0,0,.28)]">{notice}</div>}
    </div>
  );
}
