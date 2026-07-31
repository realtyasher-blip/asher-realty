import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  Check,
  GitCompareArrows,
  MapPinned,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

const deliverables = [
  {
    icon: GitCompareArrows,
    title: "Market-wide shortlist",
    text: "Compare relevant projects across builders instead of evaluating one sales presentation at a time.",
  },
  {
    icon: Calculator,
    title: "True-cost conversation",
    text: "Ask for the all-inclusive cost, payment timing and loan implications before selecting a unit.",
  },
  {
    icon: MapPinned,
    title: "Real-life location check",
    text: "Pressure-test commute, school, healthcare and last-mile access—not only the project pin.",
  },
  {
    icon: ShieldCheck,
    title: "Buyer verification brief",
    text: "Carry the right questions for RERA, phase, possession, unit stack and specification discussions.",
  },
];

const comparison = [
  ["Projects considered", "One portfolio", "Many listings", "Curated across builders"],
  ["Buyer-fit explanation", "Product-led", "Filter-led", "Personalised and explained"],
  ["Unit and phase checks", "Own inventory", "Varies", "Advisor verification"],
  ["Visit coordination", "One project", "Self-managed", "One guided itinerary"],
];

export default function AdvisorAdvantage() {
  return (
    <section className="content-auto-section overflow-hidden bg-[#071a2f] py-24 text-white sm:py-28">
      <div className="container-shell">
        <div className="grid gap-12 xl:grid-cols-[0.76fr_1.24fr] xl:items-start">
          <div className="xl:sticky xl:top-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#e4c462]">
              <BadgeCheck className="size-4" />
              The Asher advantage
            </span>
            <h2 className="mt-6 text-5xl font-medium leading-[1.03] sm:text-6xl">
              One builder explains one project.
              <span className="mt-2 block text-[#e4c462]">We help you compare the market.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-white/62">
              Builder teams remain the authority on their inventory. Asher adds the buyer-side context: which alternatives deserve attention, what must be verified, and how each option fits your life.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e4c462]">
                Your free 15-minute clarity call
              </p>
              <ul className="mt-4 space-y-3 text-xs leading-5 text-white/62">
                {[
                  "Three project starting shortlist",
                  "Corridor and commute trade-offs",
                  "Current price and inventory verification plan",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <a
                  href="tel:+919019697170"
                  data-analytics-label="Advisor advantage phone call"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  <Phone className="mr-2 size-4" />
                  Call 9019697170
                </a>
                <a
                  href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20would%20like%20a%2015-minute%20buyer%20clarity%20call%20and%20a%20market-wide%20shortlist."
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-label="Advisor advantage WhatsApp"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-5 text-xs font-bold text-white transition hover:border-[#c9a227] hover:text-[#e4c462]"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Send my requirement
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {deliverables.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-[#c9a227]/35 hover:bg-white/[0.09]">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-[#c9a227]/12">
                      <Icon className="size-5 text-[#e4c462]" />
                    </span>
                    <span className="text-4xl font-light text-white/10">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-medium">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/50">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10">
              <div className="grid grid-cols-[1.2fr_.8fr_.8fr_1fr] gap-2 bg-white/[0.08] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.1em] text-white/45 sm:px-6">
                <span>Decision support</span>
                <span>Builder</span>
                <span>Portal</span>
                <span className="text-[#e4c462]">Asher</span>
              </div>
              {comparison.map(([label, builder, portal, asher]) => (
                <div key={label} className="grid grid-cols-[1.2fr_.8fr_.8fr_1fr] gap-2 border-t border-white/10 px-4 py-4 text-[10px] leading-5 sm:px-6">
                  <span className="font-semibold text-white/75">{label}</span>
                  <span className="text-white/38">{builder}</span>
                  <span className="text-white/38">{portal}</span>
                  <span className="font-semibold text-[#e4c462]">{asher}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] bg-white p-6 text-[#071a2f] sm:flex-row sm:items-center">
              <div className="flex gap-4">
                <Building2 className="mt-1 size-6 shrink-0 text-[#b08a16]" />
                <div>
                  <p className="font-bold">Start with an independent shortlist.</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Then visit only the projects that earn your time.</p>
                </div>
              </div>
              <Link
                href="/my-search"
                className="inline-flex h-11 shrink-0 items-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white"
              >
                Build my plan
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
