"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Check,
  ClipboardCheck,
  MapPin,
  Route,
  ShieldCheck,
} from "lucide-react";

import { projectSlug, projects, type Project } from "@/data/projects";
import {
  BUYER_PROFILE_EVENT,
  buyerBriefSummary,
  defaultBuyerPreferences,
  readBuyerPreferences,
  type BuyerPreferences,
} from "@/lib/buyerProfile";
import {
  BUYER_WORKSPACE_EVENT,
  readBuyerWorkspace,
} from "@/lib/buyerWorkspace";

const CHECKLIST_KEY = "asher-buyer-verification-checklist";
const CHECKLIST_EVENT = "asher:verification-checklist-updated";

const checklist = [
  "Phase RERA matched to the exact tower",
  "All-inclusive cost sheet received",
  "Carpet area compared with saleable area",
  "Peak-hour commute tested in person",
  "Legal and approval document list received",
  "EMI plus emergency buffer stress-tested",
];

function readCheckedItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "[]");
    return Array.isArray(stored)
      ? stored.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function groupByCorridor(selected: Project[]) {
  return selected.reduce<Record<string, Project[]>>((groups, project) => {
    groups[project.corridor] = [...(groups[project.corridor] || []), project];
    return groups;
  }, {});
}

export default function BuyerDecisionToolkit() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [preferences, setPreferences] =
    useState<BuyerPreferences>(defaultBuyerPreferences);

  useEffect(() => {
    const sync = () => {
      setSavedSlugs(readBuyerWorkspace().favourites);
      setChecked(readCheckedItems());
      setPreferences(readBuyerPreferences());
    };
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(BUYER_WORKSPACE_EVENT, sync);
    window.addEventListener(BUYER_PROFILE_EVENT, sync);
    window.addEventListener(CHECKLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_WORKSPACE_EVENT, sync);
      window.removeEventListener(BUYER_PROFILE_EVENT, sync);
      window.removeEventListener(CHECKLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const savedProjects = useMemo(
    () =>
      savedSlugs
        .map((slug) => projects.find((project) => projectSlug(project.name) === slug))
        .filter((project): project is Project => Boolean(project)),
    [savedSlugs]
  );
  const grouped = groupByCorridor(savedProjects);
  const suggestedGroup = Object.entries(grouped).sort(
    ([, left], [, right]) => right.length - left.length
  )[0];
  const visitProjects = suggestedGroup?.[1].slice(0, 3) || savedProjects.slice(0, 3);
  const progress = Math.round((checked.length / checklist.length) * 100);
  const brief = buyerBriefSummary(preferences) || "Flexible Bengaluru search";
  const watchMessage = encodeURIComponent(
    `Hi Asher Realty, please create a verified price and inventory watch for my buyer brief: ${brief}. Saved projects: ${
      savedProjects.map((project) => project.name).join(", ") || "Please recommend suitable options"
    }.`
  );
  const visitMessage = encodeURIComponent(
    `Hi Asher Realty, please help me plan one efficient guided site-visit route for: ${
      visitProjects.map((project) => project.name).join(", ") || "my shortlisted Bengaluru projects"
    }.`
  );

  function toggleCheck(item: string) {
    const next = checked.includes(item)
      ? checked.filter((current) => current !== item)
      : [...checked, item];
    setChecked(next);
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
    } catch {
      // Checklist still works for the current session.
    }
    window.dispatchEvent(new CustomEvent(CHECKLIST_EVENT));
  }

  return (
    <section className="mt-12 space-y-7" aria-labelledby="buyer-toolkit-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a16]">
            Buyer operating system
          </p>
          <h2
            id="buyer-toolkit-title"
            className="mt-3 text-4xl font-medium text-[#071a2f] sm:text-5xl"
          >
            Turn a shortlist into a decision.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-500">
          Plan efficient visits, track verification work and ask for live price
          changes without rebuilding your search every time.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="overflow-hidden rounded-[2rem] bg-[#071a2f] p-7 text-white shadow-[0_24px_80px_rgba(7,26,47,.16)] sm:p-9">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                <Route className="size-4" /> Smart visit route
              </p>
              <h3 className="mt-4 text-3xl font-medium">One corridor. Less traffic. Better comparison.</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] text-white/45">
              {visitProjects.length} stops
            </span>
          </div>

          {visitProjects.length ? (
            <div className="mt-7 space-y-3">
              {visitProjects.map((project, index) => (
                <Link
                  key={project.name}
                  href={`/projects/${projectSlug(project.name)}`}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-[#c9a227]/40 hover:bg-white/[0.08]"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#c9a227] text-xs font-extrabold text-[#071a2f]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{project.name}</span>
                    <span className="mt-1 block truncate text-[10px] text-white/40">
                      {project.location}
                    </span>
                  </span>
                  <MapPin className="size-4 shrink-0 text-[#e4c462]" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-white/15 p-6 text-center">
              <MapPin className="mx-auto size-7 text-[#e4c462]" />
              <p className="mt-3 text-sm font-bold">Save two or three projects first</p>
              <p className="mt-2 text-xs leading-6 text-white/45">
                We will group the strongest same-corridor options into a cleaner
                visit plan.
              </p>
            </div>
          )}

          <a
            href={`https://wa.me/919019697170?text=${visitMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            <CalendarCheck className="mr-2 size-4" /> Plan this visit with an advisor
          </a>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(7,26,47,.07)] sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b08a16]">
                <ClipboardCheck className="size-4" /> Due-diligence tracker
              </p>
              <h3 className="mt-4 text-3xl font-medium text-[#071a2f]">
                Verify before you reserve.
              </h3>
            </div>
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#071a2f] text-lg font-extrabold text-[#e4c462]">
              {progress}%
            </span>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#315b7a] to-[#c9a227] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => {
              const complete = checked.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleCheck(item)}
                  aria-pressed={complete}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    complete
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 hover:border-[#c9a227]/50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                      complete ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-xs font-semibold leading-5 text-[#071a2f]">{item}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#f5f6f8] p-4">
            <ShieldCheck className="size-5 shrink-0 text-[#b08a16]" />
            <p className="text-xs leading-6 text-slate-500">
              Progress is stored only on this device. It is a planning aid, not
              a substitute for independent legal or financial advice.
            </p>
          </div>
        </article>
      </div>

      <article className="grid gap-6 rounded-[2rem] border border-[#c9a227]/25 bg-[#fffaf0] p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
            <BellRing className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a7410]">
              Price & inventory watch
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#071a2f]">
              Ask once. Track the projects that matter.
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{brief}</p>
          </div>
        </div>
        <a
          href={`https://wa.me/919019697170?text=${watchMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 items-center justify-center rounded-full bg-[#071a2f] px-7 text-sm font-bold text-white transition hover:bg-[#c9a227] hover:text-[#071a2f]"
        >
          <BellRing className="mr-2 size-4" /> Start my watch
          <ArrowRight className="ml-2 size-4" />
        </a>
      </article>
    </section>
  );
}
