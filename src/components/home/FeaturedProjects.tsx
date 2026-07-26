"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  MapPinned,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import { projects, type ProjectStatus } from "@/data/projects";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const builders = [
  "All builders",
  "SOBHA",
  "Prestige Group",
  "Assetz Property Group",
  "Sumadhura Group",
  "Brigade Group",
  "Lodha",
  "Godrej Properties",
  "Bhartiya Urban",
  "Birla Estates",
];

const stages: Array<"All active" | ProjectStatus> = [
  "All active",
  "Coming soon",
  "New launch",
  "Under construction",
  "Ready / active",
];

const corridors = [
  "All corridors",
  "East Bengaluru",
  "North Bengaluru",
  "South Bengaluru",
  "Central Bengaluru",
];

const generalWhatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20please%20help%20me%20compare%20active%20Bengaluru%20projects%20across%20builders.";

export default function FeaturedProjects() {
  const [builder, setBuilder] = useState("All builders");
  const [stage, setStage] = useState<(typeof stages)[number]>("All active");
  const [corridor, setCorridor] = useState("All corridors");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesBuilder =
        builder === "All builders" || project.developer === builder;
      const matchesStage = stage === "All active" || project.status === stage;
      const matchesCorridor =
        corridor === "All corridors" || project.corridor === corridor;
      const matchesQuery =
        !term ||
        [
          project.name,
          project.developer,
          project.location,
          project.corridor,
          project.configuration,
          project.status,
          ...project.highlights,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesBuilder && matchesStage && matchesCorridor && matchesQuery;
    });
  }, [builder, corridor, query, stage]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const activeBuilders = new Set(projects.map((project) => project.developer)).size;
  const underConstruction = projects.filter(
    (project) => project.status === "Under construction"
  ).length;

  function resetVisibleCount() {
    setVisibleCount(9);
  }

  return (
    <section id="projects" className="overflow-hidden bg-[#f5f6f8] py-24 sm:py-28">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[2.25rem] bg-[#071a2f] text-white shadow-[0_30px_90px_rgba(7,26,47,0.18)]">
          <div className="grid gap-px bg-white/10 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="bg-[#071a2f] px-6 py-10 sm:px-10 lg:px-14">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e4c462]">
                  Bengaluru active project intelligence
                </p>
                <h2 className="mt-4 text-5xl font-medium leading-tight sm:text-6xl">
                  Search the market, not just this year&apos;s launches.
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-white/65">
                  Explore publicly listed new launches and under-construction
                  homes across Bengaluru. Builder facts are rewritten into
                  buyer-friendly summaries, while price and inventory are
                  confirmed on enquiry.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 bg-[#0a2038] lg:grid-cols-1">
              {[
                { icon: Building2, value: projects.length, label: "Active projects" },
                { icon: Sparkles, value: activeBuilders, label: "Grade-A builders" },
                {
                  icon: MapPinned,
                  value: underConstruction,
                  label: "Under construction",
                },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 border-white/10 px-4 py-5 not-last:border-r lg:px-7 lg:not-last:border-r-0 lg:not-last:border-b"
                >
                  <Icon className="hidden size-5 shrink-0 text-[#e4c462] sm:block" />
                  <div>
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/45 sm:text-xs">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-7 sm:px-10 lg:px-14">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative flex-1">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/35" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    resetVisibleCount();
                  }}
                  placeholder="Search project, builder, corridor, BHK or lifestyle"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#c9a227]/60 focus:bg-white/10"
                />
              </label>
              <select
                value={corridor}
                onChange={(event) => {
                  setCorridor(event.target.value);
                  resetVisibleCount();
                }}
                aria-label="Filter by Bengaluru corridor"
                className="h-14 rounded-2xl border border-white/10 bg-[#0a2038] px-4 text-sm text-white outline-none focus:border-[#c9a227]/60"
              >
                {corridors.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <div className="flex h-14 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white/60">
                <SlidersHorizontal className="size-4 text-[#e4c462]" />
                {filteredProjects.length} match
                {filteredProjects.length === 1 ? "" : "es"}
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {stages.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setStage(name);
                    resetVisibleCount();
                  }}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition",
                    stage === name
                      ? "border-[#c9a227] bg-[#c9a227] text-[#071a2f]"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              {builders.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setBuilder(name);
                    resetVisibleCount();
                  }}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition",
                    builder === name
                      ? "border-white bg-white text-[#071a2f]"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visibleProjects.length ? (
          <>
            <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} />
              ))}
            </div>

            {visibleProjects.length < filteredProjects.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 9)}
                  className="inline-flex h-13 items-center justify-center rounded-full border border-[#071a2f]/15 bg-white px-7 text-sm font-semibold text-[#071a2f] shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a227] hover:shadow-lg"
                >
                  Show more projects
                  <span className="ml-2 text-slate-400">
                    ({filteredProjects.length - visibleProjects.length})
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#c9a227]/45 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
              No verified match yet
            </p>
            <h3 className="mt-3 text-3xl font-medium text-[#071a2f]">
              We will not publish an unverified project as active.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Try another builder or corridor, or ask our advisor to check
              newly registered and invitation-only inventory.
            </p>
            <button
              type="button"
              onClick={() => {
                setBuilder("All builders");
                setStage("All active");
                setCorridor("All corridors");
                setQuery("");
              }}
              className="mt-6 rounded-full border border-[#071a2f]/15 px-6 py-3 text-sm font-semibold text-[#071a2f] transition hover:bg-[#071a2f] hover:text-white"
            >
              Reset all filters
            </button>
          </div>
        )}

        <div className="mt-12 rounded-[1.75rem] border border-[#c9a227]/20 bg-white px-6 py-8 sm:px-10 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
              One brief. Better matches.
            </p>
            <h3 className="mt-3 text-3xl font-medium text-[#071a2f] sm:text-4xl">
              Let us compare active projects across builders for you.
            </h3>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Share your budget, corridor and move-in timeline. We will return a
              buyer-ready shortlist with current availability and cost sheets.
            </p>
          </div>
          <a
            href={generalWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-7 h-14 shrink-0 rounded-full bg-[#c9a227] px-8 text-[#071a2f] hover:bg-[#e4c462] lg:mt-0"
            )}
          >
            Build My Shortlist <ArrowRight className="ml-2 size-4" />
          </a>
        </div>
        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Catalogue facts are sourced from public developer pages and
          disclosures. Media may be artistic impressions. Pricing, launch
          status and inventory require live developer confirmation.
        </p>
      </div>
    </section>
  );
}
