import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
  KeyRound,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const journeys = [
  {
    icon: Search,
    eyebrow: "Buyer",
    title: "Buy a home",
    text: "Explore new launches, compare projects, calculate total cost and plan site visits.",
    href: "/projects",
    cta: "Explore homes",
    tone: "bg-[#071a2f] text-white",
    iconTone: "bg-[#c9a227] text-[#071a2f]",
  },
  {
    icon: KeyRound,
    eyebrow: "Tenant",
    title: "Find a rental",
    text: "Share your preferred area, monthly budget and move-in needs for assisted matching.",
    href: "/rent",
    cta: "Find a rental",
    tone: "bg-[#dfeee9] text-[#071a2f]",
    iconTone: "bg-[#071a2f] text-[#e4c462]",
  },
  {
    icon: Building2,
    eyebrow: "Property owner",
    title: "Sell my property",
    text: "Start a private resale review with fact checks, positioning and buyer-enquiry support.",
    href: "/post-property?intent=sell",
    cta: "Post property FREE",
    tone: "bg-[#f5e8ca] text-[#071a2f]",
    iconTone: "bg-[#071a2f] text-[#e4c462]",
  },
  {
    icon: Home,
    eyebrow: "Landlord",
    title: "Rent out my property",
    text: "Submit the home privately for owner verification and tenant-search assistance.",
    href: "/post-property?intent=rent",
    cta: "Post property FREE",
    tone: "bg-[#e8ebf5] text-[#071a2f]",
    iconTone: "bg-[#071a2f] text-[#e4c462]",
  },
];

const endToEnd = [
  "Property discovery and shortlisting",
  "Resale and rental owner intake",
  "Site-visit coordination",
  "Total-cost and affordability tools",
  "Valuation and document-review coordination",
  "Loan, agreement, inspection and move support",
];

export default function PublicJourney() {
  return (
    <section id="public-journeys" className="overflow-hidden bg-[#f3f5f7] py-20 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_.55fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7410]">
              <Sparkles className="size-4" />
              One Bengaluru property desk
            </p>
            <h2 className="mt-5 text-5xl font-medium leading-[1.02] text-[#071a2f] sm:text-6xl">
              What would you like
              <span className="block text-[#9a7410]">to do today?</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Start with your real need—not the platform&apos;s inventory. Asher Realty supports buyers, tenants, sellers and landlords through one managed journey. Owner submission and initial review are free.
            </p>
          </div>
          <Link
            href="/services"
            className="group flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c9a227]/50 hover:shadow-lg"
          >
            <span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7410]">Need something else?</span>
              <span className="mt-2 block text-xl font-semibold text-[#071a2f]">Explore all property services</span>
            </span>
            <ArrowRight className="size-5 text-[#9a7410] transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journeys.map(({ icon: Icon, eyebrow, title, text, href, cta, tone, iconTone }) => (
            <Link
              key={title}
              href={href}
              className={`group flex min-h-[21rem] flex-col rounded-[1.8rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,26,47,.14)] ${tone}`}
            >
              <span className={`flex size-12 items-center justify-center rounded-2xl ${iconTone}`}>
                <Icon className="size-5" />
              </span>
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] opacity-55">{eyebrow}</p>
              <h3 className="mt-2 text-3xl font-semibold">{title}</h3>
              <p className="mt-4 text-xs leading-6 opacity-65">{text}</p>
              <span className="mt-auto inline-flex items-center pt-8 text-xs font-bold">
                {cta}
                <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white lg:grid-cols-[.65fr_1.35fr]">
          <div className="relative overflow-hidden bg-[#071a2f] p-7 text-white sm:p-9">
            <div className="premium-grid absolute inset-0 opacity-20" />
            <div className="relative">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c9a227] text-[#071a2f]">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="mt-6 text-4xl font-medium">One advisor. One clear requirement brief.</h3>
              <p className="mt-4 text-xs leading-6 text-white/55">
                Information is collected once, checked for the specific purpose and carried through the next steps with clear human ownership.
              </p>
            </div>
          </div>
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {endToEnd.map((item, index) => (
              <div key={item} className="bg-white p-6">
                <span className="text-[10px] font-extrabold text-[#b08a16]">0{index + 1}</span>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#071a2f]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
