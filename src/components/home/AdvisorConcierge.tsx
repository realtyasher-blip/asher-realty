import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  GitCompareArrows,
  IndianRupee,
  Layers3,
  MessageCircle,
  Phone,
  Route,
  Sparkles,
} from "lucide-react";

import { projects } from "@/data/projects";

const conversations = [
  {
    icon: IndianRupee,
    title: "What can my budget really buy?",
    text: "See realistic choices near work, including the costs brochures often leave outside the headline price.",
    message:
      "Hi Asher Realty, help me understand what my budget can realistically buy in Bengaluru, including all-in cost and compromises.",
  },
  {
    icon: Layers3,
    title: "Which tower, floor and view?",
    text: "Ask which stacks deserve a premium, which face noise or heat, and what future construction could change.",
    message:
      "Hi Asher Realty, I want help choosing the right tower, floor and view—not just the right project.",
  },
  {
    icon: Route,
    title: "Plan three visits in one route",
    text: "Turn a weekend into a useful comparison with a compact itinerary built around your strongest matches.",
    message:
      "Hi Asher Realty, please plan a focused Bengaluru site-visit route for my best three project matches.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare the decision, not the brochure",
    text: "Put possession, density, usable space, commute and current inventory into one honest side-by-side view.",
    message:
      "Hi Asher Realty, I have shortlisted projects and want an honest side-by-side decision comparison.",
  },
];

const imageNames = ["SOBHA Magnus", "Godrej Tiara", "Embassy Greenshore"];

export default function AdvisorConcierge() {
  const images = imageNames
    .map((name) => projects.find((project) => project.name === name))
    .filter((project): project is (typeof projects)[number] => Boolean(project));
  const developerCount = new Set(projects.map((project) => project.developer)).size;

  return (
    <section id="contact" className="overflow-hidden bg-[#f0eee8] py-20 sm:py-28">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[2.2rem] bg-[#071a2f] text-white shadow-[0_35px_110px_rgba(7,26,47,.2)]">
          <div className="grid xl:grid-cols-[.86fr_1.14fr]">
            <div className="relative min-h-[620px] overflow-hidden p-7 sm:p-10 lg:p-12">
              <div className="premium-grid absolute inset-0 opacity-25" />
              <div className="absolute -left-28 top-10 size-80 rounded-full bg-[#c9a227]/10 blur-3xl" />

              <div className="relative">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4c462]">
                  <Sparkles className="size-4" />
                  Asher buyer concierge
                </p>
                <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[0.96] tracking-[-0.03em] sm:text-7xl">
                  Bring us the question
                  <span className="block text-[#e4c462]">the brochure cannot answer.</span>
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                  A useful agent should reduce uncertainty, not add pressure.
                  Start with the detail you are curious about and receive a
                  market-wide answer across builders.
                </p>

                <div className="mt-9 grid grid-cols-3 gap-2">
                  {images.map((project, index) => (
                    <div
                      key={project.name}
                      className={`relative overflow-hidden rounded-2xl ${
                        index === 1 ? "mt-8 aspect-[3/4]" : "aspect-[3/4]"
                      }`}
                    >
                      <Image
                        src={project.image}
                        alt={`${project.name} visual`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1280px) 30vw, 13vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/75 via-transparent to-transparent" />
                      <p className="absolute inset-x-3 bottom-3 text-[9px] font-bold leading-4 text-white">
                        {project.name}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
                  <div>
                    <p className="text-3xl font-bold text-[#e4c462]">{projects.length}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/42">Projects</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#e4c462]">{developerCount}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/42">Builders</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#e4c462]">1</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/42">Buyer-side desk</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 text-[#071a2f] sm:p-9 lg:p-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b10]">
                    Choose a conversation starter
                  </p>
                  <h3 className="mt-3 text-4xl font-medium sm:text-5xl">
                    What are you curious about?
                  </h3>
                </div>
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <CalendarDays className="size-4 text-[#a47b10]" />
                  Call or continue on WhatsApp
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {conversations.map(({ icon: Icon, title, text, message }) => {
                  const url = `https://wa.me/919019697170?text=${encodeURIComponent(message)}`;
                  return (
                    <a
                      key={title}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics-label={`Concierge ${title}`}
                      className="group flex min-h-64 flex-col rounded-[1.6rem] border border-slate-200 bg-[#f7f7f5] p-6 transition hover:-translate-y-1 hover:border-[#c9a227]/60 hover:bg-white hover:shadow-[0_22px_60px_rgba(7,26,47,.1)]"
                    >
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462] shadow-[0_12px_28px_rgba(7,26,47,.18)]">
                        <Icon className="size-5" />
                      </span>
                      <h4 className="mt-6 text-2xl font-semibold leading-tight">{title}</h4>
                      <p className="mt-3 text-xs leading-6 text-slate-600">{text}</p>
                      <span className="mt-auto inline-flex items-center pt-6 text-xs font-bold text-[#9a7411]">
                        Ask this on WhatsApp
                        <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-[1.5rem] border border-[#c9a227]/20 bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold">Prefer to speak now?</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Call the Asher Realty buyer desk directly.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href="tel:+919019697170"
                    data-analytics-label="Concierge phone call"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white transition hover:bg-[#0d2948]"
                  >
                    <Phone className="mr-2 size-4 text-[#e4c462]" />
                    90196 97170
                  </a>
                  <a
                    href="https://wa.me/919019697170"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                  >
                    <MessageCircle className="mr-2 size-4" />
                    Open WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
