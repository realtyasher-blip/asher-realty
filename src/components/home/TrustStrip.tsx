import { BadgeCheck, Building2, Database, Users } from "lucide-react";
import { projects } from "@/data/projects";

const items = [
  { icon: Building2, value: projects.length, title: "Active choices", text: "New-launch and under-construction homes" },
  { icon: Users, value: new Set(projects.map((project) => project.developer)).size, title: "Leading builders", text: "One market-wide buyer conversation" },
  { icon: BadgeCheck, value: `${Math.round((projects.filter((project) => project.rera).length / projects.length) * 100)}%`, title: "RERA disclosed", text: "Within the curated public catalogue" },
  { icon: Database, value: "Daily", title: "Market monitor", text: "News refreshed with source and date" },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-shell grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
        {items.map(({ icon: Icon, value, title, text }) => (
          <div key={title} className="flex items-start gap-4 px-4 py-7 first:pl-0 last:pr-0 md:px-7">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f]">
              <Icon className="size-5 text-[#e4c462]" />
            </span>
            <span>
              <span className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#071a2f]">{value}</span>
                <span className="text-xs font-bold text-[#071a2f]">{title}</span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
