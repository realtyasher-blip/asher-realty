"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  ChevronDown,
  Clock3,
  GitCompareArrows,
  Heart,
  IndianRupee,
  LayoutGrid,
  List,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { developerLogos, projectSlug, projects } from "@/data/projects";
import { developerSlug } from "@/data/developers";
import {
  BUYER_PROFILE_EVENT,
  buyerBriefSummary,
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
  writeBuyerWorkspaceList,
} from "@/lib/buyerWorkspace";
import { cn } from "@/lib/utils";

const builders = ["All", ...Array.from(new Set(projects.map((project) => project.developer)))];
const corridors = ["All corridors", ...Array.from(new Set(projects.map((project) => project.corridor)))];
const stages = ["All stages", ...Array.from(new Set(projects.map((project) => project.status)))];
const configurations = ["Any BHK", "1", "2", "3", "4"];
const propertyTypes = ["Any type", "Apartment", "Villa", "Row House", "Plot"];

function priceBand(price: string) {
  if (/Contact/i.test(price)) return "Price on request";
  const match = price.match(/₹(\d+(?:\.\d+)?)/);
  if (!match) return "Price on request";
  const crores = Number(match[1]);
  if (crores < 2) return "Up to ₹2 Cr";
  if (crores <= 3) return "₹2–3 Cr";
  return "₹3 Cr+";
}

const priceBands = ["Any price", "Up to ₹2 Cr", "₹2–3 Cr", "₹3 Cr+", "Price on request"];
const sortOptions = [
  { value: "best-fit", label: "Best fit for me" },
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: low to high" },
  { value: "possession", label: "Possession sooner" },
  { value: "verified", label: "Recently verified" },
];

