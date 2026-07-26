import { ArrowUpRight, BarChart3, Clock3, Newspaper, TrendingUp } from "lucide-react";

import { corridorSignals, marketSignals } from "@/data/market";
import { getMarketNews } from "@/lib/marketNews";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default async function MarketIntelligence() {
  const news = await getMarketNews();
  return (
    <section id="market" className="overflow-hidden bg-[#f5f6f8] py-24 sm:py-28">
      <div className="container-shell">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#b08a16]">Bengaluru market intelligence</p>
            <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">Data before decisions.</h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              A buyer-friendly view of current residential momentum, sourced
              from established research and refreshed as new reports arrive.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
            <Clock3 className="size-4 text-[#b08a16]" />
            News refreshed daily · Updated {formatDate(news.updatedAt)}
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {marketSignals.map((signal) => (
            <article key={signal.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(7,26,47,.055)]">
              <div className="flex items-center justify-between">
                <BarChart3 className="size-5 text-[#b08a16]" />
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">{signal.change}</span>
              </div>
              <p className="mt-7 text-4xl font-semibold tracking-tight text-[#071a2f]">{signal.value}</p>
              <p className="mt-2 text-sm font-semibold text-[#071a2f]">{signal.label}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400">
                <span>{signal.period}</span>
                <span>{signal.source}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-7 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] bg-[#071a2f] p-7 text-white sm:p-9">
            <div className="flex items-center gap-3">
              <TrendingUp className="size-5 text-[#e4c462]" />
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e4c462]">Corridor signals</p>
            </div>
            <div className="mt-7 divide-y divide-white/10">
              {corridorSignals.map((corridor) => (
                <div key={corridor.name} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{corridor.name}</h3>
                    <span className="rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-bold text-[#e4c462]">{corridor.signal}</span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-white/48">{corridor.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Newspaper className="size-5 text-[#b08a16]" />
                <h3 className="text-2xl font-medium text-[#071a2f]">Latest property news</h3>
              </div>
              <span className="hidden text-xs text-slate-400 sm:block">Bengaluru + India</span>
            </div>
            <div className="mt-6 divide-y divide-slate-100">
              {news.items.slice(0, 6).map((item) => (
                <a key={`${item.url}-${item.title}`} href={item.url} target="_blank" rel="noopener noreferrer" className="group grid gap-3 py-5 first:pt-0 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                  <span className="w-fit rounded-full bg-[#f4edcf] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b6a0f]">{item.category}</span>
                  <span>
                    <span className="block text-sm font-semibold leading-6 text-[#071a2f] transition group-hover:text-[#b08a16]">{item.title}</span>
                    <span className="mt-1 block text-[10px] text-slate-400">{item.source} · {formatDate(item.publishedAt)}</span>
                  </span>
                  <ArrowUpRight className="hidden size-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b08a16] sm:block" />
                </a>
              ))}
            </div>
            <p className="mt-5 border-t border-slate-100 pt-5 text-[10px] leading-5 text-slate-400">
              Headlines link to their publishers. Asher Realty does not reproduce
              full articles and does not treat news coverage as investment advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
