import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Check,
  CircleAlert,
  IndianRupee,
} from "lucide-react";

const rows = [
  ["Agreement value", "₹2.18 Cr", "Quote"],
  ["Premiums + parking", "₹16.5 L", "Quote"],
  ["Taxes + registration", "Needs input", "Confirm"],
  ["Maintenance + corpus", "Needs input", "Confirm"],
];

export default function TrueCostPreview() {
  return (
    <section className="overflow-hidden bg-[#071a2f] py-20 text-white sm:py-28">
      <div className="container-shell">
        <div className="grid gap-12 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e4c462]">
              <Calculator className="size-4" /> New buyer tool
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.03em] sm:text-7xl">
              Decode the quote before you judge the deal.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              TrueCost turns a builder quotation into one comparable purchase
              commitment. See what is included, what is missing and the questions
              worth resolving before a token payment.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "All-in amount and own-funds estimate",
                "Carpet-area and saleable-area economics",
                "Illustrative EMI and rent overlap",
                "Private quote comparison on this device",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-xs leading-6 text-white/65">
                  <Check className="mt-1 size-3.5 shrink-0 text-emerald-400" />
                  {item}
                </p>
              ))}
            </div>
            <Link
              href="/true-cost"
              className="shine-button mt-9 inline-flex min-h-14 items-center justify-center rounded-full bg-[#c9a227] px-7 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
            >
              Decode my cost sheet
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_90px_rgba(0,0,0,.22)] backdrop-blur-xl sm:p-8">
            <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                  Example cost-sheet view
                </p>
                <p className="mt-2 text-2xl font-semibold">A clearer buying number</p>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#071a2f]">
                <IndianRupee className="size-5" />
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {rows.map(([label, value, state]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl bg-white/[0.045] p-4">
                  <span>
                    <span className="block text-xs font-bold text-white/78">{label}</span>
                    <span className="mt-1 block text-[9px] uppercase tracking-[0.12em] text-white/28">{state}</span>
                  </span>
                  <strong className={value === "Needs input" ? "text-xs text-amber-300" : "text-sm text-white"}>{value}</strong>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#e4c462]/20 bg-[#c9a227]/10 p-4">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-[#e4c462]" />
              <p className="text-[10px] leading-5 text-white/55">
                TrueCost does not invent missing charges. It turns every unknown
                into a precise question for the developer or Asher advisor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
