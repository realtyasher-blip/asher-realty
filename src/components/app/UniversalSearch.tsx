"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Calculator,
  GitCompareArrows,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { guides } from "@/data/guides";
import { developerProfiles, developerSlug } from "@/data/developers";
import { locationHubs } from "@/data/locations";
import { projectSlug, projects } from "@/data/projects";

export const OPEN_SEARCH_EVENT = "asher:open-global-search";

type SearchItem = {
  title: string;
  description: string;
  href: string;
  type: "Project" | "Builder" | "Location" | "Guide" | "Journey" | "Tool";
  image?: string;
  keywords: string;
};

const searchItems: SearchItem[] = [
  ...projects.map((project) => ({
    title: project.name,
    description: `${project.developer} · ${project.location}`,
    href: `/projects/${projectSlug(project.name)}`,
    type: "Project" as const,
    image: project.image,
    keywords: [
      project.name,
      project.developer,
      project.location,
      project.corridor,
      project.configuration,
      project.propertyType || "",
      project.status,
    ]
      .join(" ")
      .toLowerCase(),
  })),
  ...developerProfiles.map((profile) => ({
    title: profile.name,
    description: `${profile.established} · ${profile.headquarters} · Builder profile`,
    href: `/builders/${developerSlug(profile.name)}`,
    type: "Builder" as const,
    keywords: [
      profile.name,
      profile.established,
      profile.headquarters,
      profile.summary,
      ...profile.knownFor,
    ]
      .join(" ")
      .toLowerCase(),
  })),
  ...locationHubs.map((location) => ({
    title: location.name,
    description: location.eyebrow,
    href: `/locations/${location.slug}`,
    type: "Location" as const,
    keywords: [
      location.name,
      location.eyebrow,
      location.summary,
      ...location.bestFor,
      ...location.connectivity,
    ]
      .join(" ")
      .toLowerCase(),
  })),
  ...guides.map((guide) => ({
    title: guide.title,
    description: `${guide.category} · ${guide.readTime}`,
    href: `/guides/${guide.slug}`,
    type: "Guide" as const,
    image: guide.cover,
    keywords: [guide.title, guide.dek, guide.category, ...guide.keyTakeaways]
      .join(" ")
      .toLowerCase(),
  })),
  {
    title: "Find a Bengaluru rental",
    description: "Start with locality, budget, move-in date and daily commute",
    href: "/rent",
    type: "Journey" as const,
    keywords: "rent rental tenant lease apartment house bengaluru bangalore deposit",
  },
  {
    title: "Explore resale homes",
    description: "Create a ready-home brief with document and total-cost checks",
    href: "/resale",
    type: "Journey" as const,
    keywords: "resale ready home apartment buy owner property bengaluru bangalore",
  },
  {
    title: "Post a property",
    description: "Submit free for private rent or resale review",
    href: "/post-property",
    type: "Journey" as const,
    keywords: "post free list sell property rent out landlord owner resale listing",
  },
  {
    title: "Owner readiness checklist",
    description: "Prepare property facts and media safely before free submission",
    href: "/owner-checklist",
    type: "Tool" as const,
    keywords: "owner checklist post free photos documents safety ready",
  },
  {
    title: "How Asher reviews property information",
    description: "Understand contact, authority, facts, availability, media and documents",
    href: "/how-we-verify",
    type: "Journey" as const,
    keywords: "verify review trust authority documents availability media property facts",
  },
  {
    title: "Property safety centre",
    description: "Avoid fraud, protect documents and report incorrect information",
    href: "/safety",
    type: "Journey" as const,
    keywords: "safety fraud report incorrect information privacy aadhaar pan otp",
  },
  {
    title: "End-to-end property services",
    description: "Loans, documents, inspection, moving, interiors and owner support",
    href: "/services",
    type: "Journey" as const,
    keywords: "services loan legal documents inspection interiors movers management valuation",
  },
  {
    title: "Open the Buyer Decision Lab",
    description: "Rank projects by personal fit, visible cost and data confidence",
    href: "/decision-lab",
    type: "Tool" as const,
    keywords: "decision lab buyer passport fit score confidence ranked shortlist ai",
  },
  {
    title: "Asher Buyer Advantage",
    description: "One buyer brief from shortlist through booking and handover",
    href: "/buyer-advantage",
    type: "Tool" as const,
    keywords:
      "buyer advantage buyer passport benefits support booking handover cost sheet",
  },
  {
    title: "Decode a property cost sheet",
    description: "Calculate all-in cost, carpet-area economics and open questions",
    href: "/true-cost",
    type: "Tool" as const,
    keywords:
      "truecost true cost builder quote cost sheet all inclusive carpet rate parking taxes registration emi",
  },
  {
    title: "Compare two Bengaluru projects",
    description: "Review location, pricing, possession and buyer fit side by side",
    href: "/compare",
    type: "Tool" as const,
    keywords: "compare projects side by side pricing possession rera",
  },
  {
    title: "Affordability and EMI tools",
    description: "Estimate EMIs, stamp duty and an ownership budget",
    href: "/tools",
    type: "Tool" as const,
    keywords: "calculator emi affordability stamp duty budget home loan",
  },
  {
    title: "Build my AI shortlist",
    description: "Match projects to your location, budget and home requirement",
    href: "/#ai-match",
    type: "Tool" as const,
    keywords: "ai match shortlist recommendation budget location bhk",
  },
];

