"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  Heart,
  IndianRupee,
  MapPin,
  Sparkles,
} from "lucide-react";

import { projectSlug, type Project } from "@/data/projects";
import {
  BUYER_WORKSPACE_EVENT,
  FAVOURITES_KEY,
  readBuyerWorkspace,
  toggleBuyerWorkspaceItem,
} from "@/lib/buyerWorkspace";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const slug = projectSlug(project.name);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readBuyerWorkspace().favourites.includes(slug));
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(BUYER_WORKSPACE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_WORKSPACE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  function toggleSaved() {
    const next = toggleBuyerWorkspaceItem(FAVOURITES_KEY, slug);
    setSaved(next.includes(slug));
  }

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(7,26,47,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(7,26,47,.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <Image
          src={project.image}
          alt={`${project.name} residential project`}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/82 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#071a2f] backdrop-blur">
          {project.status === "Coming soon" ? "Coming soon / EOI" : project.status}
        </span>
        <button
          type="button"
          onClick={toggleSaved}
          aria-label={saved ? `Remove ${project.name} from saved homes` : `Save ${project.name}`}
          aria-pressed={saved}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/92 text-[#071a2f] shadow-md transition hover:scale-105"
        >
          <Heart className={cn("size-5", saved && "fill-rose-500 text-rose-500")} />
        </button>

        <div className="absolute inset-x-5 bottom-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
            {project.developer}
          </p>
          <h3 className="mt-1 text-3xl font-medium leading-tight text-white">
            {project.name}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3 text-sm text-slate-600">
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
            <span>{project.location}</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <p className="flex items-start gap-2 rounded-xl bg-[#f6f7f8] p-3 text-xs leading-5">
              <BedDouble className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
              <span>{project.configuration}</span>
            </p>
            <p className="flex items-start gap-2 rounded-xl bg-[#f6f7f8] p-3 text-xs leading-5">
              <IndianRupee className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
              <span>{project.price}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3 rounded-2xl border border-[#c9a227]/18 bg-[#fffaf0] p-4">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94700f]">
              Why consider it
            </p>
            <p className="mt-1 text-xs leading-5 text-[#071a2f]/72">
              {project.buyerNotes?.[0] || project.highlights[0]}
            </p>
          </div>
        </div>

        <Link
          href={`/projects/${slug}`}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#071a2f] px-5 text-sm font-semibold text-white transition hover:bg-[#0d2948]"
        >
          View project
          <ArrowUpRight className="ml-2 size-4" />
        </Link>
      </div>
    </article>
  );
}
