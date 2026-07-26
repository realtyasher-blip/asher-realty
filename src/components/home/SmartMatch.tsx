"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

import { projectSlug, projects } from "@/data/projects";

const locationGroups: Record<string, string[]> = {
  East: ["Whitefield", "Hoskote", "Old Madras"],
  North: ["Devanahalli", "Yelahanka", "Aerospace"],
  South: ["Bannerghatta", "Akshayanagar"],
  Flexible: [],
};

export default function SmartMatch() {
  const [location, setLocation] = useState("Flexible");
  const [configuration, setConfiguration] = useState("3");
  const [purpose, setPurpose] = useState("Self-use");
  const [showResults, setShowResults] = useState(false);

  const matches = useMemo(() => {
    const terms = locationGroups[location] ?? [];
    return projects
      .map((project) => {
        let score = 58;
        if (!terms.length || terms.some((term) => project.location.includes(term))) score += 22;
        if (project.configuration.includes(configuration)) score += 12;
        if (purpose === "Investment" && /North|Whitefield|Hoskote|Devanahalli/.test(project.location)) score += 8;
        if (purpose === "Self-use" && project.highlights.length >= 3) score += 6;
        return { project, score: Math.min(score, 96) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [configuration, location, purpose]);

  return (
    <section id="ai-match" className="overflow-hidden bg-[#071a2f] py-24 text-white sm:py-28">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              <Sparkles className="size-4" />
              Asher Smart Match
            </span>
            <h2 className="mt-6 text-5xl font-medium leading-tight sm:text-6xl">
              A smarter first shortlist—in under a minute.
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-white/62">
              Our matching model scores the current catalogue against your
              location, home size and buying purpose. An advisor then verifies
              price and availability.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex gap-3">
                <Bot className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                <p className="text-xs leading-6 text-white/48">
                  This is a transparent recommendation tool, not financial
                  advice. Scores indicate requirement fit—not guaranteed returns.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_30px_100px_rgba(0,0,0,.2)] backdrop-blur sm:p-8">
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { label: "Preferred corridor", value: location, setter: setLocation, options: ["Flexible", "East", "North", "South"] },
                { label: "Home size", value: configuration, setter: setConfiguration, options: ["1", "2", "3", "4"] },
                { label: "Buying for", value: purpose, setter: setPurpose, options: ["Self-use", "Investment"] },
              ].map(({ label, value, setter, options }) => (
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
                onClick={() => setShowResults(true)}
                className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#c9a227] px-8 font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                <Sparkles className="mr-2 size-5" />
                Find My Best Matches
              </button>
            ) : (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">Your best matches</p>
                    <p className="mt-1 text-sm text-white/48">Ranked from the current Asher Realty catalogue</p>
                  </div>
                  <button type="button" onClick={() => setShowResults(false)} className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/55 hover:text-white" aria-label="Reset matches">
                    <RotateCcw className="size-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {matches.map(({ project, score }, index) => (
                    <article key={project.name} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[#061727]/70 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <Image src={project.image} alt={project.name} fill className="object-cover" sizes="120px" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e4c462]">#{index + 1} · {project.developer}</p>
                        <h3 className="mt-1 text-xl font-medium">{project.name}</h3>
                        <p className="mt-2 text-xs leading-5 text-white/48">{project.location} · {project.configuration}</p>
                      </div>
                      <div className="sm:text-right">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                          <CheckCircle2 className="size-4" />
                          {score}% fit
                        </div>
                        <Link href={`/projects/${projectSlug(project.name)}`} className="mt-3 flex items-center text-xs font-bold text-white hover:text-[#e4c462] sm:justify-end">
                          View match <ArrowRight className="ml-1.5 size-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
