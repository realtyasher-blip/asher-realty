import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { projects } from "@/data/projects";

const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
  "Hi Asher Realty, I need help finding the right property in Bengaluru."
)}`;

const paths = [
  {
    icon: Building2,
    eyebrow: "Browse independently",
    title: "Explore all Bengaluru projects",
    description: `Search ${projects.length} curated options by area, builder, budget, home type and possession stage.`,
    action: "Browse projects",
    href: "/projects",
    tone: "light",
  },
  {
    icon: Sparkles,
    eyebrow: "Personalised in 2 minutes",
    title: "Get an AI-ranked shortlist",
    description:
      "Tell us your budget, family needs and priorities. See the projects that fit you best and why.",
    action: "Build my shortlist",
    href: "/decision-lab",
    tone: "gold",
  },
  {
    icon: Heart,
    eyebrow: "Your persistent buyer workspace",
    title: "Open My Search",
    description:
      "Keep your buyer brief, personal fit scores, saved homes, visit route and verification checklist together on this device.",
    action: "Open buyer workspace",
    href: "/my-search",
    tone: "light",
  },
  {
    icon: MessageCircle,
    eyebrow: "Speak to a Bengaluru advisor",
    title: "Let a human expert narrow it down",
    description:
      "Ask about real availability, latest pricing, comparisons and guided site visits without sales pressure.",
    action: "Chat with an advisor",
    href: whatsappUrl,
    external: true,
    tone: "dark",
  },
];

export default function BuyerQuickStart() {
  return (
    <section className="content-auto-section bg-[#f3f5f7] py-16 sm:py-20">
      <div className="container-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a16]">
              Choose how you want to search
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-tight text-[#071a2f] sm:text-5xl">
              Your property journey, your way.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 lg:text-right">
            Start with the catalogue, let the platform rank your best matches,
            or speak directly with a local advisor. You can switch at any time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {paths.map(({ icon: Icon, eyebrow, title, description, action, href, external, tone }) => {
            const className =
              tone === "dark"
                ? "group rounded-[1.75rem] bg-[#071a2f] p-7 text-white shadow-[0_18px_55px_rgba(7,26,47,.16)] transition hover:-translate-y-1"
                : tone === "gold"
                  ? "group rounded-[1.75rem] border border-[#d8b449]/35 bg-[#fff8df] p-7 text-[#071a2f] shadow-[0_18px_55px_rgba(7,26,47,.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(7,26,47,.12)]"
                  : "group rounded-[1.75rem] border border-slate-200 bg-white p-7 text-[#071a2f] shadow-[0_18px_55px_rgba(7,26,47,.06)] transition hover:-translate-y-1 hover:border-[#c9a227]/45 hover:shadow-[0_24px_65px_rgba(7,26,47,.11)]";

            const content = (
              <>
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl ${
                    tone === "dark"
                      ? "bg-[#c9a227]/15 text-[#e4c462]"
                      : "bg-[#071a2f] text-[#e4c462]"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <p
                  className={`mt-7 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    tone === "dark" ? "text-[#e4c462]" : "text-[#9a7410]"
                  }`}
                >
                  {eyebrow}
                </p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight">
                  {title}
                </h3>
                <p
                  className={`mt-4 text-sm leading-7 ${
                    tone === "dark" ? "text-white/60" : "text-slate-600"
                  }`}
                >
                  {description}
                </p>
                <span className="mt-7 inline-flex items-center text-sm font-bold">
                  {action}
                  <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                </span>
              </>
            );

            return external ? (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-label="Quick start advisor chat"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={title} href={href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
