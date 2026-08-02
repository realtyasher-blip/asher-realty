import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  GitCompareArrows,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const advisorUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
  "Hi Asher Realty, please help me turn my requirements into a focused Bengaluru property shortlist."
)}`;

export default function BuyerCommandCentre() {
  return (
    <section className="content-auto-section bg-white py-20 sm:py-24">
      <div className="container-shell">
        <div className="grid gap-8 xl:grid-cols-[.7fr_1.3fr] xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a47b10]">
              One calm way to buy
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              From a vague search to three sensible visits.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base xl:justify-self-end">
            Start with your daily life, not a wall of listings. Asher keeps the
            shortlist, trade-offs and advisor conversation connected from the
            first match to the site visit.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <article className="relative overflow-hidden rounded-[2rem] bg-[#071a2f] p-7 text-white shadow-[0_28px_85px_rgba(7,26,47,.18)] sm:p-10">
            <div className="premium-grid absolute inset-0 opacity-30" />
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[#c9a227]/18 blur-[90px]" />
            <div className="relative grid gap-9 lg:grid-cols-[1fr_.78fr] lg:items-end">
              <div>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#e4c462]">
                  <Sparkles className="size-5" />
                </span>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                  Step 1 · Asher Home Match
                </p>
                <h3 className="mt-3 max-w-xl text-4xl font-medium leading-tight sm:text-5xl">
                  Tell us where life happens. See what actually fits.
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
                  Work hub, home size, budget and move-in plan become a
                  transparent shortlist—with the reason and uncertainty shown.
                </p>
                <Link
                  href="/home-match"
                  className="shine-button mt-7 inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  Build my shortlist
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur">
                {[
                  ["01", "Work-hub lens", "Corridor fit without fake commute precision"],
                  ["02", "Explainable match", "Plain reasons, not a black-box ranking"],
                  ["03", "Visible checks", "Unknown price and phase facts stay visible"],
                ].map(([number, title, detail]) => (
                  <div key={number} className="grid grid-cols-[34px_1fr] gap-3 border-b border-white/8 pb-3 last:border-0 last:pb-0">
                    <span className="text-lg font-light text-[#e4c462]">{number}</span>
                    <span>
                      <span className="block text-xs font-bold">{title}</span>
                      <span className="mt-1 block text-[9px] leading-5 text-white/35">{detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/my-search"
              className="group grid min-h-56 grid-cols-[1fr_auto] gap-5 rounded-[1.75rem] border border-slate-200 bg-[#f6f7f8] p-7 transition hover:-translate-y-1 hover:border-[#c9a227]/60 hover:bg-white hover:shadow-[0_20px_55px_rgba(7,26,47,.1)]"
            >
              <span>
                <GitCompareArrows className="size-5 text-[#a47b10]" />
                <span className="mt-6 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Step 2 · Save & compare</span>
                <span className="mt-2 block text-2xl font-bold leading-tight text-[#071a2f]">Keep the strongest two—not twenty tabs.</span>
                <span className="mt-3 block text-xs leading-6 text-slate-500">Your shortlist stays on this device and is ready for a side-by-side decision.</span>
              </span>
              <ArrowRight className="size-5 self-end text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#a47b10]" />
            </Link>

            <a
              href={advisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-label="Buyer command centre advisor"
              className="group grid min-h-56 grid-cols-[1fr_auto] gap-5 rounded-[1.75rem] border border-[#d8c26f]/45 bg-[#fff9e8] p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(201,162,39,.14)]"
            >
              <span>
                <CalendarCheck className="size-5 text-[#a47b10]" />
                <span className="mt-6 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a7412]">Step 3 · Validate & visit</span>
                <span className="mt-2 block text-2xl font-bold leading-tight text-[#071a2f]">Take a buyer brief into every conversation.</span>
                <span className="mt-3 block text-xs leading-6 text-[#071a2f]/55">We reconfirm cost, preferred-stack availability and a sensible visit plan.</span>
              </span>
              <MessageCircle className="size-5 self-end text-[#a47b10] transition group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
