"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, GitCompareArrows, MessageCircle } from "lucide-react";

import { projectSlug, projects } from "@/data/projects";

export default function ProjectComparison() {
  const [firstName, setFirstName] = useState(projects[0]?.name ?? "");
  const [secondName, setSecondName] = useState(projects[1]?.name ?? "");

  const first = useMemo(
    () => projects.find((project) => project.name === firstName) ?? projects[0],
    [firstName]
  );
  const second = useMemo(
    () => projects.find((project) => project.name === secondName) ?? projects[1],
    [secondName]
  );

  if (!first || !second) return null;

  const rows = [
    ["Developer", first.developer, second.developer],
    ["Location", first.location, second.location],
    ["Configuration", first.configuration, second.configuration],
    ["Indicative price", first.price, second.price],
    ["Possession", first.possession || "Confirm current phase", second.possession || "Confirm current phase"],
    ["RERA", first.rera || "Confirm current phase", second.rera || "Confirm current phase"],
  ];

  const whatsappMessage = encodeURIComponent(
    `Hi Asher Realty, please help me compare ${first.name} and ${second.name}. Share current pricing, available units, floor plans and site-visit options.`
  );

  return (
    <section id="compare" className="overflow-hidden bg-white py-24 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#071a2f]">
              <GitCompareArrows className="size-5 text-[#e4c462]" />
            </span>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.26em] text-[#b08a16]">
              Compare projects
            </p>
            <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              See the difference before the site visit.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              Put two shortlisted properties side by side and focus on the
              details that affect your decision.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Project one", value: firstName, setter: setFirstName, other: secondName },
              { label: "Project two", value: secondName, setter: setSecondName, other: firstName },
            ].map(({ label, value, setter, other }) => (
              <label key={label} className="rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {label}
                </span>
                <select
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-semibold text-[#071a2f] outline-none"
                >
                  {projects.map((project) => (
                    <option key={project.name} value={project.name} disabled={project.name === other}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f7f8fa] shadow-[0_24px_80px_rgba(7,26,47,.08)]">
          <div className="grid grid-cols-[0.55fr_1fr_1fr] border-b border-slate-200 bg-[#071a2f] text-white">
            <div className="hidden p-5 sm:block" />
            {[first, second].map((project) => (
              <div key={project.name} className="border-l border-white/10 p-4 sm:p-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-800">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/75 to-transparent" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#e4c462]">
                  {project.developer}
                </p>
                <h3 className="mt-1 text-xl font-medium sm:text-3xl">{project.name}</h3>
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-200">
            {rows.map(([label, firstValue, secondValue]) => (
              <div key={label} className="grid grid-cols-[0.55fr_1fr_1fr]">
                <div className="p-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:p-5 sm:text-xs">
                  {label}
                </div>
                <div className="border-l border-slate-200 p-3 text-xs font-semibold leading-6 text-[#071a2f] sm:p-5 sm:text-sm">
                  {firstValue}
                </div>
                <div className="border-l border-slate-200 p-3 text-xs font-semibold leading-6 text-[#071a2f] sm:p-5 sm:text-sm">
                  {secondValue}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 border-t border-slate-200 bg-white p-5 md:grid-cols-2 md:p-7">
            {[first, second].map((project) => (
              <div key={project.name}>
                <div className="space-y-2.5">
                  {project.highlights.map((highlight) => (
                    <p key={highlight} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                      {highlight}
                    </p>
                  ))}
                </div>
                <Link
                  href={`/projects/${projectSlug(project.name)}`}
                  className="mt-5 inline-flex items-center text-sm font-bold text-[#071a2f] transition hover:text-[#b08a16]"
                >
                  Explore {project.name}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[1.5rem] bg-[#071a2f] px-6 py-6 text-center text-white sm:flex-row sm:text-left">
          <div>
            <p className="font-semibold">Want a human recommendation?</p>
            <p className="mt-1 text-sm text-white/55">
              We’ll explain the trade-offs and coordinate both site visits.
            </p>
          </div>
          <a
            href={`https://wa.me/919019697170?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            <MessageCircle className="mr-2 size-4" />
            Compare with an Advisor
          </a>
        </div>
      </div>
    </section>
  );
}
