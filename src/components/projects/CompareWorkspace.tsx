"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  GitCompareArrows,
  MessageCircle,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";

type CompareWorkspaceProps = {
  initialFirst?: string;
  initialSecond?: string;
};

function projectFromSlug(slug?: string) {
  return projects.find((project) => projectSlug(project.name) === slug);
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
  const [copied, setCopied] = useState(false);

  const first = useMemo(
    () => projects.find((project) => project.name === firstName) ?? projects[0],
    [firstName]
  );
  const second = useMemo(
    () => projects.find((project) => project.name === secondName) ?? projects[1],
    [secondName]
  );

  const rows = [
    ["Developer", first.developer, second.developer],
    ["Project stage", first.status, second.status],
    ["Corridor", first.corridor, second.corridor],
    ["Location", first.location, second.location],
    ["Configuration", first.configuration, second.configuration],
    ["Indicative price", first.price, second.price],
    ["Possession", first.possession || "Confirm current phase", second.possession || "Confirm current phase"],
    ["RERA", first.rera || "Confirm current phase", second.rera || "Confirm current phase"],
    ["Last verified", first.verifiedAt, second.verifiedAt],
  ];

  function updateUrl(firstProject: string, secondProject: string) {
    const url = new URL(window.location.href);
    const left = projects.find((project) => project.name === firstProject);
    const right = projects.find((project) => project.name === secondProject);
    if (left && right) {
      url.searchParams.set(
        "projects",
        `${projectSlug(left.name)},${projectSlug(right.name)}`
      );
      window.history.replaceState({}, "", url);
    }
  }

  async function copyComparison() {
    updateUrl(first.name, second.name);
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Asher Realty, please help me compare ${first.name} and ${second.name}. Share current pricing, unit availability, floor plans and site-visit options.`
  );

  return (
    <div>
      <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        {[
          { label: "Project one", value: firstName, setter: setFirstName, other: secondName },
          { label: "Project two", value: secondName, setter: setSecondName, other: firstName },
        ].map(({ label, value, setter, other }) => (
          <label key={label}>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {label}
            </span>
            <select
              value={value}
              onChange={(event) => {
                setter(event.target.value);
                updateUrl(
                  label === "Project one" ? event.target.value : firstName,
                  label === "Project two" ? event.target.value : secondName
                );
              }}
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

      <div className="mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(7,26,47,.09)]">
        <div className="grid grid-cols-[0.42fr_1fr_1fr] bg-[#071a2f] text-white">
          <div className="hidden p-5 sm:block">
            <GitCompareArrows className="size-6 text-[#e4c462]" />
          </div>
          {[first, second].map((project) => (
            <div key={project.name} className="border-l border-white/10 p-4 sm:p-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-800">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 36vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/70 to-transparent" />
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e4c462]">
                {project.developer}
              </p>
              <h2 className="mt-1 text-xl font-medium sm:text-3xl">{project.name}</h2>
            </div>
          ))}
        </div>

        <div className="divide-y divide-slate-200">
          {rows.map(([label, left, right]) => (
            <div key={label} className="grid grid-cols-[0.42fr_1fr_1fr]">
              <div className="p-3 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 sm:p-5 sm:text-xs">
                {label}
              </div>
              <div className="border-l border-slate-200 p-3 text-xs font-semibold leading-6 text-[#071a2f] sm:p-5 sm:text-sm">
                {left}
              </div>
              <div className="border-l border-slate-200 p-3 text-xs font-semibold leading-6 text-[#071a2f] sm:p-5 sm:text-sm">
                {right}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 border-t border-slate-200 bg-[#f7f8fa] p-5 md:grid-cols-2 md:p-7">
          {[first, second].map((project) => (
            <div key={project.name} className="rounded-2xl bg-white p-5">
              {project.highlights.map((highlight) => (
                <p key={highlight} className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-600 first:mt-0">
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

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
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
          Compare with an advisor
        </a>
      </div>
    </div>
  );
}
