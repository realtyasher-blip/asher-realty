"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Copy,
  GitCompareArrows,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { projectSlug, projects, type Project } from "@/data/projects";
import {
  COMPARISON_KEY,
  writeBuyerWorkspaceList,
} from "@/lib/buyerWorkspace";

type CompareWorkspaceProps = {
  initialFirst?: string;
  initialSecond?: string;
};

function projectFromSlug(slug?: string) {
  return projects.find((project) => projectSlug(project.name) === slug);
}

function priceKnown(project: Project) {
  return !/contact/i.test(project.price);
}

function scoreForBuyer(
  project: Project,
  purpose: string,
  priority: string
) {
  let score = 54;
  const reasons: string[] = [];

  if (project.rera) {
    score += 8;
    reasons.push("RERA detail available");
  }
  if (project.possession) {
    score += 7;
    reasons.push("Possession signal available");
  }
  if (priceKnown(project)) {
    score += 7;
    reasons.push("Indicative price published");
  }
  if (project.highlights.length >= 3) score += 5;

  if (
    purpose === "Investment" &&
    ["North Bengaluru", "East Bengaluru"].includes(project.corridor)
  ) {
    score += 9;
    reasons.push("Growth-corridor location");
  }
  if (purpose === "Self-use" && project.highlights.length >= 3) {
    score += 7;
    reasons.push("Strong lifestyle programme");
  }

  if (priority === "Move-in clarity" && project.possession && project.rera) {
    score += 10;
    reasons.push("Stronger delivery clarity");
  } else if (
    priority === "More space" &&
    (/4/.test(project.configuration) || project.unitSizes)
  ) {
    score += 10;
    reasons.push("Larger-home options");
  } else if (
    priority === "Lifestyle" &&
    ((project.amenities?.length || 0) >= 5 || project.highlights.length >= 3)
  ) {
    score += 10;
    reasons.push("Amenity-led fit");
  } else if (
    priority === "Growth corridor" &&
    ["North Bengaluru", "East Bengaluru"].includes(project.corridor)
  ) {
    score += 10;
    reasons.push("Infrastructure-led corridor");
  } else if (priority === "Balanced") {
    score += 5;
    reasons.push("Balanced decision signals");
  }

  return {
    score: Math.min(score, 96),
    reasons: reasons.slice(0, 3),
  };
}

