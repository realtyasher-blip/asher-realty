"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  Database,
  IndianRupee,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";

const locations = [
  "Whitefield",
  "Sarjapur Road",
  "North Bengaluru",
  "Hebbal",
  "Devanahalli",
];
const homeTypes = ["Apartment", "Villa", "Row House", "Investment property"];
const budgets = ["₹50L–₹1Cr", "₹1Cr–₹2Cr", "₹2Cr–₹3Cr", "₹3Cr+"];

const locationCorridors: Record<string, string> = {
  Whitefield: "East Bengaluru",
  "Sarjapur Road": "East Bengaluru",
  "North Bengaluru": "North Bengaluru",
  Hebbal: "North Bengaluru",
  Devanahalli: "North Bengaluru",
};

const budgetBands: Record<string, string> = {
  "₹50L–₹1Cr": "Up to ₹2 Cr",
  "₹1Cr–₹2Cr": "Up to ₹2 Cr",
  "₹2Cr–₹3Cr": "₹2–3 Cr",
  "₹3Cr+": "₹3 Cr+",
};

const spotlightProjects = projects.filter((project) => project.featured).slice(0, 4);

export default function Hero() {
  const [location, setLocation] = useState("");
  const [homeType, setHomeType] = useState("");
  const [budget, setBudget] = useState("");
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const spotlight = spotlightProjects[spotlightIndex] || projects[0];
  const developerCount = new Set(projects.map((project) => project.developer)).size;
  const reraCoverage = Math.round(
    (projects.filter((project) => project.rera).length / projects.length) * 100
  );

  const resultsUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (location) {
      params.set("q", location);
      params.set("corridor", locationCorridors[location]);
    }
    if (homeType) params.set("type", homeType);
    if (budget) params.set("price", budgetBands[budget]);

    const search = params.toString();
    return search ? `/projects?${search}` : "/projects";
  }, [budget, homeType, location]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#041421] text-white">
      <Image
        src="/images/hero-property-v2.png"
        alt="Premium residential community in Bengaluru at twilight"
        fill
        preload
        className="object-cover object-[68%_center]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03111d] via-[#061827]/90 to-[#061827]/24" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03111d] via-transparent to-[#03111d]/50" />
      <div className="premium-grid absolute inset-0 opacity-35" />
      <div className="absolute -left-32 top-1/4 size-[34rem] rounded-full bg-[#315b7a]/15 blur-[120px]" />
      <div className="absolute right-0 top-0 size-[30rem] rounded-full bg-[#c9a227]/10 blur-[120px]" />

      <div className="container-shell relative pb-12 pt-32 sm:pt-36">
        <div className="grid min-h-[560px] gap-12 xl:grid-cols-[1.08fr_.72fr] xl:items-center">
          <div className="max-w-4xl">
            <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-[#e4c462]/25 bg-[#c9a227]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f0d477] backdrop-blur-xl">
              <Sparkles className="size-4" />
              Bengaluru&apos;s buyer intelligence platform
            </div>

            <h1 className="hero-reveal hero-delay-1 mt-7 max-w-4xl text-6xl font-medium leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-[6.2rem]">
              Property search,
              <span className="mt-2 block bg-gradient-to-r from-[#fff3c4] via-[#e4c462] to-[#b98e17] bg-clip-text text-transparent">
                upgraded to intelligence.
              </span>
            </h1>

            <p className="hero-reveal hero-delay-2 mt-7 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
              Discover, compare and verify premium Bengaluru homes through one
              beautifully organised decision platform—with AI matching and a
              buyer-side advisor when the details matter.
            </p>

            <div className="hero-reveal hero-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/decision-lab"
                className="shine-button inline-flex h-14 items-center justify-center rounded-full bg-[#d5ad2d] px-7 text-sm font-bold text-[#071a2f] transition hover:-translate-y-0.5 hover:bg-[#f0d477]"
              >
                <Bot className="mr-2 size-5" />
                Open my Decision Lab
              </Link>
              <Link
                href="/intelligence"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/16 bg-white/[0.07] px-7 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#c9a227]/55 hover:bg-white/[0.11]"
              >
                Open market intelligence
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>

            <div className="hero-reveal hero-delay-4 mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold text-white/48">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                Independent buyer guidance
              </span>
              <span className="inline-flex items-center gap-2">
                <Database className="size-4 text-[#e4c462]" />
                Source-led catalogue
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="live-pulse" />
                Market desk refreshed daily
              </span>
            </div>
          </div>

          <aside className="hero-reveal hero-delay-3 hidden xl:block">
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 shadow-[0_40px_120px_rgba(0,0,0,.35)]">
              <div className="flex items-center justify-between px-2 pb-4 pt-1">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                    Live buyer desk
                  </p>
                  <p className="mt-1 text-xs text-white/42">
                    Curated project spotlight
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-bold text-emerald-300">
                  <span className="live-pulse" />
                  Updated
                </span>
              </div>

              <div className="group relative aspect-[16/11] overflow-hidden rounded-[1.5rem]">
                <Image
                  key={spotlight.image}
                  src={spotlight.image}
                  alt={`${spotlight.name} in Bengaluru`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="460px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041421] via-[#041421]/12 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#041421]/65 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
                  {spotlight.status}
                </div>
                <div className="absolute inset-x-5 bottom-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e4c462]">
                    {spotlight.developer}
                  </p>
                  <h2 className="mt-1 text-3xl font-medium">{spotlight.name}</h2>
                  <p className="mt-1 text-[11px] text-white/55">
                    {spotlight.location}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/[0.06] p-3">
                  <p className="text-lg font-bold">{projects.length}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/35">
                    Projects
                  </p>
                </div>
                <div className="rounded-2xl bg-white/[0.06] p-3">
                  <p className="text-lg font-bold">{developerCount}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/35">
                    Builders
                  </p>
                </div>
                <div className="rounded-2xl bg-white/[0.06] p-3">
                  <p className="text-lg font-bold">{reraCoverage}%</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/35">
                    RERA listed
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 px-1">
                <div className="flex gap-2">
                  {spotlightProjects.map((project, index) => (
                    <button
                      key={project.name}
                      type="button"
                      onClick={() => setSpotlightIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === spotlightIndex
                          ? "w-8 bg-[#e4c462]"
                          : "w-3 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Show ${project.name}`}
                    />
                  ))}
                </div>
                <Link
                  href={`/projects/${projectSlug(spotlight.name)}`}
                  className="inline-flex items-center text-[10px] font-bold text-white transition hover:text-[#e4c462]"
                >
                  Explore project
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="hero-reveal hero-delay-4 mt-8 rounded-[1.75rem] border border-white/14 bg-[#041421]/68 p-3 shadow-[0_25px_90px_rgba(0,0,0,.28)] backdrop-blur-2xl xl:mt-3">
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/[0.065] px-4 transition focus-within:bg-white/[0.1]">
              <MapPin className="size-5 shrink-0 text-[#e4c462]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-white/35">
                  Location
                </span>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  <option value="" className="text-[#071a2f]">
                    Anywhere in Bengaluru
                  </option>
                  {locations.map((item) => (
                    <option key={item} value={item} className="text-[#071a2f]">
                      {item}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/[0.065] px-4 transition focus-within:bg-white/[0.1]">
              <Building2 className="size-5 shrink-0 text-[#e4c462]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-white/35">
                  Property
                </span>
                <select
                  value={homeType}
                  onChange={(event) => setHomeType(event.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  <option value="" className="text-[#071a2f]">
                    Any home type
                  </option>
                  {homeTypes.map((item) => (
                    <option key={item} value={item} className="text-[#071a2f]">
                      {item}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/[0.065] px-4 transition focus-within:bg-white/[0.1]">
              <IndianRupee className="size-5 shrink-0 text-[#e4c462]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-white/35">
                  Budget
                </span>
                <select
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  <option value="" className="text-[#071a2f]">
                    Flexible budget
                  </option>
                  {budgets.map((item) => (
                    <option key={item} value={item} className="text-[#071a2f]">
                      {item}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <Link
              href={resultsUrl}
              data-analytics-label="Hero property search"
              className="shine-button inline-flex min-h-16 items-center justify-center rounded-2xl bg-[#d5ad2d] px-8 text-sm font-bold text-[#071a2f] transition hover:bg-[#f0d477]"
            >
              <Search className="mr-2 size-5" />
              Explore matches
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
