import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CircleHelp,
  IndianRupee,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";

const questions = [
  "Which tower and stack avoid road noise and harsh west sun?",
  "What is the current all-inclusive cost—not only the starting price?",
  "Which view is genuinely protected after future construction?",
  "How does the usable carpet area compare with nearby alternatives?",
  "Is the possession date specific to the unit I am considering?",
];

export default function ProjectSpotlight() {
  const project = projects.find((item) => item.name === "SOBHA Magnus");
  if (!project?.video) return null;

  const message = `Hi Asher Realty, I watched the SOBHA Magnus spotlight. Please help me with the unfiltered tower brief: live inventory, all-inclusive cost, best stacks and what I should verify before a visit.`;
  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(message)}`;

  return (
    <section className="overflow-hidden bg-[#041421] py-20 text-white sm:py-28">
      <div className="container-shell">
        <div className="grid gap-12 xl:grid-cols-[1.15fr_.85fr] xl:items-center">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
              <span className="flex size-10 items-center justify-center rounded-full border border-[#e4c462]/25 bg-[#c9a227]/10">
                <Play className="size-4 fill-current" />
              </span>
              One project · looked at properly
            </div>

            <h2 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.96] tracking-[-0.03em] sm:text-7xl">
              See the beauty.
              <span className="block text-[#e4c462]">Then ask better questions.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
              A project film can create desire. A buyer brief should create
              clarity. Explore the visual story, then use the facts and five
              practical questions to decide whether this home deserves a visit.
            </p>

            <div className="mt-9 overflow-hidden rounded-[2rem] border border-white/12 bg-black shadow-[0_35px_100px_rgba(0,0,0,.32)]">
              <video
                controls
                playsInline
                preload="metadata"
                poster={project.image}
                className="aspect-video w-full object-cover"
                aria-label={`${project.name} project film`}
              >
                <source src={project.video} type="video/mp4" />
                Your browser does not support this project film.
              </video>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-white/38">
              Project media is presented for buyer discovery. Confirm final
              specifications, views and phase details for the exact unit.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                  {project.developer}
                </p>
                <h3 className="mt-2 text-4xl font-medium">{project.name}</h3>
                <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-white/55">
                  <MapPin className="mt-1 size-4 shrink-0 text-[#e4c462]" />
                  {project.location}
                </p>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-300">
                Builder-sourced · reviewed {project.verifiedAt}
              </span>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/38">
                  Scale
                </p>
                <p className="mt-2 text-sm font-bold">{project.area}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/38">
                  Home sizes
                </p>
                <p className="mt-2 text-sm font-bold">{project.unitSizes}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/38">
                  <IndianRupee className="size-3" /> Price signal
                </p>
                <p className="mt-2 text-sm font-bold">{project.price}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/38">
                  <CalendarClock className="size-3" /> Possession
                </p>
                <p className="mt-2 text-sm font-bold">{project.possession}</p>
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-7">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#e4c462]">
                <CircleHelp className="size-4" />
                Five questions worth asking
              </p>
              <ol className="mt-5 space-y-3">
                {questions.map((question, index) => (
                  <li key={question} className="flex gap-3 text-xs leading-6 text-white/65">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#c9a227]/12 text-[9px] font-bold text-[#e4c462]">
                      {index + 1}
                    </span>
                    {question}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href={`/projects/${projectSlug(project.name)}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-5 text-sm font-bold text-white transition hover:border-[#e4c462] hover:text-[#e4c462]"
              >
                Open full brief
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-label="Spotlight tower brief"
                className="shine-button inline-flex min-h-12 items-center justify-center rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                <MessageCircle className="mr-2 size-4" />
                Get tower brief
              </a>
            </div>

            <p className="mt-5 flex items-start gap-2 text-[9px] leading-5 text-white/38">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
              RERA: {project.rera}. Price and inventory need a current unit-level check.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
