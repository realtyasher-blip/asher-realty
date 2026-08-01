"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  Check,
  GitCompareArrows,
  Heart,
  IndianRupee,
  MapPin,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import {
  BUYER_PROFILE_EVENT,
  defaultBuyerPreferences,
  readBuyerPreferences,
  writeBuyerPreferences,
  type BuyerPreferences,
} from "@/lib/buyerProfile";
import {
  BUYER_WORKSPACE_EVENT,
  COMPARISON_KEY,
  FAVOURITES_KEY,
  readBuyerWorkspace,
  toggleBuyerWorkspaceItem,
  type BuyerWorkspaceSnapshot,
} from "@/lib/buyerWorkspace";
import { cn } from "@/lib/utils";

const emptyWorkspace: BuyerWorkspaceSnapshot = {
  favourites: [],
  comparison: [],
  recent: [],
};

const corridorOptions = [
  "Flexible",
  "East Bengaluru",
  "North Bengaluru",
  "South Bengaluru",
  "Central Bengaluru",
];
const configurationOptions = ["1", "2", "3", "4"];
const budgetOptions = ["Flexible", "Up to ₹2 Cr", "₹2–3 Cr", "₹3 Cr+"];

export default function MyHomeSearch() {
  const [workspace, setWorkspace] = useState(emptyWorkspace);
  const [preferences, setPreferences] =
    useState<BuyerPreferences>(defaultBuyerPreferences);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const sync = () => {
      setWorkspace(readBuyerWorkspace());
      setPreferences(readBuyerPreferences());
    };
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(BUYER_WORKSPACE_EVENT, sync);
    window.addEventListener(BUYER_PROFILE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_WORKSPACE_EVENT, sync);
      window.removeEventListener(BUYER_PROFILE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const savedProjects = useMemo(
    () =>
      workspace.favourites
        .map((slug) => projects.find((project) => projectSlug(project.name) === slug))
        .filter((project): project is (typeof projects)[number] => Boolean(project)),
    [workspace.favourites]
  );

  const recentProjects = useMemo(
    () =>
      workspace.recent
        .map((slug) => projects.find((project) => projectSlug(project.name) === slug))
        .filter((project): project is (typeof projects)[number] => Boolean(project))
        .slice(0, 4),
    [workspace.recent]
  );

  const currentStep = !preferences.customized
    ? 1
    : savedProjects.length === 0
      ? 2
      : workspace.comparison.length < 2
        ? 3
        : 4;

  const nextAction =
    currentStep === 1
      ? { href: "#preferences", label: "Set my preferences", text: "Tell us area, budget and home size." }
      : currentStep === 2
        ? { href: "/projects", label: "Find homes", text: "Save the homes that look promising." }
        : currentStep === 3
          ? { href: "/projects?saved=1", label: "Choose two to compare", text: "Narrow your saved list to the strongest two." }
          : { href: "/book-site-visit", label: "Plan site visits", text: "Visit only the homes worth seeing in person." };

  function savePreferences() {
    const next = { ...preferences, customized: true };
    writeBuyerPreferences(next);
    setPreferences(next);
    setSavedMessage("Preferences saved. Your project matches are now personalised.");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function removeSaved(slug: string) {
    const favourites = toggleBuyerWorkspaceItem(FAVOURITES_KEY, slug);
    setWorkspace((current) => ({ ...current, favourites }));
  }

  function toggleComparison(slug: string) {
    const comparison = toggleBuyerWorkspaceItem(COMPARISON_KEY, slug, {
      maxItems: 2,
    });
    setWorkspace((current) => ({ ...current, comparison }));
  }

  return (
    <div>
      <section className="overflow-hidden rounded-[2rem] bg-[#071a2f] text-white shadow-[0_24px_80px_rgba(7,26,47,.16)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
              Your next best step
            </p>
            <h2 className="mt-3 text-3xl font-semibold">{nextAction.text}</h2>
            <p className="mt-3 text-sm leading-7 text-white/55">
              One clear task at a time. Your saved homes stay on this device.
            </p>
          </div>
          <Link
            href={nextAction.href}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            {nextAction.label}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-4 border-t border-white/10 bg-white/[0.04]">
          {[
            { number: 1, label: "Preferences", icon: SlidersHorizontal },
            { number: 2, label: "Save homes", icon: Heart },
            { number: 3, label: "Compare", icon: GitCompareArrows },
            { number: 4, label: "Visit", icon: CalendarCheck },
          ].map(({ number, label, icon: Icon }) => {
            const complete = currentStep > number;
            const active = currentStep === number;
            return (
              <div key={label} className="border-white/10 px-2 py-4 text-center not-last:border-r sm:px-4">
                <span className={cn("mx-auto flex size-8 items-center justify-center rounded-full", complete ? "bg-emerald-400 text-[#071a2f]" : active ? "bg-[#c9a227] text-[#071a2f]" : "bg-white/[0.07] text-white/35") }>
                  {complete ? <Check className="size-4" /> : <Icon className="size-4" />}
                </span>
                <p className={cn("mt-2 text-[9px] font-bold uppercase tracking-[0.1em]", active || complete ? "text-white" : "text-white/30") }>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="preferences" className="mt-7 scroll-mt-28 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(7,26,47,.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">My preferences</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#071a2f]">Three answers are enough to begin.</h2>
          </div>
          {preferences.customized && (
            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              <Check className="mr-2 size-4" /> Active
            </span>
          )}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <label>
            <span className="flex items-center gap-2 text-sm font-semibold text-[#071a2f]"><MapPin className="size-4 text-[#a47b10]" />Preferred area</span>
            <select value={preferences.corridor} onChange={(event) => setPreferences((current) => ({ ...current, corridor: event.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]">
              {corridorOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span className="flex items-center gap-2 text-sm font-semibold text-[#071a2f]"><BedDouble className="size-4 text-[#a47b10]" />Home size</span>
            <select value={preferences.configuration} onChange={(event) => setPreferences((current) => ({ ...current, configuration: event.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]">
              {configurationOptions.map((option) => <option key={option} value={option}>{option} BHK</option>)}
            </select>
          </label>
          <label>
            <span className="flex items-center gap-2 text-sm font-semibold text-[#071a2f]"><IndianRupee className="size-4 text-[#a47b10]" />Budget</span>
            <select value={preferences.budget} onChange={(event) => setPreferences((current) => ({ ...current, budget: event.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]">
              {budgetOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={savePreferences} className="inline-flex h-12 items-center justify-center rounded-full bg-[#071a2f] px-6 text-sm font-bold text-white transition hover:bg-[#0d2948]">
            Save preferences
          </button>
          <p role="status" className="text-xs text-emerald-700">{savedMessage}</p>
        </div>
      </section>

      <section className="mt-7 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(7,26,47,.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">Saved homes</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#071a2f]">Your strongest possibilities.</h2>
          </div>
          <Link href="/projects" className="inline-flex w-fit items-center text-sm font-bold text-[#071a2f] hover:text-[#a47b10]">
            <Search className="mr-2 size-4" /> Find more homes
          </Link>
        </div>

        {savedProjects.length ? (
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {savedProjects.map((project) => {
              const slug = projectSlug(project.name);
              const compared = workspace.comparison.includes(slug);
              return (
                <article key={project.name} className="grid grid-cols-[104px_1fr] gap-4 rounded-2xl border border-slate-200 p-3 sm:grid-cols-[132px_1fr]">
                  <Link href={`/projects/${slug}`} className="relative min-h-28 overflow-hidden rounded-xl">
                    <Image src={project.image} alt={project.name} fill className="object-cover" sizes="132px" />
                  </Link>
                  <div className="min-w-0 py-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a47b10]">{project.developer}</p>
                    <Link href={`/projects/${slug}`} className="mt-1 block truncate text-lg font-bold text-[#071a2f] hover:text-[#a47b10]">{project.name}</Link>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{project.location}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => toggleComparison(slug)} className={cn("inline-flex h-9 items-center rounded-full border px-3 text-[10px] font-bold", compared ? "border-[#c9a227] bg-[#fff7dc] text-[#7a5b08]" : "border-slate-200 text-slate-500") }>
                        <GitCompareArrows className="mr-1.5 size-3.5" />{compared ? "Added" : "Compare"}
                      </button>
                      <button type="button" onClick={() => removeSaved(slug)} className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-500" aria-label={`Remove ${project.name} from saved homes`}>
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-[#f7f8fa] px-6 py-12 text-center">
            <Heart className="mx-auto size-8 text-[#c9a227]" />
            <h3 className="mt-4 text-2xl font-semibold text-[#071a2f]">No saved homes yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">Save promising projects as you browse. They&apos;ll appear here automatically.</p>
            <Link href="/projects" className="mt-5 inline-flex h-11 items-center rounded-full bg-[#071a2f] px-5 text-sm font-bold text-white">Browse homes</Link>
          </div>
        )}

        {workspace.comparison.length === 2 && (
          <Link href={`/compare?projects=${workspace.comparison.join(",")}`} className="mt-6 flex items-center justify-between rounded-2xl bg-[#fff8df] p-5 text-[#071a2f] transition hover:bg-[#fff1bd]">
            <span className="flex items-center gap-3 font-bold"><GitCompareArrows className="size-5 text-[#a47b10]" />Your two-home comparison is ready</span>
            <ArrowRight className="size-5" />
          </Link>
        )}
      </section>

      {recentProjects.length > 0 && (
        <section className="mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Recently viewed</p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {recentProjects.map((project) => (
              <Link key={project.name} href={`/projects/${projectSlug(project.name)}`} className="flex min-w-[230px] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-[#071a2f] transition hover:border-[#c9a227]">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-xl"><Image src={project.image} alt="" fill className="object-cover" sizes="48px" /></span>
                <span className="line-clamp-2">{project.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
