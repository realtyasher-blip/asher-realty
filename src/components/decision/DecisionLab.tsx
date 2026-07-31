"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CircleAlert,
  Clock3,
  Download,
  GitCompareArrows,
  IndianRupee,
  MapPin,
  MessageCircle,
  Radar,
  RotateCcw,
  Save,
  ShieldCheck,
  Target,
} from "lucide-react";

import { projectSlug, projects, type Project } from "@/data/projects";
import {
  COMPARISON_KEY,
  writeBuyerWorkspaceList,
} from "@/lib/buyerWorkspace";

const PROFILE_KEY = "asher-decision-profile-v1";
const BUYER_PREFERENCES_KEY = "asher-buyer-preferences";

type Profile = {
  corridor: string;
  configuration: string;
  budgetLakhs: number;
  purpose: string;
  timeline: string;
  priority: string;
  riskStyle: string;
};

const defaultProfile: Profile = {
  corridor: "East Bengaluru",
  configuration: "3",
  budgetLakhs: 250,
  purpose: "Self-use",
  timeline: "6–18 months",
  priority: "Commute",
  riskStyle: "Balanced",
};

const options = {
  corridor: [
    "Flexible",
    "East Bengaluru",
    "North Bengaluru",
    "South Bengaluru",
    "Central Bengaluru",
  ],
  configuration: ["1", "2", "3", "4"],
  purpose: ["Self-use", "Investment"],
  timeline: ["Within 6 months", "6–18 months", "2+ years"],
  priority: ["Commute", "Space", "Delivery confidence", "Lifestyle", "Growth corridor"],
  riskStyle: ["Certainty first", "Balanced", "Early opportunity"],
};

function projectPriceLakhs(price: string) {
  const match = price.match(/₹\s?(\d+(?:\.\d+)?)\s*Cr/i);
  if (match) return Number(match[1]) * 100;
  const lakhMatch = price.match(/₹\s?(\d+(?:\.\d+)?)\s*(?:L|lakh)/i);
  return lakhMatch ? Number(lakhMatch[1]) : null;
}

