"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  ChevronDown,
  GitCompareArrows,
  Heart,
  IndianRupee,
  MapPin,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import {
  BUYER_PROFILE_EVENT,
  defaultBuyerPreferences,
  readBuyerPreferences,
  scoreProject,
  type BuyerPreferences,
} from "@/lib/buyerProfile";
import {
  BUYER_WORKSPACE_EVENT,
  COMPARISON_KEY,
  FAVOURITES_KEY,
  readBuyerWorkspace,
  toggleBuyerWorkspaceItem,
} from "@/lib/buyerWorkspace";
import {
  projectDecisionCaution,
  projectFitBand,
  projectOffersConfiguration,
  projectPriceCrores,
  projectSourceLabel,
} from "@/lib/decisionEngine";
import { cn } from "@/lib/utils";

const builders = ["All builders", ...Array.from(new Set(projects.map((project) => project.developer)))];
const corridors = ["All Bengaluru", ...Array.from(new Set(projects.map((project) => project.corridor)))];
const stages = ["Any stage", ...Array.from(new Set(projects.map((project) => project.status)))];
const configurations = ["Any BHK", "1", "2", "3", "4"];
const propertyTypes = ["Any home type", "Apartment", "Villa", "Row House", "Plot"];
const priceBands = ["Any budget", "Up to ₹2 Cr", "₹2–3 Cr", "₹3 Cr+", "Price on request"];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "best-fit", label: "Best match for me" },
  { value: "price-low", label: "Price: low to high" },
  { value: "possession", label: "Possession sooner" },
];

function priceValue(price: string) {
  return projectPriceCrores(price) ?? Number.POSITIVE_INFINITY;
}

function projectPriceBand(price: string) {
  if (/contact|request/i.test(price)) return "Price on request";
  const value = projectPriceCrores(price);
  if (!Number.isFinite(value)) return "Price on request";
  if (value === null) return "Price on request";
  if (value < 2) return "Up to ₹2 Cr";
  if (value <= 3) return "₹2–3 Cr";
  return "₹3 Cr+";
}

function dateValue(value?: string) {
  if (!value) return Number.POSITIVE_INFINITY;
  const year = value.match(/\b(20\d{2})\b/)?.[1];
  return year ? Number(year) : Number.POSITIVE_INFINITY;
}

