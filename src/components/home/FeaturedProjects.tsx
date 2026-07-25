"use client";

import { ArrowRight } from "lucide-react";

import ProjectCard, {
  type Project,
} from "@/components/projects/ProjectCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projects: Project[] = [
  {
    name: "SOBHA OneWorld",
    developer: "SOBHA",
    location: "Greater Whitefield, Bengaluru",
    configuration: "1, 2, 3 & 4 BHK",
    price: "Contact for latest price",
    image: "/images/sobha-oneworld.jpg",
    featured: true,
  },
  {
    name: "Prestige Southern Star",
    developer: "Prestige Group",
    location: "South Bengaluru",
    configuration: "Premium Apartments",
    price: "Contact for latest price",
    image: "/images/prestige-southern-star.jpg",
  },
  {
    name: "Birla Trimaya",
    developer: "Birla Estates",
    location: "North Bengaluru",
    configuration: "Premium Apartments",
    price: "Contact for latest price",
    image: "/images/birla-trimaya.jpg",
  },
  {
    name: "Brigade El Dorado",
    developer: "Brigade Group",
    location: "North Bengaluru",
    configuration: "Premium Apartments",
    price: "Contact for latest price",
    image: "/images/brigade-eldorado.jpg",
  },
  {
    name: "Godrej MSR City",
    developer: "Godrej Properties",
    location: "North Bengaluru",
    configuration: "Premium Apartments",
    price: "Contact for latest price",
    image: "/images/godrej-msr-city.jpg",
  },
];

const generalWhatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20please%20help%20me%20find%20a%20suitable%20property%20in%20Bengaluru.";

export default function FeaturedProjects() {
  return (
    <section
      id="projects"
      className="overflow-hidden bg-[#f7f8fa] py-24 sm:py-28"
    >
      <div className="container-shell">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
              Curated Properties
            </p>

            <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              Featured Projects
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Explore selected residential projects across Bengaluru with
              personalised recommendations, project comparisons and guided site
              visits.
            </p>
          </div>

          <a
            href={generalWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-fit rounded-full border-[#071a2f]/20 bg-white px-6 text-[#071a2f] hover:bg-[#071a2f] hover:text-white"
            )}
          >
            Get Personalised Recommendations
            <ArrowRight className="ml-2 size-4" />
          </a>
        </div>

        <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
            />
          ))}
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-[#c9a227]/20 bg-[#071a2f] px-6 py-8 text-white sm:px-10 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e4c462]">
              Cannot decide?
            </p>

            <h3 className="mt-3 text-3xl font-medium sm:text-4xl">
              Let us shortlist the right projects for you.
            </h3>

            <p className="mt-3 max-w-2xl leading-7 text-white/65">
              Tell us your budget, preferred location and property requirement.
              We will help you compare suitable options.
            </p>
          </div>

          <a
            href={generalWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-7 h-14 shrink-0 rounded-full bg-[#c9a227] px-8 text-[#071a2f] hover:bg-[#e4c462] lg:mt-0"
            )}
          >
            Speak to an Advisor
            <ArrowRight className="ml-2 size-4" />
          </a>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Images are for project identification and presentation. Prices,
          specifications and availability should be verified before making a
          property decision.
        </p>
      </div>
    </section>
  );
}