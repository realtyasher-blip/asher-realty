"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  IndianRupee,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

const locations = ["Whitefield", "Sarjapur Road", "North Bengaluru", "Hebbal", "Devanahalli"];
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

export default function Hero() {
  const [location, setLocation] = useState("");
  const [homeType, setHomeType] = useState("");
  const [budget, setBudget] = useState("");

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
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-[#061727] text-white">
      <Image
        src="/images/hero-property-v2.png"
        alt="Premium residential community in Bengaluru at twilight"
        fill
        priority
        className="object-cover object-[68%_center]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061727] via-[#061727]/88 to-[#061727]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#061727]/65 via-transparent to-[#061727]/20" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="container-shell relative flex min-h-[92vh] items-center pb-16 pt-32">
        <div className="w-full max-w-4xl">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d477] backdrop-blur-md">
            <ShieldCheck className="size-4" />
            Independent Bengaluru property advisory
          </div>

          <h1 className="hero-reveal hero-delay-1 mt-7 max-w-3xl text-6xl font-medium leading-[0.92] tracking-[-0.035em] sm:text-7xl lg:text-[5.7rem]">
            Your next address,
            <span className="mt-2 block bg-gradient-to-r from-[#f3da86] to-[#c9a227] bg-clip-text text-transparent">
              chosen with clarity.
            </span>
          </h1>

          <p className="hero-reveal hero-delay-2 mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            Discover and compare premium Bengaluru homes through one trusted
            advisor—from first shortlist to guided site visit.
          </p>

          <div className="hero-reveal hero-delay-3 mt-9 rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-[0_25px_90px_rgba(0,0,0,.28)] backdrop-blur-xl">
            <div className="grid gap-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-[#061727]/55 px-4">
                <MapPin className="size-5 shrink-0 text-[#e4c462]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Location</span>
                  <select value={location} onChange={(event) => setLocation(event.target.value)} className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none">
                    <option value="" className="text-[#071a2f]">Anywhere in Bengaluru</option>
                    {locations.map((item) => <option key={item} value={item} className="text-[#071a2f]">{item}</option>)}
                  </select>
                </span>
              </label>

              <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-[#061727]/55 px-4">
                <Building2 className="size-5 shrink-0 text-[#e4c462]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Property</span>
                  <select value={homeType} onChange={(event) => setHomeType(event.target.value)} className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none">
                    <option value="" className="text-[#071a2f]">Any home type</option>
                    {homeTypes.map((item) => <option key={item} value={item} className="text-[#071a2f]">{item}</option>)}
                  </select>
                </span>
              </label>

              <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-[#061727]/55 px-4">
                <IndianRupee className="size-5 shrink-0 text-[#e4c462]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Budget</span>
                  <select value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none">
                    <option value="" className="text-[#071a2f]">Flexible budget</option>
                    {budgets.map((item) => <option key={item} value={item} className="text-[#071a2f]">{item}</option>)}
                  </select>
                </span>
              </label>

              <Link
                href={resultsUrl}
                data-analytics-label="Hero property search"
                className="inline-flex min-h-16 items-center justify-center rounded-2xl bg-[#d5ad2d] px-7 text-sm font-bold text-[#071a2f] transition hover:bg-[#f0d477]"
              >
                <Search className="mr-2 size-5" />
                Show matches
              </Link>
            </div>
          </div>

          <div className="hero-reveal hero-delay-4 mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/55">
            <span>Verified project information</span>
            <span className="hidden size-1 rounded-full bg-[#e4c462] sm:block" />
            <span>Private site-visit support</span>
            <span className="hidden size-1 rounded-full bg-[#e4c462] sm:block" />
            <Link href="/projects" className="inline-flex items-center font-semibold text-white transition hover:text-[#e4c462]">
              Browse all projects <ArrowRight className="ml-2 size-3.5" />
            </Link>
            <span className="hidden size-1 rounded-full bg-[#e4c462] sm:block" />
            <a
              href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20would%20like%20help%20finding%20a%20home%20in%20Bengaluru."
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white transition hover:text-[#e4c462]"
            >
              Ask an advisor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
