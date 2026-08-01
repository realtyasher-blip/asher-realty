"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Bot,
  Building2,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { projectSlug, projects, type Project } from "@/data/projects";
import { trackEvent } from "@/lib/analytics";

type Match = {
  project: Project;
  score: number;
  reasons: string[];
};

const quickPrompts = [
  "3 BHK near Whitefield under 3 Cr",
  "Family home near Manyata Tech Park",
  "Investment options near the airport",
  "Large 4 BHK with greenery",
];

function visiblePriceCrores(price: string) {
  const match = price.match(/₹\s?(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function queryBudgetCrores(query: string) {
  const crore = query.match(/(?:under|below|within|upto|up to)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:cr|crore)/i);
  if (crore) return Number(crore[1]);
  const lakh = query.match(/(?:under|below|within|upto|up to)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:l|lac|lakh)/i);
  return lakh ? Number(lakh[1]) / 100 : null;
}

function analyseQuery(query: string): Match[] {
  const text = query.toLowerCase();
  const bhk = text.match(/\b([1-4])\s*(?:bhk|bed|bedroom)/)?.[1];
  const budget = queryBudgetCrores(text);
  const wantsInvestment = /invest|appreciation|return|rental|growth/.test(text);
  const wantsGreen = /green|nature|garden|open space|lake/.test(text);
  const wantsLuxury = /luxury|premium|large|spacious|4 bhk|four bedroom/.test(text);
  const wantsSoon = /ready|soon|immediate|near possession/.test(text);

  const corridor =
    /whitefield|sarjapur|varthur|hoskote|budigere|old madras|east/.test(text)
      ? "East Bengaluru"
      : /airport|devanahalli|hebbal|manyata|yelahanka|thanisandra|kogilu|north/.test(text)
        ? "North Bengaluru"
        : /electronic|bannerghatta|kanakapura|rr nagar|mysore road|south/.test(text)
          ? "South Bengaluru"
          : /central|cbd|koramangala/.test(text)
            ? "Central Bengaluru"
            : null;

  return projects
    .map((project) => {
      let score = project.featured ? 46 : 40;
      const reasons: string[] = [];
      const searchable = `${project.name} ${project.location} ${project.corridor} ${project.configuration} ${project.description} ${project.highlights.join(" ")}`.toLowerCase();

      if (corridor && project.corridor === corridor) {
        score += 24;
        reasons.push(`${corridor.replace(" Bengaluru", "")} corridor fit`);
      } else if (!corridor) {
        score += 6;
      }

      if (bhk && project.configuration.includes(bhk)) {
        score += 16;
        reasons.push(`${bhk} BHK available`);
      }

      const price = visiblePriceCrores(project.price);
      if (budget && price !== null && price <= budget) {
        score += 16;
        reasons.push(`Visible starting price within ₹${budget} Cr`);
      } else if (budget && price === null) {
        score += 5;
        reasons.push("Price needs live verification");
      }

      if (wantsInvestment && ["North Bengaluru", "East Bengaluru"].includes(project.corridor)) {
        score += 8;
        reasons.push("Employment-led growth corridor");
      }
      if (wantsGreen && /green|garden|lake|nature|open|landscape|biophilic|forest/.test(searchable)) {
        score += 10;
        reasons.push("Strong landscape signal");
      }
      if (wantsLuxury && /3|4/.test(project.configuration)) {
        score += 7;
        reasons.push("Larger premium home options");
      }
      if (wantsSoon && /ready|2026|2027/.test(`${project.status} ${project.possession}`)) {
        score += 8;
        reasons.push("Earlier delivery signal");
      }

      if (/manyata/.test(text) && /manyata|thanisandra|rachenahalli|nagavara/.test(searchable)) {
        score += 16;
        reasons.push("Manyata commute relevance");
      }
      if (/airport/.test(text) && /airport|devanahalli|yelahanka|aerospace/.test(searchable)) {
        score += 16;
        reasons.push("Airport-corridor relevance");
      }

      return {
        project,
        score: Math.min(score, 97),
        reasons: reasons.length ? reasons.slice(0, 3) : [project.highlights[0]],
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function PropertyCopilot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const matches = useMemo(
    () => (submittedQuery ? analyseQuery(submittedQuery) : []),
    [submittedQuery]
  );

  if (!(pathname === "/projects" || pathname === "/my-search")) return null;

  function runSearch(value: string) {
    const next = value.trim();
    if (!next) return;
    setQuery(next);
    setSubmittedQuery(next);
    trackEvent("ai_copilot_query", { buyer_query: next.slice(0, 120) });
  }

  const advisorBrief = submittedQuery
    ? `Hi Asher Realty, I used the Asher AI Copilot. My requirement is: ${submittedQuery}. My suggested shortlist is ${matches
        .map(({ project }) => project.name)
        .join(", ")}. Please verify pricing, inventory and help me compare the right units.`
    : "Hi Asher Realty, I would like help shortlisting and comparing Bengaluru properties.";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[5.65rem] right-3 z-[65] inline-flex h-11 items-center gap-1.5 rounded-full border border-[#c9a227]/40 bg-[#071a2f] px-3 text-[11px] font-bold text-white shadow-[0_16px_45px_rgba(7,26,47,.3)] transition hover:-translate-y-0.5 hover:bg-[#0d2948] sm:right-4 sm:h-12 sm:gap-2 sm:px-4 sm:text-xs lg:bottom-6 lg:right-6 lg:h-14 lg:px-5 lg:text-sm"
        aria-label="Ask Asher for property help"
      >
        <span className="relative flex size-7 items-center justify-center rounded-full bg-[#c9a227] text-[#071a2f]">
          <Bot className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-[#071a2f]" />
        </span>
        <span className="sm:hidden">Ask</span>
        <span className="hidden sm:inline">Ask Asher</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#041221]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="asher-copilot-title"
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#f7f8fa] shadow-[0_35px_120px_rgba(0,0,0,.38)] sm:rounded-[2rem]"
          >
            <header className="relative overflow-hidden bg-[#071a2f] px-6 py-6 text-white sm:px-8">
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_80%_15%,#c9a227_0,transparent_34%)]" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#071a2f]">
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                      Property search assistant
                    </p>
                    <h2 id="asher-copilot-title" className="mt-1 text-3xl font-medium">
                      Ask Asher
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-white/55">
                      Describe the home you want in plain English. We&apos;ll suggest useful starting points.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close Asher AI"
                >
                  <X className="size-5" />
                </button>
              </div>
            </header>

            <div className="overflow-y-auto p-5 sm:p-7">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  runSearch(query);
                }}
                className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
              >
                <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <Search className="size-5 shrink-0 text-[#b08a16]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="e.g. 3 BHK near Whitefield under 3 Cr"
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm text-[#071a2f] outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center rounded-xl bg-[#c9a227] px-4 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  Find
                  <ArrowUpRight className="ml-1.5 size-4" />
                </button>
              </form>

              {!submittedQuery ? (
                <div className="py-7">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Try a buyer question
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => runSearch(prompt)}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold leading-6 text-[#071a2f] transition hover:-translate-y-0.5 hover:border-[#c9a227] hover:shadow-lg"
                      >
                        <Sparkles className="mb-3 size-4 text-[#b08a16]" />
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="rounded-2xl border border-[#c9a227]/20 bg-[#fff9e8] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b6a0f]">
                      AI catalogue reading
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#071a2f]">
                      I found {matches.length} strong starting points from {projects.length} curated projects.
                      These matches prioritise the location, home size and intent in your question.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {matches.map(({ project, score, reasons }, index) => (
                      <article
                        key={project.name}
                        className="grid grid-cols-[84px_1fr] gap-4 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-[96px_1fr_auto] sm:items-center"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl">
                          <Image src={project.image} alt={project.name} fill className="object-cover" sizes="96px" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#b08a16]">
                            #{index + 1} · {score}% catalogue fit
                          </p>
                          <h3 className="mt-1 truncate font-semibold text-[#071a2f]">{project.name}</h3>
                          <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">{project.location}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {reasons.map((reason) => (
                              <span key={reason} className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link
                          href={`/projects/${projectSlug(project.name)}`}
                          onClick={() => setOpen(false)}
                          className="col-span-2 inline-flex h-10 items-center justify-center rounded-full bg-[#071a2f] px-4 text-xs font-bold text-white sm:col-span-1"
                        >
                          View
                          <ArrowUpRight className="ml-1.5 size-3.5" />
                        </Link>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <a
                      href="tel:+919019697170"
                      data-analytics-label="AI Copilot phone handoff"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f]"
                    >
                      <Phone className="mr-2 size-4" />
                      Call with this brief
                    </a>
                    <a
                      href={`https://wa.me/919019697170?text=${encodeURIComponent(advisorBrief)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics-label="AI Copilot WhatsApp handoff"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-[#071a2f]/15 bg-white px-5 text-xs font-bold text-[#071a2f]"
                    >
                      <MessageCircle className="mr-2 size-4 text-emerald-600" />
                      Send to an advisor
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-3 rounded-2xl bg-slate-100 p-4">
                <Building2 className="mt-0.5 size-4 shrink-0 text-[#b08a16]" />
                <p className="text-[10px] leading-5 text-slate-500">
                  The copilot ranks Asher’s structured catalogue; it does not predict returns or replace legal and financial due diligence. An advisor verifies live price, unit inventory and possession.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