function formatBudget(lakhs: number) {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${Number.isInteger(crores) ? crores : crores.toFixed(1)} Cr`;
  }
  return `₹${lakhs} L`;
}

function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function indicativeEmi(project: Project) {
  const lakhs = projectPriceLakhs(project.price);
  if (!lakhs) return null;

  const loan = lakhs * 100000 * 0.8;
  const monthlyRate = 8.5 / 12 / 100;
  const months = 20 * 12;
  return (
    (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function verificationScore(project: Project) {
  let score = 20;
  if (project.rera) score += 20;
  if (project.possession) score += 15;
  if (project.unitSizes) score += 10;
  if (project.area) score += 8;
  if (project.gallery.length >= 3) score += 10;
  if (project.sourceUrl) score += 7;
  if (projectPriceLakhs(project.price)) score += 10;
  return Math.min(score, 100);
}

function rankProject(project: Project, profile: Profile) {
  let score = 38;
  const reasons: string[] = [];
  const cautions: string[] = [];
  const price = projectPriceLakhs(project.price);

  if (profile.corridor === "Flexible") {
    score += 9;
    reasons.push("Location flexibility");
  } else if (project.corridor === profile.corridor) {
    score += 22;
    reasons.push(`${profile.corridor.replace(" Bengaluru", "")} corridor match`);
  } else {
    score -= 7;
    cautions.push("Outside your preferred corridor");
  }

  if (project.configuration.includes(profile.configuration)) {
    score += 16;
    reasons.push(`${profile.configuration} BHK available`);
  } else {
    score -= 6;
    cautions.push("Preferred configuration needs confirmation");
  }

  if (price === null) {
    score += 3;
    cautions.push("Live price required for budget fit");
  } else if (price <= profile.budgetLakhs) {
    score += 14;
    reasons.push("Visible price within budget");
  } else if (price <= profile.budgetLakhs * 1.12) {
    score += 5;
    cautions.push("Slightly above selected budget");
  } else {
    score -= 12;
    cautions.push("Visible price exceeds budget");
  }

  if (profile.purpose === "Investment") {
    if (["North Bengaluru", "East Bengaluru"].includes(project.corridor)) {
      score += 7;
      reasons.push("Employment and infrastructure corridor");
    }
  } else if ((project.amenities?.length || project.highlights.length) >= 5) {
    score += 7;
    reasons.push("Strong end-use lifestyle depth");
  }

  if (profile.timeline === "Within 6 months") {
    if (project.status === "Ready / active") {
      score += 11;
      reasons.push("Move-in aligned status");
    } else if (project.status === "Coming soon") {
      score -= 9;
      cautions.push("Timeline may not suit near-term move-in");
    }
  } else if (profile.timeline === "6–18 months") {
    if (["Under construction", "New launch"].includes(project.status)) score += 7;
  } else if (["Coming soon", "New launch", "Under construction"].includes(project.status)) {
    score += 6;
    reasons.push("Longer planning window fits project stage");
  }

  if (profile.priority === "Commute" && project.corridor === profile.corridor) {
    score += 7;
    reasons.push("Daily corridor alignment");
  }
  if (
    profile.priority === "Space" &&
    (project.unitSizes || /4/.test(project.configuration))
  ) {
    score += 8;
    reasons.push("Larger-home signal");
  }
  if (profile.priority === "Delivery confidence" && project.rera && project.possession) {
    score += 9;
    reasons.push("RERA and possession details available");
  }
  if (
    profile.priority === "Lifestyle" &&
    (project.amenities?.length || project.highlights.length) >= 5
  ) {
    score += 8;
    reasons.push("Amenity-led fit");
  }
  if (
    profile.priority === "Growth corridor" &&
    ["North Bengaluru", "East Bengaluru"].includes(project.corridor)
  ) {
    score += 8;
    reasons.push("Growth-corridor exposure");
  }

  if (profile.riskStyle === "Certainty first") {
    if (project.rera) score += 5;
    if (project.possession) score += 4;
    if (project.status === "Coming soon") score -= 5;
  } else if (
    profile.riskStyle === "Early opportunity" &&
    ["Coming soon", "New launch"].includes(project.status)
  ) {
    score += 8;
    reasons.push("Early-stage opportunity fit");
  }

  if (!project.rera) cautions.push("RERA detail needs phase-level confirmation");
  if (!project.possession) cautions.push("Possession needs current confirmation");

  return {
    project,
    score: Math.max(24, Math.min(score, 98)),
    verification: verificationScore(project),
    reasons: Array.from(new Set(reasons)).slice(0, 4),
    cautions: Array.from(new Set(cautions)).slice(0, 3),
  };
}

export default function DecisionLab() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
        if (saved && typeof saved === "object") {
          setProfile({ ...defaultProfile, ...saved });
        }
      } catch {
        // The default profile remains available if device storage is blocked.
      }

      const requested = new URLSearchParams(window.location.search).get("project");
      if (requested && projects.some((project) => projectSlug(project.name) === requested)) {
        setSelectedSlug(requested);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const allRanked = useMemo(
    () =>
      projects
        .map((project) => rankProject(project, profile))
        .sort((a, b) => b.score - a.score || b.verification - a.verification),
    [profile]
  );

  const ranked = allRanked.slice(0, 6);

  const selected =
    allRanked.find(({ project }) => projectSlug(project.name) === selectedSlug) ||
    ranked[0];
  const emi = indicativeEmi(selected.project);

  const advisorMessage = encodeURIComponent(
    `Hi Asher Realty, I completed the Buyer Decision Lab. I need a ${profile.configuration} BHK in ${profile.corridor}, budget ${formatBudget(profile.budgetLakhs)}, for ${profile.purpose.toLowerCase()}, timeline ${profile.timeline.toLowerCase()}. My top matches are ${ranked
      .slice(0, 3)
      .map(({ project }) => project.name)
      .join(", ")}. Please verify current pricing, inventory, all-inclusive cost and site-visit options.`
  );

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function savePlan() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(
      BUYER_PREFERENCES_KEY,
      JSON.stringify({
        corridor: profile.corridor,
        configuration: profile.configuration,
        budget:
          profile.budgetLakhs <= 200
            ? "Up to ₹2 Cr"
            : profile.budgetLakhs <= 300
              ? "₹2–3 Cr"
              : "₹3 Cr+",
        purpose: profile.purpose,
      })
    );
    setNotice("Your buyer profile is saved on this device.");
  }

  function compareTopMatches() {
    const slugs = ranked
      .slice(0, 2)
      .map(({ project }) => projectSlug(project.name));
    writeBuyerWorkspaceList(COMPARISON_KEY, slugs);
    window.location.assign(`/compare?projects=${slugs.join(",")}`);
  }

  function resetPlan() {
    setProfile(defaultProfile);
    setSelectedSlug("");
    setNotice("Profile reset to a Bengaluru family-buyer example.");
  }

  const controls: Array<{
    label: string;
    key: keyof Profile;
    values: string[];
  }> = [
    { label: "Preferred corridor", key: "corridor", values: options.corridor },
    { label: "Home size", key: "configuration", values: options.configuration },
    { label: "Buying for", key: "purpose", values: options.purpose },
    { label: "Purchase timeline", key: "timeline", values: options.timeline },
    { label: "Most important", key: "priority", values: options.priority },
    { label: "Decision style", key: "riskStyle", values: options.riskStyle },
  ];

  return (
    <div className="grid gap-7 xl:grid-cols-[360px_1fr]">
      <aside className="h-fit rounded-[2rem] border border-white/10 bg-[#071a2f] p-5 text-white shadow-[0_25px_80px_rgba(7,26,47,.18)] sm:p-7 xl:sticky xl:top-28">
        <div className="flex items-center justify-between gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#e4c462]">
            <Radar className="size-6" />
          </span>
          <button
            type="button"
            onClick={resetPlan}
            className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/45 transition hover:text-white"
            aria-label="Reset buyer profile"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#e4c462]">
          Your buyer passport
        </p>
        <h2 className="mt-3 text-3xl font-medium">Tell the engine what matters.</h2>
        <p className="mt-3 text-xs leading-6 text-white/45">
          Every score changes with your priorities. No generic “best project” ranking.
        </p>

        <div className="mt-7 space-y-5">
          {controls.map(({ label, key, values }) => (
            <label key={key} className="block">
              <span className="text-[11px] font-semibold text-white/48">{label}</span>
              <select
                value={String(profile[key])}
                onChange={(event) => updateProfile(key, event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#041421] px-4 text-xs font-semibold text-white outline-none transition focus:border-[#c9a227]"
              >
                {values.map((value) => (
                  <option key={value} value={value}>
                    {key === "configuration" ? `${value} BHK` : value}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-white/48">
              Comfortable budget
              <span className="rounded-full bg-[#c9a227]/15 px-3 py-1.5 font-bold text-[#e4c462]">
                {formatBudget(profile.budgetLakhs)}
              </span>
            </span>
            <input
              type="range"
              min="75"
              max="800"
              step="25"
              value={profile.budgetLakhs}
              onChange={(event) =>
                updateProfile("budgetLakhs", Number(event.target.value))
              }
              className="mt-4 w-full accent-[#c9a227]"
            />
            <span className="mt-1 flex justify-between text-[9px] text-white/25">
              <span>₹75 L</span>
              <span>₹8 Cr</span>
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={savePlan}
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#c9a227] text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
        >
          <Save className="mr-2 size-4" />
          Save my buyer passport
        </button>
        {notice && <p role="status" className="mt-3 text-center text-[10px] leading-5 text-emerald-300">{notice}</p>}
      </aside>

      <div className="min-w-0 space-y-7">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(7,26,47,.1)]">
          <div className="grid lg:grid-cols-[.92fr_1.08fr]">
            <div className="relative min-h-[340px] overflow-hidden">
              <Image
                src={selected.project.image}
                alt={selected.project.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041421] via-[#041421]/20 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                  Current best fit · {selected.project.developer}
                </p>
                <h2 className="mt-2 text-4xl font-medium">{selected.project.name}</h2>
                <p className="mt-2 flex items-center gap-2 text-xs text-white/60">
                  <MapPin className="size-4 text-[#e4c462]" />
                  {selected.project.location}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b08a16]">
                    Explainable decision score
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Fit is personal. Confidence measures how complete the current project data is.
                  </p>
                </div>
                <div
                  className="relative flex size-28 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#c9a227 ${selected.score}%, #eef0f3 0)`,
                  }}
                >
                  <div className="flex size-20 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-extrabold text-[#071a2f]">{selected.score}</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Fit score</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#f7f8fa] p-4">
                  <ShieldCheck className="size-4 text-[#b08a16]" />
                  <p className="mt-3 text-xl font-bold text-[#071a2f]">{selected.verification}%</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Data confidence</p>
                </div>
                <div className="rounded-2xl bg-[#f7f8fa] p-4">
                  <IndianRupee className="size-4 text-[#b08a16]" />
                  <p className="mt-3 text-sm font-bold text-[#071a2f]">{selected.project.price}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Visible price</p>
                </div>
                <div className="rounded-2xl bg-[#f7f8fa] p-4">
                  <Clock3 className="size-4 text-[#b08a16]" />
                  <p className="mt-3 text-sm font-bold text-[#071a2f]">{emi ? `${formatRupees(emi)}/mo` : "Live quote needed"}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Indicative EMI*</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    <Check className="size-4" /> Why it fits
                  </p>
                  <ul className="mt-3 space-y-2 text-xs leading-5 text-emerald-950/70">
                    {selected.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                    <CircleAlert className="size-4" /> Verify before deciding
                  </p>
                  <ul className="mt-3 space-y-2 text-xs leading-5 text-amber-950/70">
                    {(selected.cautions.length ? selected.cautions : ["Confirm exact unit, tower and all-inclusive cost"]).map((caution) => <li key={caution}>• {caution}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/projects/${projectSlug(selected.project.name)}`}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white transition hover:bg-[#0d2948]"
                >
                  Open full project intelligence
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <a
                  href={`https://wa.me/919019697170?text=${advisorMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Ask advisor with my context
                </a>
              </div>
              <p className="mt-4 text-[9px] leading-5 text-slate-400">
                *EMI assumes the visible starting price, 20% down payment, 8.5% interest and 20 years. It is not a loan offer. Fit scores are decision-support signals, not investment predictions.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-[#f7f8fa] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b08a16]">Ranked decision board</p>
              <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">Six options. Trade-offs visible.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={compareTopMatches} className="inline-flex h-11 items-center rounded-full border border-[#071a2f]/15 bg-white px-5 text-xs font-bold text-[#071a2f] transition hover:border-[#c9a227]">
                <GitCompareArrows className="mr-2 size-4 text-[#b08a16]" /> Compare top two
              </button>
              <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center rounded-full border border-[#071a2f]/15 bg-white px-5 text-xs font-bold text-[#071a2f] transition hover:border-[#c9a227]">
                <Download className="mr-2 size-4 text-[#b08a16]" /> Save decision brief
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {ranked.map((item, index) => {
              const slug = projectSlug(item.project.name);
              const active = slug === projectSlug(selected.project.name);
              return (
                <button
                  key={item.project.name}
                  type="button"
                  onClick={() => setSelectedSlug(slug)}
                  className={`group grid grid-cols-[92px_1fr_auto] items-center gap-4 rounded-[1.4rem] border p-3 text-left transition sm:grid-cols-[112px_1fr_auto] ${
                    active
                      ? "border-[#c9a227] bg-white shadow-[0_15px_45px_rgba(7,26,47,.1)]"
                      : "border-slate-200 bg-white/70 hover:-translate-y-0.5 hover:border-[#c9a227]/45"
                  }`}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-slate-200">
                    <Image src={item.project.image} alt="" fill className="object-cover" sizes="112px" />
                    <span className="absolute left-2 top-2 rounded-full bg-[#071a2f]/85 px-2 py-1 text-[9px] font-extrabold text-white">#{index + 1}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-[#071a2f]">{item.project.name}</span>
                    <span className="mt-1 block truncate text-[10px] text-slate-400">{item.project.developer} · {item.project.location}</span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {item.reasons.slice(0, 2).map((reason) => (
                        <span key={reason} className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-bold text-slate-500">{reason}</span>
                      ))}
                    </span>
                  </span>
                  <span className="pr-2 text-right">
                    <span className="block text-2xl font-extrabold text-[#071a2f]">{item.score}</span>
                    <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">Fit</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Target, title: "Personal, not generic", text: "Rankings change with your budget, corridor, timeline and decision style." },
            { icon: BadgeCheck, title: "Confidence separated", text: "Project fit and data completeness are scored separately so uncertainty stays visible." },
            { icon: BriefcaseBusiness, title: "Advisor-ready context", text: "Your shortlist and priorities travel with you when you call or message Asher Realty." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
              <Icon className="size-5 text-[#b08a16]" />
              <h3 className="mt-4 text-lg font-bold text-[#071a2f]">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
