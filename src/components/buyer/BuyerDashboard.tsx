"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Check,
  ChevronRight,
  Clock3,
  GitCompareArrows,
  Heart,
  IndianRupee,
  MapPin,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

import { projectSlug, projects, type Project } from "@/data/projects";
import {
  buyerPreferenceOptions,
  defaultBuyerPreferences,
  readBuyerPreferences,
  scoreProject,
  writeBuyerPreferences,
  type BuyerPreferenceField,
  type BuyerPreferences,
} from "@/lib/buyerProfile";
import {
  COMPARISON_KEY,
  FAVOURITES_KEY,
  RECENT_KEY,
  writeBuyerWorkspaceList,
} from "@/lib/buyerWorkspace";

function parseStoredArray(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function MiniProjectCard({
  project,
  action,
}: {
  project: Project;
  action?: React.ReactNode;
}) {
  const slug = projectSlug(project.name);

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(7,26,47,.06)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 86vw, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/75 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#071a2f]">
          {project.status}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#e4c462]">
            {project.developer}
          </p>
          <h3 className="mt-1 text-2xl font-medium text-white">{project.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
          <MapPin className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
          {project.location}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={`/projects/${slug}`}
            className="inline-flex items-center text-sm font-bold text-[#071a2f] hover:text-[#b08a16]"
          >
            View project <ArrowRight className="ml-2 size-4" />
          </Link>
          {action}
        </div>
      </div>
    </article>
  );
}

export default function BuyerDashboard() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [lastComparison, setLastComparison] = useState<string[]>([]);
  const [preferences, setPreferences] =
    useState<BuyerPreferences>(defaultBuyerPreferences);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSavedSlugs(parseStoredArray(FAVOURITES_KEY));
      setRecentSlugs(parseStoredArray(RECENT_KEY));
      setLastComparison(parseStoredArray(COMPARISON_KEY));
      setPreferences(readBuyerPreferences());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const savedProjects = useMemo(
    () =>
      savedSlugs
        .map((slug) => projects.find((project) => projectSlug(project.name) === slug))
        .filter((project): project is Project => Boolean(project)),
    [savedSlugs]
  );

  const recentProjects = useMemo(
    () =>
      recentSlugs
        .map((slug) => projects.find((project) => projectSlug(project.name) === slug))
        .filter((project): project is Project => Boolean(project)),
    [recentSlugs]
  );

  const recommendations = useMemo(
    () =>
      projects
        .map((project) => scoreProject(project, preferences))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [preferences]
  );

  function updatePreference<K extends BuyerPreferenceField>(
    key: K,
    value: BuyerPreferences[K]
  ) {
    const next = { ...preferences, [key]: value, customized: true };
    setPreferences(next);
    writeBuyerPreferences(next);
  }

  function removeSaved(slug: string) {
    const next = savedSlugs.filter((item) => item !== slug);
    setSavedSlugs(next);
    writeBuyerWorkspaceList(FAVOURITES_KEY, next);
  }

  function resetSearch() {
    setPreferences(defaultBuyerPreferences);
    writeBuyerPreferences(defaultBuyerPreferences);
  }

  const compareSlugs = savedSlugs.slice(0, 2);
  const journeyStep = lastComparison.length >= 2 ? 3 : savedSlugs.length ? 2 : 1;

  if (!ready) {
    return (
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-[1.75rem] bg-slate-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Heart,
            value: savedProjects.length,
            label: "Saved homes",
            description: savedProjects.length
              ? "Ready for deeper comparison"
              : "Save homes while browsing",
          },
          {
            icon: Clock3,
            value: recentProjects.length,
            label: "Recently viewed",
            description: "Continue without searching again",
          },
          {
            icon: Target,
            value: `${recommendations[0]?.score || 0}%`,
            label: "Top catalogue fit",
            description: recommendations[0]?.project.name || "Set your preferences",
          },
        ].map(({ icon: Icon, value, label, description }) => (
          <div
            key={label}
            className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_15px_45px_rgba(7,26,47,.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-4xl font-medium text-[#071a2f]">{value}</p>
                <p className="mt-2 text-sm font-bold text-[#071a2f]">{label}</p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#fff7dc]">
                <Icon className="size-5 text-[#b08a16]" />
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">{description}</p>
          </div>
        ))}
      </section>

      <section id="buyer-profile" className="scroll-mt-28 overflow-hidden rounded-[2rem] bg-[#071a2f] text-white shadow-[0_25px_90px_rgba(7,26,47,.16)]">
        <div className="grid lg:grid-cols-[.72fr_1.28fr]">
          <div className="p-7 sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#e4c462]">
              <Sparkles className="size-4" />
              My buyer profile
            </span>
            <h2 className="mt-6 text-4xl font-medium sm:text-5xl">
              Make every shortlist more relevant.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/55">
              Your commute anchor, move-in plan and buying priorities now shape
              fit scores across the entire platform. Your brief stays on this
              device; no account or financial documents are required.
            </p>
            <button
              type="button"
              onClick={resetSearch}
              className="mt-7 inline-flex items-center text-xs font-bold text-white/55 transition hover:text-white"
            >
              <RotateCcw className="mr-2 size-4" />
              Reset preferences
            </button>
          </div>
          <div className="grid gap-4 border-t border-white/10 bg-white/[0.05] p-6 sm:grid-cols-2 sm:p-8 lg:border-l lg:border-t-0">
            {buyerPreferenceOptions.map(({ label, key, options }) => (
              <label key={key}>
                <span className="text-xs font-semibold text-white/50">{label}</span>
                <select
                  value={preferences[key]}
                  onChange={(event) => updatePreference(key, event.target.value)}
                  className="mt-2 h-13 w-full rounded-xl border border-white/10 bg-[#061727] px-4 text-sm font-semibold text-white outline-none focus:border-[#c9a227]"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {key === "configuration" ? `${option} BHK` : option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a16]">
              Personalised catalogue
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f] sm:text-5xl">
              Best matches for your profile
            </h2>
          </div>
          <Link
            href="/decision-lab"
            className="inline-flex items-center text-sm font-bold text-[#071a2f] hover:text-[#b08a16]"
          >
            Open the Buyer Decision Lab <ChevronRight className="ml-1 size-4" />
          </Link>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          {recommendations.map(({ project, score, reasons }, index) => (
            <article
              key={project.name}
              className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_15px_50px_rgba(7,26,47,.07)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/80 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-[#071a2f]/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
                  #{index + 1} match
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  {score}% fit
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#e4c462]">
                    {project.developer}
                  </p>
                  <h3 className="mt-1 text-2xl font-medium text-white">
                    {project.name}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full bg-[#f4f5f7] px-3 py-1.5 text-[10px] font-semibold text-slate-500"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-500">
                  <span className="flex gap-2">
                    <BedDouble className="size-4 shrink-0 text-[#b08a16]" />
                    {project.configuration}
                  </span>
                  <span className="flex gap-2">
                    <IndianRupee className="size-4 shrink-0 text-[#b08a16]" />
                    {project.price}
                  </span>
                </div>
                <Link
                  href={`/projects/${projectSlug(project.name)}`}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#071a2f] text-sm font-bold text-white transition hover:bg-[#0d2948]"
                >
                  Explore this match <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a16]">
                Your shortlist
              </p>
              <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
                Saved homes
              </h2>
            </div>
            {compareSlugs.length >= 2 && (
              <Link
                href={`/compare?projects=${compareSlugs.join(",")}`}
                className="hidden items-center text-sm font-bold text-[#071a2f] hover:text-[#b08a16] sm:inline-flex"
              >
                <GitCompareArrows className="mr-2 size-4" />
                Compare first two
              </Link>
            )}
          </div>

          {savedProjects.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {savedProjects.slice(0, 4).map((project) => {
                const slug = projectSlug(project.name);
                return (
                  <MiniProjectCard
                    key={project.name}
                    project={project}
                    action={
                      <button
                        type="button"
                        onClick={() => removeSaved(slug)}
                        aria-label={`Remove ${project.name} from saved homes`}
                        className="flex size-9 items-center justify-center rounded-full bg-rose-50 text-rose-500"
                      >
                        <Heart className="size-4 fill-current" />
                      </button>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center">
              <Heart className="mx-auto size-8 text-[#c9a227]" />
              <h3 className="mt-4 text-2xl font-medium text-[#071a2f]">
                Your shortlist is waiting
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                Tap the heart on any project to bring it here for comparison.
              </p>
              <Link
                href="/projects"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#071a2f] px-6 text-sm font-bold text-white"
              >
                Explore projects
              </Link>
            </div>
          )}
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(7,26,47,.06)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a16]">
            Buying journey
          </p>
          <h2 className="mt-3 text-3xl font-medium text-[#071a2f]">
            Your next best step
          </h2>
          <div className="mt-7 space-y-5">
            {[
              ["Discover", "Explore projects that fit your brief"],
              ["Shortlist", "Save the strongest candidates"],
              ["Compare", "Review trade-offs side by side"],
              ["Visit", "Verify the home and location in person"],
            ].map(([label, text], index) => {
              const step = index + 1;
              const complete = step < journeyStep;
              const active = step === journeyStep;
              return (
                <div key={label} className="flex gap-4">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      complete
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : active
                          ? "border-[#c9a227] bg-[#fff7dc] text-[#8a6708]"
                          : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {complete ? <Check className="size-4" /> : step}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#071a2f]">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href={
              journeyStep === 1
                ? "/projects"
                : journeyStep === 2
                  ? compareSlugs.length >= 2
                    ? `/compare?projects=${compareSlugs.join(",")}`
                    : "/projects?saved=1"
                  : "/book-site-visit"
            }
            className="mt-8 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            Continue my journey <ArrowRight className="ml-2 size-4" />
          </Link>
        </aside>
      </section>

      {recentProjects.length > 0 && (
        <section>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a16]">
              Continue browsing
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              Recently viewed
            </h2>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.slice(0, 3).map((project) => (
              <MiniProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[2rem] bg-[#071a2f] p-7 text-white sm:p-10 lg:flex lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4c462]">
            Human verification
          </p>
          <h2 className="mt-3 text-3xl font-medium sm:text-4xl">
            Turn your digital shortlist into a confident site visit.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            We will verify live inventory, current cost sheets and visit
            availability for the projects you choose.
          </p>
        </div>
        <Link
          href="/book-site-visit"
          className="mt-7 inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-8 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462] lg:mt-0"
        >
          Plan a guided visit <ArrowRight className="ml-2 size-4" />
        </Link>
      </section>
    </div>
  );
}
