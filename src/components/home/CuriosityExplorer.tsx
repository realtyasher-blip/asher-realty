"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  Leaf,
  MessageCircle,
  Sparkles,
  Telescope,
} from "lucide-react";

export type CuriosityProject = {
  name: string;
  slug: string;
  developer: string;
  location: string;
  image: string;
  price: string;
  status: string;
  configuration: string;
  why: string;
  caution: string;
};

export type CuriosityCollection = {
  id: string;
  label: string;
  cue: string;
  title: string;
  description: string;
  advisorPrompt: string;
  projects: CuriosityProject[];
};

const collectionIcons = {
  commute: BriefcaseBusiness,
  green: Leaf,
  early: Telescope,
  sooner: Clock3,
  distinctive: Sparkles,
};

export default function CuriosityExplorer({
  collections,
}: {
  collections: CuriosityCollection[];
}) {
  const [activeId, setActiveId] = useState(collections[0]?.id ?? "");
  const active =
    collections.find((collection) => collection.id === activeId) ?? collections[0];

  const advisorUrl = useMemo(() => {
    if (!active) return "https://wa.me/919019697170";

    const projectNames = active.projects.map((project) => project.name).join(", ");
    const message = `Hi Asher Realty, I am exploring “${active.label}”. ${active.advisorPrompt} I liked ${projectNames}. Please help me understand live inventory, the real all-inclusive cost and which option genuinely fits me.`;
    return `https://wa.me/919019697170?text=${encodeURIComponent(message)}`;
  }, [active]);

  if (!active || active.projects.length === 0) return null;

  const [leadProject, ...supportingProjects] = active.projects;

  return (
    <section id="discover" className="overflow-hidden bg-[#f0eee8] py-20 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7411]">
              Explore by instinct
            </p>
            <h2 className="mt-4 max-w-3xl text-5xl font-medium leading-[0.98] tracking-[-0.03em] text-[#071a2f] sm:text-7xl">
              How do you want Bengaluru to feel?
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Projects become easier to judge when you begin with the life you
              want—not a builder name. Pick a feeling and see a small, thoughtful
              collection with the questions that still need a human answer.
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs font-bold text-[#071a2f]">
              <Sparkles className="size-4 text-[#b58b17]" />
              No form. No random call. Just explore.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Bengaluru home collections"
          className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {collections.map((collection) => {
            const Icon =
              collectionIcons[collection.id as keyof typeof collectionIcons] ?? Sparkles;
            const selected = collection.id === active.id;

            return (
              <button
                key={collection.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`collection-${collection.id}`}
                onClick={() => setActiveId(collection.id)}
                className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-bold transition ${
                  selected
                    ? "border-[#071a2f] bg-[#071a2f] text-white shadow-[0_14px_32px_rgba(7,26,47,.18)]"
                    : "border-[#071a2f]/10 bg-white/75 text-[#071a2f] hover:border-[#c9a227] hover:bg-white"
                }`}
              >
                <Icon className={`size-4 ${selected ? "text-[#e4c462]" : "text-[#a47b10]"}`} />
                {collection.label}
              </button>
            );
          })}
        </div>

        <div
          key={active.id}
          id={`collection-${active.id}`}
          role="tabpanel"
          className="collection-reveal mt-6 overflow-hidden rounded-[2rem] border border-[#071a2f]/10 bg-white shadow-[0_30px_90px_rgba(7,26,47,.1)]"
        >
          <div className="grid xl:grid-cols-[1.18fr_.82fr]">
            <Link
              href={`/projects/${leadProject.slug}`}
              className="group relative min-h-[480px] overflow-hidden xl:min-h-[690px]"
            >
              <Image
                src={leadProject.image}
                alt={`${leadProject.name} in ${leadProject.location}`}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.035]"
                sizes="(max-width: 1280px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03111d] via-[#03111d]/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em]">
                  <span className="rounded-full bg-[#e4c462] px-3 py-2 text-[#071a2f]">
                    {active.cue}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur">
                    {leadProject.status}
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                  {leadProject.developer}
                </p>
                <h3 className="mt-2 max-w-2xl text-4xl font-medium leading-none sm:text-6xl">
                  {leadProject.name}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">
                  {leadProject.why}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-bold">
                  <span className="rounded-full border border-white/18 bg-black/20 px-3 py-2 backdrop-blur">
                    {leadProject.configuration}
                  </span>
                  <span className="rounded-full border border-white/18 bg-black/20 px-3 py-2 backdrop-blur">
                    {leadProject.price}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-bold">
                  Open the buyer brief
                  <ArrowUpRight className="ml-2 size-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <div className="flex flex-col bg-[#fbfaf7] p-5 sm:p-8 xl:p-9">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b10]">
                  {active.label}
                </p>
                <h3 className="mt-3 text-4xl font-medium leading-tight text-[#071a2f]">
                  {active.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {active.description}
                </p>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {supportingProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group grid grid-cols-[112px_1fr] overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-[#c9a227]/55 hover:shadow-lg"
                  >
                    <div className="relative min-h-36 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={`${project.name} project view`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="112px"
                      />
                    </div>
                    <div className="min-w-0 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a47b10]">
                        {project.developer}
                      </p>
                      <h4 className="mt-1 line-clamp-2 text-xl font-semibold leading-tight text-[#071a2f]">
                        {project.name}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-500">
                        {project.location}
                      </p>
                      <p className="mt-2 text-[10px] font-bold text-[#071a2f]">
                        {project.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-7">
                <div className="mb-3 rounded-[1.2rem] border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-amber-700">
                    Keep in view
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-amber-950/65">
                    {leadProject.caution}
                  </p>
                </div>
                <div className="rounded-[1.35rem] bg-[#071a2f] p-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e4c462]">
                    The useful human question
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    {active.advisorPrompt}
                  </p>
                  <a
                    href={advisorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-label={`Curiosity collection advisor ${active.id}`}
                    className="shine-button mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                  >
                    <MessageCircle className="mr-2 size-4" />
                    Ask Asher about this collection
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
