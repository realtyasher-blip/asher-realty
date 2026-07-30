import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  CalendarClock,
  IndianRupee,
  MapPin,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { projectSlug, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const phoneNumber = "919019697170";

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const whatsappMessage = encodeURIComponent(
    `Hi Asher Realty, I am interested in ${project.name}. Please share the latest price, availability and project details.`
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  return (
    <article
      className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(7,26,47,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(7,26,47,0.14)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <Image
          src={project.image}
          alt={`${project.name} residential project`}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/80 via-transparent to-transparent" />

        {project.featured && (
          <div className="absolute top-5 left-5 rounded-full border border-white/20 bg-[#071a2f]/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            Featured
          </div>
        )}

        <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#071a2f] backdrop-blur-md">
          {project.status}
        </div>

        <div className="absolute right-5 bottom-5 left-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e4c462]">
            {project.developer}
          </p>

          <h3 className="mt-1 text-3xl font-medium text-white">
            {project.name}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="mb-6 text-sm leading-7 text-slate-600">
          {project.description}
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-[#c9a227]" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Location
              </p>

              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {project.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BedDouble className="mt-0.5 size-5 shrink-0 text-[#c9a227]" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Configuration
              </p>

              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {project.configuration}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IndianRupee className="mt-0.5 size-5 shrink-0 text-[#c9a227]" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Price
              </p>

              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {project.price}
              </p>
            </div>
          </div>

          {project.possession && (
            <div className="flex items-start gap-3">
              <CalendarClock className="mt-0.5 size-5 shrink-0 text-[#c9a227]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Possession
                </p>
                <p className="mt-1 text-sm font-medium text-[#071a2f]">
                  {project.possession}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/projects/${projectSlug(project.name)}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full border-[#071a2f]/20 text-[#071a2f] hover:bg-[#071a2f] hover:text-white"
            )}
          >
            Explore Project
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "rounded-full bg-[#c9a227] text-[#071a2f] hover:bg-[#e4c462]"
            )}
          >
            Get Details
            <ArrowUpRight className="ml-2 size-4" />
          </a>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <span>Verified {project.verifiedAt}</span>
        </div>

        {project.rera && (
          <p className="mt-3 break-words text-[10px] leading-5 text-slate-400">
            RERA: {project.rera}
          </p>
        )}

        <a
            href="tel:+919019697170"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-4 w-full rounded-full border-[#071a2f]/20 text-[#071a2f] hover:bg-[#071a2f] hover:text-white"
            )}
          >
            Call Asher Realty
          </a>
      </div>
    </article>
  );
}
