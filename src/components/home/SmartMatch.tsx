"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  GitCompareArrows,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import { trackEvent } from "@/lib/analytics";

const corridorMap: Record<string, string> = {
  East: "East Bengaluru",
  North: "North Bengaluru",
  South: "South Bengaluru",
  Central: "Central Bengaluru",
};

const fields = {
  location: ["Flexible", "East", "North", "South", "Central"],
  configuration: ["1", "2", "3", "4"],
  budget: ["Flexible", "Up to ₹2 Cr", "₹2–3 Cr", "₹3 Cr+"],
  purpose: ["Self-use", "Investment"],
  timeline: ["Within 3 months", "3–6 months", "6–12 months", "Exploring"],
  priority: ["Easy commute", "More space", "Lifestyle amenities", "Growth potential"],
};

function projectPriceCrores(price: string) {
  const match = price.match(/₹(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function budgetFits(price: string, budget: string) {
  const crores = projectPriceCrores(price);
  if (budget === "Flexible" || crores === null) return true;
  if (budget === "Up to ₹2 Cr") return crores <= 2;
  if (budget === "₹2–3 Cr") return crores >= 2 && crores <= 3;
  return crores >= 3;
}

export default function SmartMatch() {
  const [location, setLocation] = useState("Flexible");
  const [configuration, setConfiguration] = useState("3");
  const [budget, setBudget] = useState("Flexible");
  const [purpose, setPurpose] = useState("Self-use");
  const [timeline, setTimeline] = useState("3–6 months");
  const [priority, setPriority] = useState("Easy commute");
  const [showResults, setShowResults] = useState(false);

  const matches = useMemo(() => {
    const preferredCorridor = corridorMap[location];

    return projects
      .map((project) => {
        let score = 42;
        const reasons: string[] = [];

        if (!preferredCorridor || project.corridor === preferredCorridor) {
          score += 20;
          reasons.push(
            preferredCorridor ? `${location} corridor match` : "Flexible location fit"
          );
        }
        if (project.configuration.includes(configuration)) {
          score += 14;
          reasons.push(`${configuration} BHK available`);
        }
        if (budgetFits(project.price, budget)) {
          score += 12;
          reasons.push(
            projectPriceCrores(project.price) === null
              ? "Live price verification"
              : "Within selected budget band"
          );
        }
        if (
          purpose === "Investment" &&
          ["North Bengaluru", "East Bengaluru"].includes(project.corridor)
        ) {
          score += 6;
          reasons.push("Growth-corridor potential");
        }
        if (purpose === "Self-use" && project.highlights.length >= 3) {
          score += 5;
          reasons.push("Strong lifestyle programme");
        }
        if (
          priority === "Growth potential" &&
          ["North Bengaluru", "East Bengaluru"].includes(project.corridor)
        ) {
          score += 5;
          reasons.push("Infrastructure-led corridor");
        } else if (priority === "More space" && /3|4/.test(project.configuration)) {
          score += 5;
          reasons.push("Larger-home options");
        } else if (
          priority === "Lifestyle amenities" &&
          project.highlights.length >= 3
        ) {
          score += 5;
          reasons.push("Amenity-rich community");
        } else if (priority === "Easy commute") {
          score += 3;
          reasons.push("Employment-corridor access");
        }
        if (
          timeline === "Within 3 months" &&
          project.status === "Under construction"
        ) {
          score += 3;
        }

        return {
          project,
          score: Math.min(score, 97),
          reasons: reasons.slice(0, 3),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [budget, configuration, location, priority, purpose, timeline]);

  const comparisonUrl = `/compare?projects=${matches
    .slice(0, 2)
    .map(({ project }) => projectSlug(project.name))
    .join(",")}`;
  const shortlistMessage = encodeURIComponent(
    `Hi Asher Realty, my Smart Match shortlist is ${matches
      .map(({ project }) => project.name)
      .join(", ")}. My preference is ${configuration} BHK, ${location} Bengaluru, ${budget}, for ${purpose.toLowerCase()}, with a ${timeline.toLowerCase()} timeline. Please verify current pricing and availability.`
  );

  function revealMatches() {
    trackEvent("smart_match_completed", {
      preferred_corridor: location,
      configuration: `${configuration} BHK`,
      budget_band: budget,
      buying_purpose: purpose,
      purchase_timeline: timeline,
      lifestyle_priority: priority,
      top_match: matches[0]?.project.name,
    });
    setShowResults(true);
  }

  const controls = [
    { label: "Preferred corridor", value: location, setter: setLocation, options: fields.location },
    { label: "Home size", value: configuration, setter: setConfiguration, options: fields.configuration },
    { label: "Budget", value: budget, setter: setBudget, options: fields.budget },
    { label: "Buying for", value: purpose, setter: setPurpose, options: fields.purpose },
    { label: "Purchase timeline", value: timeline, setter: setTimeline, options: fields.timeline },
    { label: "Top priority", value: priority, setter: setPriority, options: fields.priority },
  ];

  return (
    <section id="ai-match" className="content-auto-section overflow-hidden bg-[#071a2f] py-24 text-white sm:py-28">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              <Sparkles className="size-4" />
              Asher Smart Match
            </span>
            <h2 className="mt-6 text-5xl font-medium leading-tight sm:text-6xl">
              Your Bengaluru shortlist, explained.
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-white/62">
              Tell us what matters. The matcher ranks the live catalogue and
              explains the strongest fit signals, so you can compare confidently.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex gap-3">
                <Bot className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                <p className="text-xs leading-6 text-white/48">
                  This transparent recommendation model uses catalogue attributes,
                  not personal financial data. An advisor verifies price,
                  inventory and possession before you decide.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_30px_100px_rgba(0,0,0,.2)] backdrop-blur sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {controls.map(({ label, value, setter, options }) => (
                <label key={label}>
                  <span className="text-xs font-semibold text-white/55">{label}</span>
                  <select
                    value={value}
                    onChange={(event) => {
                      setter(event.target.value);
                      setShowResults(false);
                    }}
                    className="mt-2 h-13 w-full rounded-xl border border-white/10 bg-[#061727] px-4 text-sm font-semibold text-white outline-none focus:border-[#c9a227]"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {label === "Home size" ? `${option} BHK` : option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            {!showResults ? (
              <button
                type="button"
                onClick={revealMatches}
                className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#c9a227] px-8 font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                <Sparkles className="mr-2 size-5" />
                Build My Ranked Shortlist
              </button>
            ) : (
              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                      Your best matches
                    </p>
                    <p className="mt-1 text-sm text-white/48">
                      Ranked and explained from {projects.length} active projects
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResults(false)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/55 hover:text-white"
                    aria-label="Reset matches"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {matches.map(({ project, score, reasons }, index) => (
                    <article
                      key={project.name}
                      className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[#061727]/70 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <Image src={project.image} alt={project.name} fill className="object-cover" sizes="120px" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e4c462]">
                          #{index + 1} · {project.developer}
                        </p>
                        <h3 className="mt-1 text-xl font-medium">{project.name}</h3>
                        <p className="mt-2 text-xs leading-5 text-white/48">
                          {project.location} · {project.configuration}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {reasons.map((reason) => (
                            <span key={reason} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white/58">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                          <CheckCircle2 className="size-4" />
                          {score}% fit
                        </div>
                        <Link
                          href={`/projects/${projectSlug(project.name)}`}
                          className="mt-3 flex items-center text-xs font-bold text-white hover:text-[#e4c462] sm:justify-end"
                        >
                          View match <ArrowRight className="ml-1.5 size-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    href={comparisonUrl}
                    className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-white transition hover:border-[#c9a227] hover:text-[#e4c462]"
                  >
                    <GitCompareArrows className="mr-2 size-4" />
                    Compare top two
                  </Link>
                  <a
                    href={`https://wa.me/919019697170?text=${shortlistMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-label="Smart Match advisor handoff"
                    className="inline-flex h-13 items-center justify-center rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                  >
                    <MessageCircle className="mr-2 size-4" />
                    Verify my shortlist
                  </a>
                </div>
                <Link
                  href="/decision-lab"
                  className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-white/[0.06] px-5 text-xs font-bold text-white/65 transition hover:bg-white/[0.1] hover:text-[#e4c462]"
                >
                  Continue in the full Buyer Decision Lab
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
