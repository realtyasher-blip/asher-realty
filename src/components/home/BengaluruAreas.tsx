import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";

import { getProjectsForLocation, locationHubs } from "@/data/locations";

const popularAreaSlugs = [
  "whitefield",
  "sarjapur-road",
  "manyata-hebbal",
  "devanahalli",
];

export default function BengaluruAreas() {
  const areas = popularAreaSlugs
    .map((slug) => locationHubs.find((hub) => hub.slug === slug))
    .filter((area): area is (typeof locationHubs)[number] => Boolean(area));

  return (
    <section className="content-auto-section bg-white py-20 sm:py-24">
      <div className="container-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a47b10]">
              Explore by daily life
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              Where should you live in Bengaluru?
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Begin with your office, school and weekly travel—not only a
              project brochure. These guides explain who each area suits.
            </p>
          </div>
          <Link
            href="/locations"
            className="inline-flex w-fit items-center text-sm font-bold text-[#071a2f] transition hover:text-[#a47b10]"
          >
            Explore all Bengaluru areas
            <ArrowUpRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {areas.map((area) => {
            const projectCount = getProjectsForLocation(area).length;
            return (
              <Link
                key={area.slug}
                href={`/locations/${area.slug}`}
                className="group rounded-[1.6rem] border border-slate-200 bg-[#f7f8fa] p-6 transition hover:-translate-y-1 hover:border-[#c9a227]/55 hover:bg-white hover:shadow-[0_20px_55px_rgba(7,26,47,.09)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
                    <MapPin className="size-5" />
                  </span>
                  <ArrowUpRight className="size-5 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b08a16]" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-[#071a2f]">
                  {area.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                  {area.summary}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <BriefcaseBusiness className="size-4 text-[#b08a16]" />
                  {area.bestFor[0]}
                </div>
                <p className="mt-3 text-xs font-bold text-[#a47b10]">
                  {projectCount} matching project{projectCount === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
