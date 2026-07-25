"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const requestedBuilders = [
  "All builders",
  "SOBHA",
  "Prestige Group",
  "Assetz Property Group",
  "Sumadhura Group",
  "Brigade Group",
  "Lodha",
  "Godrej Properties",
  "Bhartiya Urban",
];

const recentLaunchNames = new Set(["SOBHA OneWorld"]);
const generalWhatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20please%20help%20me%20compare%20the%20latest%20Bengaluru%20property%20launches.";

export default function FeaturedProjects() {
  const [builder, setBuilder] = useState("All builders");
  const [query, setQuery] = useState("");
  const [recentOnly, setRecentOnly] = useState(true);

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesBuilder = builder === "All builders" || project.developer === builder;
      const matchesPeriod = !recentOnly || recentLaunchNames.has(project.name);
      const matchesQuery =
        !term ||
        [project.name, project.developer, project.location, project.configuration]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matchesBuilder && matchesPeriod && matchesQuery;
    });
  }, [builder, query, recentOnly]);

  return (
    <section id="projects" className="overflow-hidden bg-[#f5f6f8] py-24 sm:py-28">
      <div className="container-shell">
        <div className="rounded-[2.25rem] bg-[#071a2f] px-6 py-10 text-white shadow-[0_30px_90px_rgba(7,26,47,0.18)] sm:px-10 lg:px-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e4c462]">Bengaluru launch intelligence</p>
              <h2 className="mt-4 text-5xl font-medium leading-tight sm:text-6xl">Find the launch that fits your next move.</h2>
              <p className="mt-5 max-w-2xl leading-8 text-white/65">
                Search, compare and enquire without leaving Asher Realty. The recent view includes only publicly verifiable launches announced between 26 March and 26 July 2026.
              </p>
            </div>
            <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 p-1">
              <button type="button" onClick={() => setRecentOnly(true)} className={cn("rounded-full px-5 py-2.5 text-sm font-semibold transition", recentOnly ? "bg-[#c9a227] text-[#071a2f]" : "text-white/65 hover:text-white")}>Recent verified</button>
              <button type="button" onClick={() => setRecentOnly(false)} className={cn("rounded-full px-5 py-2.5 text-sm font-semibold transition", !recentOnly ? "bg-white text-[#071a2f]" : "text-white/65 hover:text-white")}>All curated</button>
            </div>
          </div>
          <div className="mt-9 flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/35" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search project, builder, location or configuration" className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#c9a227]/60 focus:bg-white/10" />
            </label>
            <div className="flex h-14 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white/60">
              <SlidersHorizontal className="size-4 text-[#e4c462]" />
              {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {requestedBuilders.map((name) => (
              <button key={name} type="button" onClick={() => setBuilder(name)} className={cn("shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition", builder === name ? "border-[#c9a227] bg-[#c9a227] text-[#071a2f]" : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white")}>{name}</button>
            ))}
          </div>
        </div>

        {filteredProjects.length ? (
          <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#c9a227]/45 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">No dated launch announcement found</p>
            <h3 className="mt-3 text-3xl font-medium text-[#071a2f]">We will not label an older project as a new launch.</h3>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Ask our advisor for the builder&apos;s current inventory, upcoming registrations and private launch alerts.</p>
            <button type="button" onClick={() => setRecentOnly(false)} className="mt-6 rounded-full border border-[#071a2f]/15 px-6 py-3 text-sm font-semibold text-[#071a2f] transition hover:bg-[#071a2f] hover:text-white">View all curated projects</button>
          </div>
        )}

        <div className="mt-12 rounded-[1.75rem] border border-[#c9a227]/20 bg-white px-6 py-8 sm:px-10 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">One brief. Better matches.</p>
            <h3 className="mt-3 text-3xl font-medium text-[#071a2f] sm:text-4xl">Let us compare launches across builders for you.</h3>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">Share your budget, preferred corridor and move-in timeline. We will return a buyer-ready shortlist with current availability.</p>
          </div>
          <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "lg" }), "mt-7 h-14 shrink-0 rounded-full bg-[#c9a227] px-8 text-[#071a2f] hover:bg-[#e4c462] lg:mt-0")}>
            Build My Shortlist <ArrowRight className="ml-2 size-4" />
          </a>
        </div>
        <p className="mt-6 text-center text-xs leading-5 text-slate-400">“Recent verified” is based on dated public developer information. Media may include artistic impressions. Prices and inventory require live confirmation.</p>
      </div>
    </section>
  );
}