const typeIcons = {
  Project: Building2,
  Builder: BadgeCheck,
  Location: MapPin,
  Guide: BookOpen,
  Journey: Sparkles,
  Tool: Calculator,
};

function rankItem(item: SearchItem, term: string) {
  const title = item.title.toLowerCase();
  if (title === term) return 100;
  if (title.startsWith(term)) return 80;
  if (title.includes(term)) return 65;
  if (item.keywords.includes(term)) return 45;

  const words = term.split(/\s+/).filter(Boolean);
  const matchedWords = words.filter((word) => item.keywords.includes(word));
  return matchedWords.length === words.length ? 30 + matchedWords.length : 0;
}

export default function UniversalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openSearch = () => setOpen(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener(OPEN_SEARCH_EVENT, openSearch);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, openSearch);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return [
        ...searchItems.filter((item) => item.type === "Journey").slice(0, 4),
        ...searchItems.filter(
          (item) =>
            item.type === "Project" &&
            projects.find(
              (project) =>
                project.name === item.title && project.featured
            )
        ).slice(0, 3),
      ];
    }

    return searchItems
      .map((item) => ({ item, score: rankItem(item, term) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map(({ item }) => item);
  }, [query]);

  function closeSearch() {
    setOpen(false);
    setQuery("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#03111f]/78 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-12"
      role="dialog"
      aria-modal="true"
      aria-label="Search Asher Realty"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeSearch();
      }}
    >
      <section className="mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#f7f8fa] shadow-[0_35px_120px_rgba(0,0,0,.45)]">
        <div className="border-b border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#071a2f] text-[#e4c462]">
              <Search className="size-5" />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, rentals, resale, services or areas"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm font-medium text-[#071a2f] outline-none placeholder:text-slate-400 sm:text-base"
            />
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-[#071a2f]"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <span>{query ? `${results.length} useful results` : "Popular starting points"}</span>
            <span className="hidden sm:inline">Ctrl K · Search from anywhere</span>
          </div>
        </div>

        <div className="max-h-[68vh] overflow-y-auto p-3 sm:p-4">
          {results.length ? (
            <div className="space-y-2">
              {results.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <Link
                    key={`${item.type}-${item.href}`}
                    href={item.href}
                    onClick={closeSearch}
                    className="group grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 rounded-2xl border border-transparent bg-white p-3 transition hover:border-[#c9a227]/45 hover:shadow-[0_12px_35px_rgba(7,26,47,.08)] sm:grid-cols-[4rem_1fr_auto]"
                  >
                    {item.image ? (
                      <span className="relative block size-[3.25rem] overflow-hidden rounded-xl bg-slate-200 sm:size-16">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </span>
                    ) : (
                      <span className="flex size-[3.25rem] items-center justify-center rounded-xl bg-[#fff7dc] text-[#9a7410] sm:size-16">
                        <Icon className="size-5" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-[#071a2f] sm:text-base">
                          {item.title}
                        </span>
                        <span className="hidden rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 sm:inline">
                          {item.type}
                        </span>
                      </span>
                      <span className="mt-1 block line-clamp-1 text-[11px] leading-5 text-slate-400 sm:text-xs">
                        {item.description}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b08a16]" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Search className="mx-auto size-8 text-[#c9a227]" />
              <h2 className="mt-4 text-2xl font-medium text-[#071a2f]">
                No exact match yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a builder, neighbourhood, configuration or a phrase such as
                “3 BHK near Whitefield”.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-[#071a2f] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 text-xs text-white/55">
            <Sparkles className="size-4 text-[#e4c462]" />
            Search across Asher&apos;s Bengaluru property journeys
          </span>
          <div className="flex gap-4 text-xs font-bold">
            <Link href="/compare" onClick={closeSearch} className="inline-flex items-center text-white/70 hover:text-white">
              <GitCompareArrows className="mr-1.5 size-4 text-[#e4c462]" />
              Compare
            </Link>
            <Link href="/tools" onClick={closeSearch} className="inline-flex items-center text-white/70 hover:text-white">
              <Calculator className="mr-1.5 size-4 text-[#e4c462]" />
              Calculators
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