function priceValue(price: string) {
  const match = price.match(/₹(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function dateValue(value?: string) {
  if (!value) return Number.POSITIVE_INFINITY;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

export default function ProjectMarketplace() {
  const [query, setQuery] = useState("");
  const [builder, setBuilder] = useState("All");
  const [corridor, setCorridor] = useState("All corridors");
  const [stage, setStage] = useState("All stages");
  const [configuration, setConfiguration] = useState("Any BHK");
  const [propertyType, setPropertyType] = useState("Any type");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [comparisonNotice, setComparisonNotice] = useState("");
  const [buyerPreferences, setBuyerPreferences] =
    useState<BuyerPreferences>(defaultBuyerPreferences);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setFavouritesOnly(params.get("saved") === "1");

      const requestedQuery = params.get("q");
      const requestedBuilder = params.get("builder");
      const requestedCorridor = params.get("corridor");
      const requestedStage = params.get("stage");
      const requestedConfiguration = params.get("bhk");
      const requestedType = params.get("type");
      const requestedPrice = params.get("price");

      if (requestedQuery) setQuery(requestedQuery);
      if (requestedBuilder && builders.includes(requestedBuilder)) {
        setBuilder(requestedBuilder);
      }
      if (requestedCorridor && corridors.includes(requestedCorridor)) {
        setCorridor(requestedCorridor);
      }
      if (requestedStage && stages.includes(requestedStage)) {
        setStage(requestedStage);
      }
      if (
        requestedConfiguration &&
        configurations.includes(requestedConfiguration)
      ) {
        setConfiguration(requestedConfiguration);
      }
      if (requestedType && propertyTypes.includes(requestedType)) {
        setPropertyType(requestedType);
      }
      if (requestedPrice && priceBands.includes(requestedPrice)) {
        setPrice(requestedPrice);
      }

      const workspace = readBuyerWorkspace();
      setFavourites(workspace.favourites);
      setRecent(workspace.recent);
      setComparison(workspace.comparison);
      const profile = readBuyerPreferences();
      setBuyerPreferences(profile);
      setProfileReady(true);
      if (profile.customized) setSort("best-fit");
    });

    const syncWorkspace = () => {
      const workspace = readBuyerWorkspace();
      setFavourites(workspace.favourites);
      setRecent(workspace.recent);
      setComparison(workspace.comparison);
    };
    const syncProfile = () => {
      setBuyerPreferences(readBuyerPreferences());
      setProfileReady(true);
    };
    window.addEventListener(BUYER_WORKSPACE_EVENT, syncWorkspace);
    window.addEventListener(BUYER_PROFILE_EVENT, syncProfile);
    window.addEventListener("storage", syncProfile);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_WORKSPACE_EVENT, syncWorkspace);
      window.removeEventListener(BUYER_PROFILE_EVENT, syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = projects.filter((project) => {
      const slug = projectSlug(project.name);
      const matchesText =
        !term ||
        [
          project.name,
          project.developer,
          project.location,
          project.corridor,
          project.configuration,
          project.propertyType || "",
          project.unitSizes || "",
          project.status,
          project.description,
          project.launchNote || "",
          project.mediaNote || "",
          ...project.highlights,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return (
        matchesText &&
        (builder === "All" || project.developer === builder) &&
        (corridor === "All corridors" || project.corridor === corridor) &&
        (stage === "All stages" || project.status === stage) &&
        (configuration === "Any BHK" ||
          project.configuration.includes(configuration)) &&
        (propertyType === "Any type" ||
          `${project.propertyType || ""} ${project.configuration}`
            .toLowerCase()
            .includes(propertyType.toLowerCase())) &&
        (price === "Any price" ||
          priceBand(project.price) === price ||
          priceBand(project.price) === "Price on request") &&
        (!favouritesOnly || favourites.includes(slug)) &&
        (!recentOnly || recent.includes(slug))
      );
    });

    return matches.sort((a, b) => {
      if (sort === "best-fit") {
        return (
          scoreProject(b, buyerPreferences).score -
          scoreProject(a, buyerPreferences).score
        );
      }
      if (sort === "price-low") return priceValue(a.price) - priceValue(b.price);
      if (sort === "possession") {
        return dateValue(a.possession) - dateValue(b.possession);
      }
      if (sort === "verified") {
        return dateValue(b.verifiedAt) - dateValue(a.verifiedAt);
      }

      const recommendedScore = (project: (typeof projects)[number]) =>
        (project.featured ? 4 : 0) +
        (project.status === "New launch" ? 2 : 0) +
        (project.rera ? 1 : 0) +
        (project.possession ? 1 : 0);

      return recommendedScore(b) - recommendedScore(a);
    });
  }, [
    builder,
    buyerPreferences,
    configuration,
    corridor,
    favourites,
    favouritesOnly,
    price,
    propertyType,
    query,
    recent,
    recentOnly,
    stage,
    sort,
  ]);

  const topPersonalMatch = useMemo(
    () =>
      projects
        .map((project) => scoreProject(project, buyerPreferences))
        .sort((left, right) => right.score - left.score)[0],
    [buyerPreferences]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setVisibleCount(9), 0);
    return () => window.clearTimeout(timer);
  }, [
    builder,
    configuration,
    corridor,
    favouritesOnly,
    price,
    propertyType,
    query,
    recentOnly,
    sort,
    stage,
  ]);

  function toggleFavourite(slug: string) {
    setFavourites((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];
      writeBuyerWorkspaceList(FAVOURITES_KEY, next);
      return next;
    });
  }

  function toggleComparison(slug: string, name: string) {
    const wasCompared = comparison.includes(slug);
    const next = toggleBuyerWorkspaceItem(COMPARISON_KEY, slug, {
      maxItems: 2,
    });
    setComparison(next);
    setComparisonNotice(
      wasCompared
        ? `${name} removed from comparison.`
        : next.length === 2
          ? `${name} added. Your comparison is ready.`
          : `${name} added. Choose one more project.`
    );
    window.setTimeout(() => setComparisonNotice(""), 2400);
  }

  function resetFilters() {
    setQuery("");
    setBuilder("All");
    setCorridor("All corridors");
    setStage("All stages");
    setConfiguration("Any BHK");
    setPropertyType("Any type");
    setPrice("Any price");
    setFavouritesOnly(false);
    setRecentOnly(false);
  }

  const hasFilters =
    query ||
    builder !== "All" ||
    corridor !== "All corridors" ||
    stage !== "All stages" ||
    configuration !== "Any BHK" ||
    propertyType !== "Any type" ||
    price !== "Any price" ||
    favouritesOnly ||
    recentOnly;

  const activeFilterCount = [
    builder !== "All",
    corridor !== "All corridors",
    stage !== "All stages",
    configuration !== "Any BHK",
    propertyType !== "Any type",
    price !== "Any price",
    favouritesOnly,
    recentOnly,
  ].filter(Boolean).length;

  const quickSearches = [
    {
      label: "New launches",
      action: () => {
        resetFilters();
        setStage("New launch");
      },
    },
    {
      label: "Pre-launch / EOI",
      action: () => {
        resetFilters();
        setStage("Coming soon");
      },
    },
    {
      label: "East Bengaluru",
      action: () => {
        resetFilters();
        setCorridor("East Bengaluru");
      },
    },
    {
      label: "Homes up to ₹2 Cr",
      action: () => {
        resetFilters();
        setPrice("Up to ₹2 Cr");
      },
    },
    {
      label: "4 BHK homes",
      action: () => {
        resetFilters();
        setConfiguration("4");
      },
    },
    {
      label: "Ready sooner",
      action: () => {
        resetFilters();
        setStage("Ready / active");
      },
    },
  ];

  return (
    <section className="bg-[#f4f5f7] pb-24 pt-10">
      <div className="container-shell">
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { value: projects.length, label: "Curated Bengaluru projects" },
            {
              value: new Set(projects.map((project) => project.developer)).size,
              label: "Grade-A builders",
            },
            {
              value: projects.filter((project) => project.status === "New launch").length,
              label: "New-launch options",
            },
            {
              value: projects.filter((project) => project.status === "Coming soon").length,
              label: "EOI / coming-soon watchlist",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(7,26,47,.05)]"
            >
              <p className="text-3xl font-medium text-[#071a2f]">{stat.value}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {profileReady && (
          <div className="mb-6 overflow-hidden rounded-[1.75rem] bg-[#071a2f] text-white shadow-[0_20px_65px_rgba(7,26,47,.14)]">
            <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#e4c462]">
                <Target className="size-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                  {buyerPreferences.customized
                    ? "Your buyer brief is active"
                    : "Personalise this catalogue"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {buyerPreferences.customized
                    ? `${topPersonalMatch.project.name} is currently your strongest catalogue fit.`
                    : "Make 75 projects behave like your personal shortlist."}
                </h2>
                <p className="mt-2 text-xs leading-6 text-white/50">
                  {buyerPreferences.customized
                    ? `${buyerBriefSummary(buyerPreferences)} · ${topPersonalMatch.score}% top fit`
                    : "Add your work hub, budget, move-in plan and top priority. Fit scores will appear across every project."}
                </p>
              </div>
              <Link
                href="/my-search#buyer-profile"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-6 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                {buyerPreferences.customized ? "Edit my brief" : "Create my buyer brief"}
                <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        )}

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          <span className="inline-flex shrink-0 items-center gap-2 py-2 pr-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            <Sparkles className="size-4 text-[#c9a227]" />
            Quick search
          </span>
          {quickSearches.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#071a2f] transition hover:border-[#c9a227] hover:bg-[#fff9e6]"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <p className="text-xs leading-6">
            <strong>Pre-launch safety:</strong> EOI and coming-soon listings are
            a buyer watchlist, not a booking recommendation. We reconfirm RERA,
            phase inventory, EOI refund terms and the official cost sheet before
            a buyer transfers any amount.
          </p>
        </div>

        <div className="sticky top-20 z-30 rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(7,26,47,.09)] backdrop-blur-xl sm:p-5">
          <div className="grid grid-cols-[1fr_auto] gap-3 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by project, builder, area or lifestyle"
                className="h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-12 pr-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] focus:bg-white"
              />
            </label>
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              aria-expanded={filtersOpen}
              className="inline-flex h-13 items-center justify-center rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm font-semibold text-[#071a2f] lg:hidden"
            >
              <SlidersHorizontal className="mr-2 size-4 text-[#b08a16]" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-[#071a2f] text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={cn(
                  "ml-2 size-4 transition",
                  filtersOpen && "rotate-180"
                )}
              />
            </button>
            <select
              value={builder}
              onChange={(event) => setBuilder(event.target.value)}
              aria-label="Builder"
              className="hidden h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:block"
            >
              {builders.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={corridor}
              onChange={(event) => setCorridor(event.target.value)}
              aria-label="Bengaluru corridor"
              className="hidden h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:block"
            >
              {corridors.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              aria-label="Project stage"
              className="hidden h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] lg:block"
            >
              {stages.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div
            className={cn(
              "mt-3 grid gap-3 lg:hidden",
              !filtersOpen && "hidden"
            )}
          >
            <select
              value={builder}
              onChange={(event) => setBuilder(event.target.value)}
              aria-label="Builder"
              className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]"
            >
              {builders.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={corridor}
              onChange={(event) => setCorridor(event.target.value)}
              aria-label="Bengaluru corridor"
              className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]"
            >
              {corridors.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              aria-label="Project stage"
              className="h-12 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]"
            >
              {stages.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div
            className={cn(
              "mt-3 flex flex-wrap items-center gap-2",
              !filtersOpen && "hidden lg:flex"
            )}
          >
            {configurations.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setConfiguration(item)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition",
                  configuration === item
                    ? "border-[#071a2f] bg-[#071a2f] text-white"
                    : "border-slate-200 text-slate-500 hover:border-[#c9a227] hover:text-[#071a2f]"
                )}
              >
                {item === "Any BHK" ? item : `${item} BHK`}
              </button>
            ))}
            <select
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              aria-label="Property type"
              className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 outline-none focus:border-[#c9a227]"
            >
              {propertyTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              aria-label="Price band"
              className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 outline-none focus:border-[#c9a227]"
            >
              {priceBands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setFavouritesOnly((current) => !current)}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold transition",
                favouritesOnly
                  ? "border-rose-500 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500"
              )}
            >
              <Heart className={cn("mr-2 size-4", favouritesOnly && "fill-current")} />
              Saved ({favourites.length})
            </button>
            <button
              type="button"
              onClick={() => setRecentOnly((current) => !current)}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold transition",
                recentOnly
                  ? "border-[#c9a227] bg-[#fff8df] text-[#7a5b08]"
                  : "border-slate-200 text-slate-500 hover:border-[#c9a227] hover:text-[#071a2f]"
              )}
            >
              <Clock3 className="mr-2 size-4" />
              Recently viewed ({recent.length})
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-9 items-center rounded-full px-3 text-xs font-semibold text-slate-400 hover:text-[#071a2f]"
              >
                <X className="mr-1 size-4" />
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#071a2f] px-5 text-xs font-bold text-white lg:hidden"
            >
              Show {filtered.length} matching project{filtered.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#071a2f]">
              {filtered.length} matching project{filtered.length === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Pricing and availability are confirmed before every site visit.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort projects"
              className="h-11 max-w-[170px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#071a2f] outline-none focus:border-[#c9a227]"
            >
              {sortOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="hidden rounded-xl border border-slate-200 bg-white p-1 sm:flex">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  view === "grid" ? "bg-[#071a2f] text-white" : "text-slate-400"
                )}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView("list")}
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  view === "list" ? "bg-[#071a2f] text-white" : "text-slate-400"
                )}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {filtered.length ? (
          <div
            className={cn(
              "mt-6 grid gap-6",
              view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}
          >
            {filtered.slice(0, visibleCount).map((project) => {
              const slug = projectSlug(project.name);
              const isSaved = favourites.includes(slug);
              const isCompared = comparison.includes(slug);
              const personalFit = scoreProject(project, buyerPreferences);
              return (
                <article
                  key={project.name}
                  className={cn(
                    "group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(7,26,47,.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(7,26,47,.12)]",
                    view === "list" && "md:grid md:grid-cols-[360px_1fr]"
                  )}
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden bg-slate-200",
                      view === "list" && "md:aspect-auto md:min-h-[310px]"
                    )}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.name} by ${project.developer}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes={view === "grid" ? "(max-width: 768px) 100vw, 33vw" : "360px"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/75 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#071a2f] backdrop-blur">
                      {project.status === "Coming soon"
                        ? "EOI / Coming soon"
                        : project.status}
                    </span>
                    {buyerPreferences.customized && (
                      <span className="absolute left-4 top-14 rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-700 shadow-md">
                        {personalFit.score}% personal fit
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavourite(slug)}
                      aria-label={isSaved ? `Remove ${project.name} from saved` : `Save ${project.name}`}
                      className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/92 text-[#071a2f] shadow-md transition hover:scale-105"
                    >
                      <Heart className={cn("size-5", isSaved && "fill-rose-500 text-rose-500")} />
                    </button>
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                        {project.developer}
                      </p>
                      <h2 className="mt-1 text-3xl font-medium text-white">
                        {project.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <Link
                        href={`/builders/${developerSlug(project.developer)}`}
                        aria-label={`View ${project.developer} builder profile`}
                        className="group/builder flex items-center gap-3"
                      >
                        <span className="relative block h-8 w-28">
                          <Image
                            src={developerLogos[project.developer]}
                            alt={`${project.developer} logo`}
                            fill
                            className="object-contain object-left"
                            sizes="112px"
                            unoptimized={developerLogos[project.developer]?.endsWith(".svg")}
                          />
                        </span>
                        <span className="hidden text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 transition group-hover/builder:text-[#a47b10] sm:inline">
                          Builder profile
                        </span>
                      </Link>
                      <span className="rounded-full bg-[#f5f6f8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Checked {project.verifiedAt}
                      </span>
                    </div>
                    {buyerPreferences.customized && (
                      <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-800">
                            <Target className="size-3.5" /> Why it fits you
                          </p>
                          <span className="text-xs font-extrabold text-emerald-700">
                            {personalFit.score}/100
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-emerald-900/70">
                          {personalFit.reasons.join(" · ")}
                        </p>
                      </div>
                    )}
                    <p className="line-clamp-3 text-sm leading-7 text-slate-600">
                      {project.description}
                    </p>
                    {(project.buyerNotes?.[0] || project.highlights[0]) && (
                      <div className="mt-4 flex gap-3 rounded-2xl bg-[#f7f8fa] p-4">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Why consider
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#071a2f]">
                            {project.buyerNotes?.[0] || project.highlights[0]}
                          </p>
                        </div>
                      </div>
                    )}
                    {(project.propertyType || project.unitSizes) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.propertyType && (
                          <span className="rounded-full bg-[#fff7dc] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7a5b08]">
                            {project.propertyType}
                          </span>
                        )}
                        {project.unitSizes && (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                            {project.unitSizes}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {[
                        { icon: MapPin, value: project.location },
                        { icon: BedDouble, value: project.configuration },
                        { icon: IndianRupee, value: project.price },
                        { icon: Building2, value: project.corridor },
                      ].map(({ icon: Icon, value }) => (
                        <div key={value} className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                          <Icon className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Link
                        href={`/projects/${slug}`}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-[#071a2f] px-5 text-sm font-semibold text-white transition hover:bg-[#0d2948]"
                      >
                        See full details
                        <ArrowUpRight className="ml-2 size-4" />
                      </Link>
                      <a
                        href={`https://wa.me/919019697170?text=${encodeURIComponent(
                          `Hi Asher Realty, please share the latest details and site-visit options for ${project.name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-[#c9a227] px-5 text-sm font-semibold text-[#071a2f] transition hover:bg-[#c9a227]"
                      >
                        Ask on WhatsApp
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleComparison(slug, project.name)}
                      aria-pressed={isCompared}
                      className={cn(
                        "mt-4 inline-flex items-center justify-center rounded-full py-2 text-xs font-semibold transition",
                        isCompared
                          ? "bg-[#c9a227]/12 text-[#7a5b08]"
                          : "text-slate-400 hover:bg-slate-50 hover:text-[#071a2f]"
                      )}
                    >
                      <GitCompareArrows className="mr-2 size-4 text-[#b08a16]" />
                      {isCompared ? "Added to comparison" : "Add to comparison"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white py-20 text-center">
            <SlidersHorizontal className="mx-auto size-9 text-[#c9a227]" />
            <h2 className="mt-5 text-3xl font-medium text-[#071a2f]">
              No project matches every filter
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Clear one or two filters, or ask Asher Realty to check newly
              registered and invitation-only inventory.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-[#071a2f] px-6 py-3 text-sm font-semibold text-white"
            >
              Reset filters
            </button>
          </div>
        )}

        {filtered.length > visibleCount && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + 9)}
              className="inline-flex h-13 items-center justify-center rounded-full border border-[#071a2f]/15 bg-white px-7 text-sm font-semibold text-[#071a2f] shadow-sm transition hover:border-[#c9a227] hover:shadow-lg"
            >
              Show more projects
              <span className="ml-2 text-slate-400">
                ({filtered.length - visibleCount} remaining)
              </span>
            </button>
          </div>
        )}

        {comparisonNotice && (
          <div
            role="status"
            className="fixed bottom-24 right-4 z-[80] max-w-sm rounded-2xl border border-[#c9a227]/25 bg-[#071a2f] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_55px_rgba(0,0,0,.28)] lg:bottom-24 lg:right-7"
          >
            <span className="text-[#e4c462]">Compare:</span>{" "}
            {comparisonNotice}
          </div>
        )}
      </div>
    </section>
  );
}
