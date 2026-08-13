"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Home,
  IndianRupee,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";

const searchAreas = [
  { label: "Whitefield / ITPL", workHub: "Whitefield / ITPL" },
  { label: "ORR / Bellandur", workHub: "ORR / Bellandur" },
  { label: "Manyata / Hebbal", workHub: "Manyata Tech Park" },
  { label: "Electronic City", workHub: "Electronic City" },
  { label: "Airport / Devanahalli", workHub: "Airport / Devanahalli" },
  { label: "Central Bengaluru", workHub: "CBD / MG Road" },
];

const configurations = ["2", "3", "4"];
const budgets = ["Up to ₹2 Cr", "₹2–3 Cr", "₹3 Cr+"];

const advisorUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
  "Hi Asher Realty, I would like help finding the right home in Bengaluru."
)}`;

export default function Hero() {
  const [area, setArea] = useState("");
  const [configuration, setConfiguration] = useState("3");
  const [budget, setBudget] = useState("");

  const resultsUrl = useMemo(() => {
    const params = new URLSearchParams();
    const selectedArea = searchAreas.find((item) => item.label === area);

    if (selectedArea) {
      params.set("workHub", selectedArea.workHub);
    }
    if (configuration) params.set("bhk", configuration);
    if (budget) params.set("budget", budget);

    return `/home-match?${params.toString()}`;
  }, [area, budget, configuration]);

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
      <div className="absolute inset-0 bg-gradient-to-r from-[#03111d] via-[#061827]/92 to-[#061827]/34" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03111d] via-transparent to-[#03111d]/50" />
      <div className="premium-grid absolute inset-0 opacity-25" />

      <div className="container-shell relative flex min-h-screen items-center pb-14 pt-32 sm:pt-36">
        <div className="w-full max-w-5xl">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-[#e4c462]/25 bg-[#c9a227]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#f0d477] backdrop-blur-xl">
            <ShieldCheck className="size-4" />
            Buy · rent · sell · rent out · Bengaluru
          </div>

          <h1 className="hero-reveal hero-delay-1 mt-7 max-w-4xl text-[3.25rem] font-medium leading-[0.96] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">
            Everything property.
            <span className="mt-2 block bg-gradient-to-r from-[#fff3c4] via-[#e4c462] to-[#b98e17] bg-clip-text text-transparent">
              One Bengaluru desk.
            </span>
          </h1>

          <p className="hero-reveal hero-delay-2 mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            Find a home, rent one, sell, rent out or coordinate the next step.
            Start with your need and move through one clear, managed journey.
          </p>

          <div className="hero-reveal hero-delay-3 mt-7 flex flex-wrap gap-2">
            <Link href="/projects" className="inline-flex h-11 items-center rounded-full bg-white px-4 text-xs font-bold text-[#071a2f]"><Search className="mr-2 size-4 text-[#9a7410]" />Buy</Link>
            <Link href="/rent" className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/[.06] px-4 text-xs font-bold text-white backdrop-blur"><KeyRound className="mr-2 size-4 text-[#e4c462]" />Rent</Link>
            <Link href="/post-property?intent=sell" className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/[.06] px-4 text-xs font-bold text-white backdrop-blur"><Building2 className="mr-2 size-4 text-[#e4c462]" />Sell</Link>
            <Link href="/post-property?intent=rent" className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/[.06] px-4 text-xs font-bold text-white backdrop-blur"><Home className="mr-2 size-4 text-[#e4c462]" />Rent out</Link>
          </div>

          <div className="hero-reveal hero-delay-4 mt-5 max-w-5xl rounded-[1.75rem] border border-white/14 bg-[#041421]/78 p-3 shadow-[0_25px_90px_rgba(0,0,0,.3)] backdrop-blur-2xl">
            <div className="grid gap-2 lg:grid-cols-[1.25fr_.8fr_.9fr_auto]">
              <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/[0.07] px-4 transition focus-within:bg-white/[0.11]">
                <MapPin className="size-5 shrink-0 text-[#e4c462]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/38">
                    Near work or preferred area
                  </span>
                  <select
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                    className="dark-select mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
                  >
                    <option value="" className="text-[#071a2f]">
                      Anywhere in Bengaluru
                    </option>
                    {searchAreas.map((item) => (
                      <option key={item.label} value={item.label} className="text-[#071a2f]">
                        {item.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/[0.07] px-4 transition focus-within:bg-white/[0.11]">
                <BedDouble className="size-5 shrink-0 text-[#e4c462]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/38">
                    Home size
                  </span>
                  <select
                    value={configuration}
                    onChange={(event) => setConfiguration(event.target.value)}
                    className="dark-select mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
                  >
                    {configurations.map((item) => (
                      <option key={item} value={item} className="text-[#071a2f]">
                        {item} BHK
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/[0.07] px-4 transition focus-within:bg-white/[0.11]">
                <IndianRupee className="size-5 shrink-0 text-[#e4c462]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/38">
                    Budget
                  </span>
                  <select
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className="dark-select mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
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
                data-analytics-label="Hero build matched shortlist"
                className="shine-button inline-flex min-h-16 items-center justify-center rounded-2xl bg-[#d5ad2d] px-7 text-sm font-bold text-[#071a2f] transition hover:bg-[#f0d477]"
              >
                <Search className="mr-2 size-5" />
                Show my matches
              </Link>
            </div>
          </div>

          <div className="hero-reveal hero-delay-4 mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <p className="text-xs font-semibold text-white/50">
              No sign-up required · Change your preferences anytime
            </p>
            <a
              href="#discover"
              className="inline-flex w-fit items-center text-xs font-bold text-[#e4c462] transition hover:text-white"
            >
              Not ready to search? Explore by lifestyle
              <ArrowRight className="ml-2 size-4" />
            </a>
            <a
              href={advisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-label="Hero advisor help"
              className="inline-flex w-fit items-center text-xs font-bold text-white transition hover:text-[#e4c462]"
            >
              <MessageCircle className="mr-2 size-4 text-[#e4c462]" />
              Ask a buyer advisor
              <ArrowRight className="ml-2 size-4" />
            </a>
            <Link
              href="/projects"
              className="inline-flex w-fit items-center text-xs font-bold text-white/55 transition hover:text-white"
            >
              Or browse all projects
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
