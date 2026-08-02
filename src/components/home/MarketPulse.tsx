import Link from "next/link";
import {
  ArrowRight,
  Building2,
  MapPinned,
  Newspaper,
  Radar,
  ShieldCheck,
} from "lucide-react";

import { projects } from "@/data/projects";
import { getMarketNews } from "@/lib/marketNews";

const corridorOrder = [
  "East Bengaluru",
  "North Bengaluru",
  "South Bengaluru",
  "Central Bengaluru",
] as const;

function dateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export default async function MarketPulse() {
  const feed = await getMarketNews();
  const developers = new Set(projects.map((project) => project.developer)).size;
  const earlyStage = projects.filter((project) =>
    ["Coming soon", "New launch"].includes(project.status)
  ).length;
  const withRera = projects.filter((project) => project.rera).length;

  const corridors = corridorOrder.map((name) => ({
    name: name.replace(" Bengaluru", ""),
    count: projects.filter((project) => project.corridor === name).length,
    early: projects.filter(
      (project) =>
        project.corridor === name &&
        ["Coming soon", "New launch"].includes(project.status)
    ).length,
  }));

  return (
    <section className="content-auto-section overflow-hidden bg-[#041421] py-20 text-white sm:py-24">
      <div className="container-shell">
        <div className="grid gap-10 xl:grid-cols-[.78fr_1.22fr] xl:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#e4c462]">
              <Radar className="size-4" /> Bengaluru Market Pulse
            </span>
            <h2 className="mt-6 text-4xl font-medium leading-tight sm:text-6xl">
              Useful numbers.
              <span className="mt-1 block text-[#e4c462]">Honest context.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/52 sm:text-base">
              A daily market reading layered over a builder-sourced catalogue.
              Counts show platform coverage—not live inventory or future returns.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: projects.length, label: "Projects tracked" },
              { value: developers, label: "Builders covered" },
              { value: earlyStage, label: "New / upcoming" },
              { value: withRera, label: "RERA fields listed" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-3xl font-extrabold text-white">{item.value}</p>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.11em] text-white/32">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#e4c462]"><MapPinned className="size-4" /> Catalogue by corridor</p>
                <p className="mt-2 text-xs leading-6 text-white/38">A quick supply lens for where to explore next.</p>
              </div>
              <Building2 className="size-7 text-white/15" />
            </div>

            <div className="mt-7 space-y-5">
              {corridors.map((corridor) => (
                <div key={corridor.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{corridor.name}</span>
                    <span className="text-white/38">{corridor.count} tracked · {corridor.early} early-stage</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#9f7710] to-[#e4c462]" style={{ width: `${Math.max(16, (corridor.count / projects.length) * 100 * 2.7)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] bg-white p-6 text-[#071a2f] shadow-[0_24px_70px_rgba(0,0,0,.2)] sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a7412]"><Newspaper className="size-4" /> Fresh market reading</p>
                <h3 className="mt-3 text-3xl font-semibold">What Bengaluru buyers are reading now.</h3>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" /> Daily feed</span>
            </div>

            <div className="mt-7 divide-y divide-slate-100">
              {feed.items.slice(0, 3).map((item) => (
                <div key={`${item.title}-${item.publishedAt}`} className="grid gap-3 py-4 first:pt-0 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                  <span className="rounded-full bg-[#f6f7f8] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">{item.category}</span>
                  <div>
                    <p className="text-sm font-bold leading-6">{item.title}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{item.source}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{dateLabel(item.publishedAt)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-[9px] leading-5 text-slate-400"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /> Market feed refreshed daily. Project facts retain their own review dates.</p>
              <Link href="/intelligence" className="inline-flex shrink-0 items-center text-xs font-bold text-[#071a2f] transition hover:text-[#9a7412]">Open market desk <ArrowRight className="ml-2 size-4" /></Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
