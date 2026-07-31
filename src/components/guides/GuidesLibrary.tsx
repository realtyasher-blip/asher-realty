"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { guideCategories, guides } from "@/data/guides";

export default function GuidesLibrary() {
  const [category, setCategory] = useState<(typeof guideCategories)[number]>("All topics");
  const [query, setQuery] = useState("");

  const visibleGuides = useMemo(() => {
    const search = query.trim().toLowerCase();
    return guides.filter((guide) => {
      const categoryMatches = category === "All topics" || guide.category === category;
      const searchMatches =
        !search ||
        `${guide.title} ${guide.dek} ${guide.category} ${guide.keyTakeaways.join(" ")}`
          .toLowerCase()
          .includes(search);
      return categoryMatches && searchMatches;
    });
  }, [category, query]);

  return (
    <section className="bg-[#f5f6f8] py-20 sm:py-24">
      <div className="container-shell">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="flex h-13 items-center gap-3 rounded-xl bg-[#f7f8fa] px-4">
              <Search className="size-5 text-[#b08a16]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Khata, RERA, EMI, floor plans or locations"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#071a2f] outline-none placeholder:text-slate-400"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {guideCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`h-11 shrink-0 rounded-full px-4 text-[11px] font-bold transition ${
                    category === item
                      ? "bg-[#071a2f] text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-[#c9a227]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <SlidersHorizontal className="size-4 text-[#b08a16]" />
            {visibleGuides.length} practical guide{visibleGuides.length === 1 ? "" : "s"}
          </div>
          <p className="hidden text-xs text-slate-400 sm:block">Written for Bengaluru homebuyers</p>
        </div>

        {visibleGuides.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleGuides.map((guide, index) => (
              <article
                key={guide.slug}
                className={`group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_14px_50px_rgba(7,26,47,.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,26,47,.12)] ${
                  index === 0 && category === "All topics" && !query ? "md:col-span-2 xl:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 && category === "All topics" && !query
                      ? "aspect-[16/7]"
                      : "aspect-[16/9]"
                  }`}
                >
                  <Image
                    src={guide.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes={
                      index === 0
                        ? "(max-width: 768px) 100vw, 66vw"
                        : "(max-width: 768px) 100vw, 33vw"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/80 via-[#071a2f]/5 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-[#071a2f]/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4c462] backdrop-blur">
                    {guide.category}
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    <Clock3 className="size-3.5 text-[#b08a16]" />
                    {guide.readTime}
                    <span>·</span>
                    Updated {guide.updatedAt}
                  </div>
                  <h2 className="mt-4 text-3xl font-medium leading-tight text-[#071a2f]">
                    {guide.title}
                  </h2>
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">{guide.dek}</p>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="mt-6 inline-flex items-center text-xs font-bold text-[#071a2f] transition hover:text-[#b08a16]"
                  >
                    Read the guide
                    <ArrowUpRight className="ml-2 size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white py-20 text-center">
            <BookOpen className="mx-auto size-9 text-[#c9a227]" />
            <h2 className="mt-5 text-3xl font-medium text-[#071a2f]">No guide matches that search</h2>
            <p className="mt-3 text-sm text-slate-500">Try a broader word such as cost, document, loan or location.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All topics");
              }}
              className="mt-6 rounded-full bg-[#071a2f] px-6 py-3 text-xs font-bold text-white"
            >
              Show all guides
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
