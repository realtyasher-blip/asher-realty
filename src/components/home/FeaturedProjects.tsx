import Link from "next/link";
import { ArrowRight, GitCompareArrows, ShieldCheck } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

const featured = [
  ...projects.filter((project) => project.featured),
  ...projects.filter((project) => !project.featured),
].slice(0, 3);

export default function FeaturedProjects() {
  return (
    <section id="projects" className="content-auto-section bg-[#f4f5f7] py-20 sm:py-24">
      <div className="container-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a47b10]">
              A buyer-friendly place to start
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              Homes worth exploring now.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Start with a small selection of active Bengaluru projects. Save
              the ones you like, then compare only your strongest options.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex h-12 w-fit items-center justify-center rounded-full border border-[#071a2f]/15 bg-white px-6 text-sm font-bold text-[#071a2f] transition hover:border-[#c9a227] hover:shadow-lg"
          >
            View all {projects.length} projects
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-[1.75rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_70px_rgba(7,26,47,.15)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#e4c462]">
              <GitCompareArrows className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                Shortlist before you visit
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                Save a few homes. Compare your best two side by side.
              </h3>
              <p className="mt-2 flex items-center gap-2 text-xs leading-6 text-white/50">
                <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
                We&apos;ll help verify current pricing and inventory before your visit.
              </p>
            </div>
          </div>
          <Link
            href="/my-search"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            Open saved homes
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
