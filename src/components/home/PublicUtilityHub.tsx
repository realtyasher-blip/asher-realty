import Link from "next/link";
import {
  ArrowUpRight,
  Calculator,
  ClipboardCheck,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";

const advisorUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
  "Hi Asher Realty, I need help with a Bengaluru property decision."
)}`;

const utilities = [
  {
    icon: Search,
    title: "Find a home",
    text: "Search new projects, rental help and resale support from one place.",
    href: "/projects",
  },
  {
    icon: ClipboardCheck,
    title: "Owner checklist",
    text: "Prepare the facts and photos needed for a safe, free initial review.",
    href: "/owner-checklist",
  },
  {
    icon: Calculator,
    title: "Plan the real cost",
    text: "Estimate EMI, rental move-in cash, yield and seller proceeds.",
    href: "/tools",
  },
  {
    icon: MapPinned,
    title: "Understand areas",
    text: "Explore Bengaluru corridors through commute, budget and lifestyle context.",
    href: "/locations",
  },
  {
    icon: ShieldCheck,
    title: "Review and safety",
    text: "See exactly what we check, what remains unverified and how to stay safe.",
    href: "/how-we-verify",
  },
  {
    icon: MessageCircle,
    title: "Ask an advisor",
    text: "Bring an unclear requirement and turn it into the next practical step.",
    href: advisorUrl,
    external: true,
  },
];

export default function PublicUtilityHub() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7410]">Useful before you call anyone</p>
            <h2 className="mt-3 text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">Solve the next property question in one click.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500">Free public tools, clear assisted journeys and human help when a decision needs judgement.</p>
        </div>

        <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {utilities.map(({ icon: Icon, title, text, href, external }) => {
            const content = (
              <>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]"><Icon className="size-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-[#071a2f]">{title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-[#a47b10] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            );
            const classes = "group flex items-center gap-4 rounded-[1.4rem] border border-slate-200 bg-[#f7f8fa] p-5 transition hover:-translate-y-0.5 hover:border-[#c9a227]/45 hover:bg-white hover:shadow-lg";
            return external ? (
              <a key={title} href={href} target="_blank" rel="noopener noreferrer" className={classes}>{content}</a>
            ) : (
              <Link key={title} href={href} className={classes}>{content}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
