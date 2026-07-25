import { BadgeCheck, CalendarCheck, MapPinned, Scale } from "lucide-react";

const items = [
  { icon: BadgeCheck, title: "Curated inventory", text: "Projects selected for Bengaluru buyers" },
  { icon: Scale, title: "Side-by-side clarity", text: "Compare locations, layouts and timelines" },
  { icon: MapPinned, title: "Local expertise", text: "Focused only on Bengaluru corridors" },
  { icon: CalendarCheck, title: "Guided visits", text: "One advisor coordinates your shortlist" },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-shell grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4 px-4 py-7 first:pl-0 last:pr-0 md:px-7">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f]">
              <Icon className="size-5 text-[#e4c462]" />
            </span>
            <span>
              <span className="block font-semibold text-[#071a2f]">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
