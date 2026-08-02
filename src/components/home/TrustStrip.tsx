import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Database,
  Users,
} from "lucide-react";

import { projects } from "@/data/projects";

const items = [
  {
    icon: Building2,
    value: projects.length,
    title: "Curated projects",
    text: "New-launch, active and under-construction choices",
  },
  {
    icon: Users,
    value: new Set(projects.map((project) => project.developer)).size,
    title: "Leading builders",
    text: "Compared through one buyer-side decision desk",
  },
  {
    icon: BadgeCheck,
    value: `${Math.round(
      (projects.filter((project) => project.rera).length / projects.length) * 100
    )}%`,
    title: "RERA disclosed",
    text: "Across the current structured public catalogue",
  },
  {
    icon: Database,
    value: "Daily",
    title: "Market monitor",
    text: "Fresh news, sources and Bengaluru buyer context",
  },
];

export default function TrustStrip() {
  return (
    <section className="relative z-10 bg-[#f3f5f7] pb-8">
      <div className="container-shell -mt-4">
        <div className="premium-card grid overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_65px_rgba(7,26,47,.1)] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          {items.map(({ icon: Icon, value, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 border-b border-slate-200 px-5 py-6 last:border-b-0 md:border-r xl:border-b-0"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] shadow-[0_10px_24px_rgba(7,26,47,.18)]">
                <Icon className="size-5 text-[#e4c462]" />
              </span>
              <span>
                <span className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#071a2f]">
                    {value}
                  </span>
                  <span className="text-[11px] font-bold text-[#071a2f]">
                    {title}
                  </span>
                </span>
                <span className="mt-1 block text-[10px] leading-5 text-slate-500">
                  {text}
                </span>
              </span>
            </div>
          ))}
          <Link
            href="/intelligence"
            className="group flex min-h-24 items-center justify-between gap-4 bg-[#071a2f] px-6 text-white xl:min-w-48"
          >
            <span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-[#e4c462]">
                Follow the signals
              </span>
              <span className="mt-1 block text-sm font-bold">
                What is moving now?
              </span>
            </span>
            <ArrowUpRight className="size-5 text-[#e4c462] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
