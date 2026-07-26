"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  Clock3,
  Heart,
  IndianRupee,
  LayoutGrid,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "asher-favourite-projects";
const RECENT_KEY = "asher-recent-projects";

const builders = ["All", ...Array.from(new Set(projects.map((project) => project.developer)))];
const corridors = ["All corridors", ...Array.from(new Set(projects.map((project) => project.corridor)))];
const stages = ["All stages", ...Array.from(new Set(projects.map((project) => project.status)))];
const configurations = ["Any BHK", "1", "2", "3", "4"];

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

export default function ProjectMarketplace() {
  const [query, setQuery] = useState("");
  const [builder, setBuilder] = useState("All");
  const [corridor, setCorridor] = useState("All corridors");
  const [stage, setStage] = useState("All stages");
  const [configuration, setConfiguration] = useState("Any BHK");
  const [price, setPrice] = useState("Any price");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setFavourites(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
      } catch {
        setFavourites([]);
        setRecent([]);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter((project) => {
      const slug = projectSlug(project.name);
      const matchesText =
        !term ||
        [
          project.name,
          project.developer,
          project.location,
          project.corridor,
          project.configuration,
          project.status,
          project.description,
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
        (price === "Any price" || priceBand(project.price) === price) &&
        (!favouritesOnly || favourites.includes(slug)) &&
        (!recentOnly || recent.includes(slug))
      );
    });
  }, [
    builder,
    configuration,
    corridor,
    favourites,
    favouritesOnly,
    price,
    query,
    recent,
    recentOnly,
    stage,
  ]);

  function toggleFavourite(slug: string) {
    setFavourites((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function resetFilters() {
    setQuery("");
    setBuilder("All");
    setCorridor("All corridors");
    setStage("All stages");
    setConfiguration("Any BHK");
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
    price !== "Any price" ||
    favouritesOnly ||
    recentOnly;

  return (
    <section className="bg-[#f4f5f7] pb-24 pt-10">
      <div className="container-shell">
        <div className="sticky top-20 z-30 rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(7,26,47,.09)] backdrop-blur-xl sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by project, builder, area or lifestyle"
                className="h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-12 pr-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227] focus:bg-white"
              />
            </label>
            <select
              value={builder}
              onChange={(event) => setBuilder(event.target.value)}
              aria-label="Builder"
              className="h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]"
            >
              {builders.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={corridor}
              onChange={(event) => setCorridor(event.target.value)}
              aria-label="Bengaluru corridor"
              className="h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]"
            >
              {corridors.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              aria-label="Project stage"
              className="h-13 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none focus:border-[#c9a227]"
            >
              {stages.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
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
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
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

        {filtered.length ? (
          <div
            className={cn(
              "mt-6 grid gap-6",
              view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}
          >
            {filtered.map((project) => {
              const slug = projectSlug(project.name);
              const isSaved = favourites.includes(slug);
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
                      {project.status}
                    </span>
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
                    <p className="line-clamp-3 text-sm leading-7 text-slate-600">
                      {project.description}
                    </p>
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
                    <div className="mt-6 flex gap-3">
                      <Link
                        href={`/projects/${slug}`}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-[#071a2f] px-5 text-sm font-semibold text-white transition hover:bg-[#0d2948]"
                      >
                        View project
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
                        Enquire
                      </a>
                    </div>
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
      </div>
    </section>
  );
}
