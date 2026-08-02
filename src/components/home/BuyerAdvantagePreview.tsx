import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  GitCompareArrows,
  Home,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: GitCompareArrows,
    eyebrow: "Before the visit",
    title: "A shortlist that explains itself",
    text: "See why each home fits, what it compromises and which facts still need a live check.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Before the booking",
    title: "The complete decision, not the headline price",
    text: "Ask about all-in cost, tower, phase, RERA, payment timing and possession before committing.",
  },
  {
    icon: Home,
    eyebrow: "After the booking",
    title: "A buyer desk that does not disappear",
    text: "Return for milestone questions, handover preparation and every future property decision.",
  },
];

export default function BuyerAdvantagePreview() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7411]">
              <BadgeCheck className="size-4" /> Asher Buyer Advantage
            </p>
            <h2 className="mt-4 max-w-3xl text-5xl font-medium leading-[0.98] tracking-[-0.03em] text-[#071a2f] sm:text-7xl">
              A reason to choose Asher again.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              The relationship should become more useful after every decision.
              Your Buyer Passport connects the shortlist, cost questions, visit
              plan, booking checks and ownership support in one journey.
            </p>
            <Link
              href="/buyer-advantage"
              className="mt-5 inline-flex items-center text-sm font-bold text-[#8d690b] transition hover:text-[#071a2f]"
            >
              See everything included
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, eyebrow, title, text }) => (
            <article
              key={title}
              className="group rounded-[1.7rem] border border-slate-200 bg-[#f7f7f5] p-7 transition hover:-translate-y-1 hover:border-[#c9a227]/55 hover:bg-white hover:shadow-[0_22px_65px_rgba(7,26,47,.09)]"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462] shadow-[0_12px_28px_rgba(7,26,47,.16)]">
                <Icon className="size-5" />
              </span>
              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7411]">
                {eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-[#071a2f]">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-[1.6rem] bg-[#071a2f] p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              One brief · every property decision
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/58">
              Start free, keep control of your shortlist and invite an advisor
              only when a human check adds value.
            </p>
          </div>
          <Link
            href="/buyer-advantage#build-plan"
            className="shine-button inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
          >
            Start my Buyer Passport
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