export default function ProjectMarketplace() {
  const [query, setQuery] = useState("");
  const [corridor, setCorridor] = useState("All Bengaluru");
  const [configuration, setConfiguration] = useState("Any BHK");
  const [price, setPrice] = useState("Any budget");
  const [builder, setBuilder] = useState("All builders");
  const [stage, setStage] = useState("Any stage");
  const [propertyType, setPropertyType] = useState("Any home type");
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [savedOnly, setSavedOnly] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [preferences, setPreferences] =
    useState<BuyerPreferences>(defaultBuyerPreferences);

  useEffect(() => {
    const sync = () => {
      const workspace = readBuyerWorkspace();
      setFavourites(workspace.favourites);
      setComparison(workspace.comparison);
      setPreferences(readBuyerPreferences());
    };

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const requestedQuery = params.get("q");
      const requestedCorridor = params.get("corridor");
      const requestedConfiguration = params.get("bhk");
      const requestedPrice = params.get("price");
      const requestedBuilder = params.get("builder");

      if (requestedQuery) setQuery(requestedQuery);
      if (requestedCorridor && corridors.includes(requestedCorridor)) {
        setCorridor(requestedCorridor);
      }
      if (requestedConfiguration && configurations.includes(requestedConfiguration)) {
        setConfiguration(requestedConfiguration);
      }
      if (requestedPrice && priceBands.includes(requestedPrice)) {
        setPrice(requestedPrice);
      }
      if (requestedBuilder && builders.includes(requestedBuilder)) {
        setBuilder(requestedBuilder);
      }
      setSavedOnly(params.get("saved") === "1");
      sync();
    }, 0);

    window.addEventListener(BUYER_WORKSPACE_EVENT, sync);
    window.addEventListener(BUYER_PROFILE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_WORKSPACE_EVENT, sync);
      window.removeEventListener(BUYER_PROFILE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = projects.filter((project) => {
      const slug = projectSlug(project.name);
      const searchable = [
        project.name,
        project.developer,
        project.location,
        project.corridor,
        project.configuration,
        project.propertyType || "",
        project.description,
        ...project.highlights,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!term || searchable.includes(term)) &&
        (corridor === "All Bengaluru" || project.corridor === corridor) &&
        (configuration === "Any BHK" || projectOffersConfiguration(project, configuration)) &&
        (price === "Any budget" || projectPriceBand(project.price) === price) &&
        (builder === "All builders" || project.developer === builder) &&
        (stage === "Any stage" || project.status === stage) &&
        (propertyType === "Any home type" || `${project.propertyType || ""} ${project.configuration}`.toLowerCase().includes(propertyType.toLowerCase())) &&
        (!savedOnly || favourites.includes(slug))
      );
    });

    return matches.sort((left, right) => {
      if (sort === "best-fit") {
        return scoreProject(right, preferences).score - scoreProject(left, preferences).score;
      }
      if (sort === "price-low") return priceValue(left.price) - priceValue(right.price);
      if (sort === "possession") return dateValue(left.possession) - dateValue(right.possession);

      const recommended = (project: (typeof projects)[number]) =>
        (project.featured ? 4 : 0) +
        (project.status === "New launch" ? 2 : 0) +
        (project.rera ? 1 : 0);
      return recommended(right) - recommended(left);
    });
  }, [builder, configuration, corridor, favourites, preferences, price, propertyType, query, savedOnly, sort, stage]);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisibleCount(9), 0);
    return () => window.clearTimeout(timer);
  }, [builder, configuration, corridor, price, propertyType, query, savedOnly, sort, stage]);

  const activeFilterCount = [
    corridor !== "All Bengaluru",
    configuration !== "Any BHK",
    price !== "Any budget",
    builder !== "All builders",
    stage !== "Any stage",
    propertyType !== "Any home type",
    savedOnly,
  ].filter(Boolean).length;

  function resetFilters() {
    setQuery("");
    setCorridor("All Bengaluru");
    setConfiguration("Any BHK");
    setPrice("Any budget");
    setBuilder("All builders");
    setStage("Any stage");
    setPropertyType("Any home type");
    setSavedOnly(false);
  }

  function toggleFavourite(slug: string) {
    const next = toggleBuyerWorkspaceItem(FAVOURITES_KEY, slug);
    setFavourites(next);
  }

  function toggleComparison(slug: string, name: string) {
    const wasCompared = comparison.includes(slug);
    const next = toggleBuyerWorkspaceItem(COMPARISON_KEY, slug, { maxItems: 2 });
    setComparison(next);
    setNotice(
      wasCompared
        ? `${name} removed from comparison.`
        : next.length === 2
          ? "Your two-home comparison is ready."
          : `${name} saved for comparison. Choose one more.`
    );
    window.setTimeout(() => setNotice(""), 2200);
  }

  const advisorUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    "Hi Asher Realty, I would like help narrowing down the right Bengaluru projects."
  )}`;

  return (
    <section className="bg-[#f4f5f7] pb-24 pt-8">
      <div className="container-shell">
        <div className="mb-6 grid gap-4 rounded-[1.75rem] bg-[#071a2f] p-5 text-white shadow-[0_20px_65px_rgba(7,26,47,.13)] sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#e4c462]">
              <Target className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                {preferences.customized ? "Your preferences are active" : "Make this search personal"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {preferences.customized
                  ? `Showing ${preferences.configuration} BHK matches around your chosen budget and area.`
                  : "Answer three questions and see more relevant homes first."}
              </h2>
            </div>
          </div>
          <Link
            href="/home-match"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-6 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            {preferences.customized ? "Refine Home Match" : "Start Home Match"}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="sticky top-20 z-30 rounded-[1.6rem] border border-slate-200 bg-white/96 p-4 shadow-[0_18px_55px_rgba(7,26,47,.08)] backdrop-blur-xl">
          <div className="grid grid-cols-[1fr_auto] gap-3 lg:grid-cols-[1.45fr_repeat(3,1fr)_auto]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search project, builder or area"
                className="h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-12 pr-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] focus:bg-white"
              />
            </label>
            <select
              value={corridor}
              onChange={(event) => setCorridor(event.target.value)}
              aria-label="Preferred Bengaluru area"
              className="hidden h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:block"
            >
              {corridors.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select
              value={configuration}
              onChange={(event) => setConfiguration(event.target.value)}
              aria-label="Home size"
              className="hidden h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:block"
            >
              {configurations.map((item) => (
                <option key={item} value={item}>{item === "Any BHK" ? item : `${item} BHK`}</option>
              ))}
            </select>
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              aria-label="Budget"
              className="hidden h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:block"
            >
              {priceBands.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              aria-expanded={filtersOpen}
              className="inline-flex h-13 items-center justify-center rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#071a2f]"
            >
              <SlidersHorizontal className="mr-2 size-4 text-[#a47b10]" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-[#071a2f] text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={cn("ml-2 size-4 transition", filtersOpen && "rotate-180")} />
            </button>
          </div>

          {filtersOpen && (
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <select value={corridor} onChange={(event) => setCorridor(event.target.value)} aria-label="Preferred Bengaluru area" className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:hidden">
                {corridors.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={configuration} onChange={(event) => setConfiguration(event.target.value)} aria-label="Home size" className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:hidden">
                {configurations.map((item) => <option key={item} value={item}>{item === "Any BHK" ? item : `${item} BHK`}</option>)}
              </select>
              <select value={price} onChange={(event) => setPrice(event.target.value)} aria-label="Budget" className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:hidden">
                {priceBands.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={builder} onChange={(event) => setBuilder(event.target.value)} aria-label="Builder" className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]">
                {builders.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={stage} onChange={(event) => setStage(event.target.value)} aria-label="Project stage" className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]">
                {stages.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)} aria-label="Home type" className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]">
                {propertyTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button
                type="button"
                onClick={() => setSavedOnly((current) => !current)}
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-xl border px-4 text-sm font-semibold",
                  savedOnly ? "border-rose-300 bg-rose-50 text-rose-600" : "border-slate-200 bg-white text-slate-600"
                )}
              >
                <Heart className={cn("mr-2 size-4", savedOnly && "fill-current")} />
                Saved homes ({favourites.length})
              </button>
              <button type="button" onClick={resetFilters} className="inline-flex h-12 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-[#071a2f]">
                <X className="mr-2 size-4" />
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#071a2f]">
              {filtered.length} matching home{filtered.length === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Strict budget filters exclude projects without a visible price. Live cost and units are confirmed before a visit.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {comparison.length > 0 && (
              <Link href={`/compare?projects=${comparison.join(",")}`} className="inline-flex h-11 items-center rounded-xl border border-[#c9a227]/40 bg-[#fff9e8] px-4 text-xs font-bold text-[#7a5b08]">
                <GitCompareArrows className="mr-2 size-4" />
                Compare ({comparison.length}/2)
              </Link>
            )}
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort homes" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#071a2f] outline-none focus:border-[#c9a227]">
              {sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>

        {filtered.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visibleCount).map((project) => {
              const slug = projectSlug(project.name);
              const saved = favourites.includes(slug);
              const compared = comparison.includes(slug);
              const fit = scoreProject(project, preferences);

              return (
                <article key={project.name} className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(7,26,47,.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(7,26,47,.11)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                    <Image src={project.image} alt={`${project.name} by ${project.developer}`} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/82 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#071a2f] backdrop-blur">
                      {project.status === "Coming soon" ? "Coming soon / EOI" : project.status}
                    </span>
                    <button type="button" onClick={() => toggleFavourite(slug)} aria-label={saved ? `Remove ${project.name} from saved homes` : `Save ${project.name}`} aria-pressed={saved} className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/92 text-[#071a2f] shadow-md transition hover:scale-105">
                      <Heart className={cn("size-5", saved && "fill-rose-500 text-rose-500")} />
                    </button>
                    <div className="absolute inset-x-5 bottom-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">{project.developer}</p>
                      <h2 className="mt-1 text-3xl font-medium leading-tight text-white">{project.name}</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                      {project.location}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <p className="flex items-start gap-2 rounded-xl bg-[#f6f7f8] p-3 text-xs leading-5 text-slate-600">
                        <BedDouble className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                        {project.configuration}
                      </p>
                      <p className="flex items-start gap-2 rounded-xl bg-[#f6f7f8] p-3 text-xs leading-5 text-slate-600">
                        <IndianRupee className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                        {project.price}
                      </p>
                    </div>

                    <div className={cn("mt-4 flex gap-3 rounded-2xl p-4", preferences.customized ? "border border-emerald-100 bg-emerald-50" : "border border-[#c9a227]/18 bg-[#fffaf0]") }>
                      {preferences.customized ? <Target className="mt-0.5 size-4 shrink-0 text-emerald-700" /> : <Sparkles className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />}
                      <div>
                        <p className={cn("text-[10px] font-bold uppercase tracking-[0.12em]", preferences.customized ? "text-emerald-800" : "text-[#94700f]") }>
                          {preferences.customized ? `Why this matches · ${projectFitBand(fit.score)}` : "Why consider it"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#071a2f]/72">
                          {preferences.customized ? fit.reasons.slice(0, 2).join(" · ") : project.buyerNotes?.[0] || project.highlights[0]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-amber-50 px-3 py-3 text-[9px] leading-5 text-amber-950/65">
                      <span className="font-extrabold uppercase tracking-[0.08em] text-amber-700">Check before visit · </span>
                      {projectDecisionCaution(project)}
                    </div>

                    <p className="mt-3 text-[9px] font-semibold text-slate-400">{projectSourceLabel(project)}</p>

                    <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                      <Link href={`/projects/${slug}`} className="inline-flex h-12 items-center justify-center rounded-full bg-[#071a2f] px-5 text-sm font-semibold text-white transition hover:bg-[#0d2948]">
                        Open buyer brief
                        <ArrowUpRight className="ml-2 size-4" />
                      </Link>
                      <button type="button" onClick={() => toggleComparison(slug, project.name)} aria-label={compared ? `Remove ${project.name} from comparison` : `Compare ${project.name}`} aria-pressed={compared} className={cn("flex size-12 items-center justify-center rounded-full border transition", compared ? "border-[#c9a227] bg-[#fff7dc] text-[#7a5b08]" : "border-slate-200 text-slate-400 hover:border-[#c9a227] hover:text-[#071a2f]") }>
                        <GitCompareArrows className="size-5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white py-16 text-center">
            <SlidersHorizontal className="mx-auto size-8 text-[#c9a227]" />
            <h2 className="mt-5 text-3xl font-medium text-[#071a2f]">No exact match yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">Try a wider budget or area, or ask an advisor to check current inventory.</p>
            <button type="button" onClick={resetFilters} className="mt-6 rounded-full bg-[#071a2f] px-6 py-3 text-sm font-semibold text-white">Clear filters</button>
          </div>
        )}

        {filtered.length > visibleCount && (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => setVisibleCount((current) => current + 9)} className="inline-flex h-12 items-center justify-center rounded-full border border-[#071a2f]/15 bg-white px-7 text-sm font-semibold text-[#071a2f] shadow-sm transition hover:border-[#c9a227] hover:shadow-lg">
              Show more homes
              <span className="ml-2 text-slate-400">({filtered.length - visibleCount} left)</span>
            </button>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-5 rounded-[1.75rem] border border-[#c9a227]/20 bg-white p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">Still unsure?</p>
            <h3 className="mt-2 text-3xl font-semibold text-[#071a2f]">Tell an advisor what matters to you.</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">We&apos;ll narrow the catalogue, verify current facts and plan sensible visits.</p>
          </div>
          <a href={advisorUrl} target="_blank" rel="noopener noreferrer" data-analytics-label="Marketplace advisor help" className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]">
            <MessageCircle className="mr-2 size-4" />
            Talk to an advisor
          </a>
        </div>

        {notice && (
          <div role="status" className="fixed bottom-24 right-4 z-[80] max-w-sm rounded-2xl border border-[#c9a227]/25 bg-[#071a2f] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_55px_rgba(0,0,0,.28)] lg:bottom-24 lg:right-7">
            {notice}
          </div>
        )}
      </div>
    </section>
  );
}