export default function CompareWorkspace({
  initialFirst,
  initialSecond,
}: CompareWorkspaceProps) {
  const fallbackFirst = projectFromSlug(initialFirst) ?? projects[0];
  const fallbackSecond =
    projectFromSlug(initialSecond) ??
    projects.find((project) => project.name !== fallbackFirst.name) ??
    projects[1];

  const [firstName, setFirstName] = useState(fallbackFirst.name);
  const [secondName, setSecondName] = useState(fallbackSecond.name);
  const [purpose, setPurpose] = useState("Self-use");
  const [priority, setPriority] = useState("Balanced");
  const [copied, setCopied] = useState(false);

  const first = useMemo(
    () => projects.find((project) => project.name === firstName) ?? projects[0],
    [firstName]
  );
  const second = useMemo(
    () => projects.find((project) => project.name === secondName) ?? projects[1],
    [secondName]
  );

  const firstFit = useMemo(
    () => scoreForBuyer(first, purpose, priority),
    [first, priority, purpose]
  );
  const secondFit = useMemo(
    () => scoreForBuyer(second, purpose, priority),
    [priority, purpose, second]
  );

  const rows = [
    { label: "Developer", left: first.developer, right: second.developer },
    { label: "Project stage", left: first.status, right: second.status },
    { label: "Corridor", left: first.corridor, right: second.corridor },
    { label: "Location", left: first.location, right: second.location },
    {
      label: "Configuration",
      left: first.configuration,
      right: second.configuration,
    },
    { label: "Indicative price", left: first.price, right: second.price },
    {
      label: "Possession",
      left: first.possession || "Confirm current phase",
      right: second.possession || "Confirm current phase",
    },
    {
      label: "RERA",
      left: first.rera || "Confirm current phase",
      right: second.rera || "Confirm current phase",
    },
    { label: "Last verified", left: first.verifiedAt, right: second.verifiedAt },
  ];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const slugs = [projectSlug(first.name), projectSlug(second.name)];
      writeBuyerWorkspaceList(COMPARISON_KEY, slugs);
      const url = new URL(window.location.href);
      url.searchParams.set("projects", slugs.join(","));
      window.history.replaceState({}, "", url);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [first.name, second.name]);

  async function copyComparison() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function swapProjects() {
    setFirstName(second.name);
    setSecondName(first.name);
  }

  const winner =
    firstFit.score === secondFit.score
      ? null
      : firstFit.score > secondFit.score
        ? first
        : second;

  const whatsappMessage = encodeURIComponent(
    `Hi Asher Realty, please help me compare ${first.name} and ${second.name}. I am buying for ${purpose.toLowerCase()} and my priority is ${priority.toLowerCase()}. Share current pricing, unit availability, floor plans and site-visit options.`
  );

  return (
    <div>
      <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Project one",
              value: firstName,
              setter: setFirstName,
              other: secondName,
            },
            {
              label: "Project two",
              value: secondName,
              setter: setSecondName,
              other: firstName,
            },
          ].map(({ label, value, setter, other }) => (
            <label key={label}>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {label}
              </span>
              <select
                value={value}
                onChange={(event) => setter(event.target.value)}
                className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#071a2f] outline-none focus:border-[#c9a227]"
              >
                {projects.map((project) => (
                  <option
                    key={project.name}
                    value={project.name}
                    disabled={project.name === other}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={swapProjects}
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-xs font-bold text-slate-500 transition hover:border-[#c9a227] hover:text-[#071a2f]"
          >
            <GitCompareArrows className="mr-2 size-4 text-[#b08a16]" />
            Swap projects
          </button>
        </div>
      </div>

      <section className="mt-7 overflow-hidden rounded-[2rem] bg-[#071a2f] text-white shadow-[0_24px_80px_rgba(7,26,47,.16)]">
        <div className="grid lg:grid-cols-[.7fr_1.3fr]">
          <div className="p-6 sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e4c462]">
              <Sparkles className="size-4" />
              Asher decision lens
            </span>
            <h2 className="mt-5 text-3xl font-medium sm:text-4xl">
              Compare for your priorities.
            </h2>
            <p className="mt-4 text-xs leading-6 text-white/50">
              Adjust the lens to see which project has stronger catalogue
              signals for your stated goal. Live pricing and inventory still
              require advisor verification.
            </p>
          </div>
          <div className="grid gap-4 border-t border-white/10 bg-white/[0.05] p-6 sm:grid-cols-2 lg:border-l lg:border-t-0">
            <label>
              <span className="text-xs font-semibold text-white/50">
                Buying for
              </span>
              <select
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#061727] px-4 text-sm font-semibold text-white outline-none focus:border-[#c9a227]"
              >
                <option>Self-use</option>
                <option>Investment</option>
              </select>
            </label>
            <label>
              <span className="text-xs font-semibold text-white/50">
                Top priority
              </span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#061727] px-4 text-sm font-semibold text-white outline-none focus:border-[#c9a227]"
              >
                <option>Balanced</option>
                <option>Move-in clarity</option>
                <option>More space</option>
                <option>Lifestyle</option>
                <option>Growth corridor</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-2 sm:p-7">
          {[
            { project: first, fit: firstFit },
            { project: second, fit: secondFit },
          ].map(({ project, fit }) => (
            <article
              key={project.name}
              className={`rounded-[1.4rem] border p-5 ${
                winner?.name === project.name
                  ? "border-[#c9a227]/60 bg-[#c9a227]/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                    Catalogue fit
                  </p>
                  <h3 className="mt-2 text-xl font-medium">{project.name}</h3>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300">
                  {fit.score}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c9a227] to-[#f0d477]"
                  style={{ width: `${fit.score}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {fit.reasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[10px] font-semibold text-white/60"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/48">
          {winner ? (
            <span className="inline-flex items-center">
              <Target className="mr-2 size-4 text-[#e4c462]" />
              <strong className="mr-1 text-white">{winner.name}</strong> currently
              shows the stronger fit for this lens.
            </span>
          ) : (
            <span className="inline-flex items-center">
              <ShieldCheck className="mr-2 size-4 text-[#e4c462]" />
              Both projects show an equally strong catalogue fit.
            </span>
          )}
        </div>
      </section>

      <div className="mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(7,26,47,.09)]">
        <div className="grid grid-cols-2 bg-[#071a2f] text-white sm:grid-cols-[.42fr_1fr_1fr]">
          <div className="hidden p-5 sm:block">
            <GitCompareArrows className="size-6 text-[#e4c462]" />
          </div>
          {[first, second].map((project) => (
            <div
              key={project.name}
              className="border-l border-white/10 p-4 sm:p-6"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-800">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 36vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/70 to-transparent" />
              </div>
              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.12em] text-[#e4c462] sm:text-[10px]">
                {project.developer}
              </p>
              <h2 className="mt-1 text-lg font-medium sm:text-3xl">
                {project.name}
              </h2>
            </div>
          ))}
        </div>

        <div className="divide-y divide-slate-200">
          {rows.map(({ label, left, right }) => {
            const different = left !== right;
            return (
              <div
                key={label}
                className="grid grid-cols-2 sm:grid-cols-[.42fr_1fr_1fr]"
              >
                <div className="col-span-2 flex items-center justify-between border-b border-slate-100 bg-[#f8f9fa] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 sm:col-span-1 sm:border-b-0 sm:bg-white sm:p-5 sm:text-xs">
                  {label}
                  {different && (
                    <span className="rounded-full bg-[#fff7dc] px-2 py-1 text-[8px] text-[#8a6708]">
                      Different
                    </span>
                  )}
                </div>
                <div
                  className={`border-l border-slate-200 p-4 text-xs font-semibold leading-6 text-[#071a2f] sm:p-5 sm:text-sm ${
                    different ? "bg-[#fffdf5]" : ""
                  }`}
                >
                  {left}
                </div>
                <div
                  className={`border-l border-slate-200 p-4 text-xs font-semibold leading-6 text-[#071a2f] sm:p-5 sm:text-sm ${
                    different ? "bg-[#fffdf5]" : ""
                  }`}
                >
                  {right}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 border-t border-slate-200 bg-[#f7f8fa] p-5 md:grid-cols-2 md:p-7">
          {[first, second].map((project) => (
            <div key={project.name} className="rounded-2xl bg-white p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#b08a16]">
                Why shortlist
              </p>
              {project.highlights.map((highlight) => (
                <p
                  key={highlight}
                  className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-600 first:mt-0"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                  {highlight}
                </p>
              ))}
              <Link
                href={`/projects/${projectSlug(project.name)}`}
                className="mt-5 inline-flex items-center text-sm font-bold text-[#071a2f] hover:text-[#b08a16]"
              >
                Explore {project.name}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-7 grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Verify inventory",
            text: "Confirm the exact tower, stack and available unit.",
          },
          {
            icon: CalendarClock,
            title: "Check delivery",
            text: "Map possession and RERA to the selected phase.",
          },
          {
            icon: MessageCircle,
            title: "Compare all-in cost",
            text: "Review cost sheets, payment plans and extras.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl bg-[#f7f8fa] p-5">
            <Icon className="size-5 text-[#b08a16]" />
            <p className="mt-4 text-sm font-bold text-[#071a2f]">{title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
          </div>
        ))}
      </section>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => {
            setPurpose("Self-use");
            setPriority("Balanced");
          }}
          className="inline-flex h-13 items-center justify-center rounded-full border border-[#071a2f]/15 bg-white px-6 text-sm font-semibold text-[#071a2f] transition hover:border-[#c9a227]"
        >
          <RotateCcw className="mr-2 size-4" />
          Reset decision lens
        </button>
        <button
          type="button"
          onClick={copyComparison}
          className="inline-flex h-13 items-center justify-center rounded-full border border-[#071a2f]/15 bg-white px-6 text-sm font-semibold text-[#071a2f] transition hover:border-[#c9a227]"
        >
          {copied ? (
            <CheckCircle2 className="mr-2 size-4 text-emerald-600" />
          ) : (
            <Copy className="mr-2 size-4" />
          )}
          {copied ? "Comparison link copied" : "Copy shareable comparison"}
        </button>
        <a
          href={`https://wa.me/919019697170?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
        >
          <MessageCircle className="mr-2 size-4" />
          Verify with an advisor
        </a>
      </div>
    </div>
  );
}
