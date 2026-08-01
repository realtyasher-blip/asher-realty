import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  BrainCircuit,
  Building2,
  Calculator,
  CalendarClock,
  Check,
  IndianRupee,
  MapPin,
  MapPinned,
  MessageCircle,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import BrandLogo from "@/components/brand/BrandLogo";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { buttonVariants } from "@/components/ui/button";
import ProjectActions from "@/components/projects/ProjectActions";
import ProjectFitCard from "@/components/projects/ProjectFitCard";
import {
  developerLogos,
  getProjectBySlug,
  projectSlug,
  projects,
} from "@/data/projects";
import { developerSlug, getDeveloperBySlug } from "@/data/developers";
import { cn } from "@/lib/utils";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: projectSlug(project.name) }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.name} | Bengaluru Property`,
    description: `${project.description} Get verified pricing, availability and guided site-visit assistance from Asher Realty.`,
    openGraph: {
      title: `${project.name} | Asher Realty`,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    `Hi Asher Realty, I am interested in ${project.name}. Please share the latest price, availability, floor plans and site-visit slots.`
  )}`;
  const amenities = project.amenities ?? project.highlights;
  const nearby = project.nearby ?? [
    project.location,
    project.corridor,
    "Detailed drive-time check available before your visit",
  ];
  const buyerNotes = project.buyerNotes ?? [
    `Compare ${project.name} with similar ${project.corridor} options before choosing a tower or phase.`,
    "Ask for an all-inclusive cost sheet, tower-specific availability and RERA-linked possession schedule.",
  ];
  const developerLogo = developerLogos[project.developer];
  const developerProfile = getDeveloperBySlug(developerSlug(project.developer));
  const isComingSoon = project.status === "Coming soon";
  const statusLabel = isComingSoon ? "EOI / Coming soon" : project.status;
  const primaryCtaLabel = isComingSoon
    ? "Register Interest Safely"
    : "Get Price & Floor Plans";

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-[#071a2f]/70 backdrop-blur-xl">
        <div className="container-shell flex h-20 items-center justify-between">
          <Link href="/" aria-label="Asher Realty home">
            <BrandLogo />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-[#e4c462]"
          >
            <ArrowLeft className="size-4" />
            All projects
          </Link>
        </div>
      </header>

      <main className="bg-[#f5f6f8]">
        <section className="relative min-h-[72vh] overflow-hidden bg-[#071a2f] text-white">
          <Image
            src={project.image}
            alt={`${project.name} exterior`}
            fill
            preload
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071a2f] via-[#071a2f]/80 to-[#071a2f]/20" />
          <div className="container-shell relative flex min-h-[72vh] items-end pb-16 pt-32">
            <div className="max-w-4xl">
              {developerLogo && (
                <div className="relative mb-6 h-14 w-40 rounded-xl border border-white/20 bg-white/95 p-3 shadow-xl">
                  <Image
                    src={developerLogo}
                    alt={`${project.developer} official logo`}
                    fill
                    className="object-contain p-3"
                    sizes="160px"
                    unoptimized={developerLogo.endsWith(".svg")}
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
                  {statusLabel}
                </span>
                <span className="rounded-full border border-[#c9a227]/40 bg-[#c9a227]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e4c462] backdrop-blur">
                  {project.developer}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
                  {project.corridor}
                </span>
              </div>
              <p className="mt-5 text-xs font-semibold text-white/45">
                Bengaluru · {project.location} · {project.configuration}
              </p>
              <h1 className="mt-6 text-5xl font-medium leading-none sm:text-7xl">
                {project.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                {project.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-14 rounded-full bg-[#c9a227] px-8 text-[#071a2f] hover:bg-[#e4c462]"
                  )}
                >
                  <MessageCircle className="mr-2 size-5" />
                  {primaryCtaLabel}
                </a>
                <a
                  href="tel:+919019697170"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-14 rounded-full border-white/30 bg-white/5 px-8 text-white hover:bg-white hover:text-[#071a2f]"
                  )}
                >
                  <Phone className="mr-2 size-5" />
                  Call 9019697170
                </a>
              </div>
              <ProjectActions slug={projectSlug(project.name)} name={project.name} />
            </div>
          </div>
        </section>

        <nav
          aria-label="Project sections"
          className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-[0_10px_35px_rgba(7,26,47,.07)] backdrop-blur-xl"
        >
          <div className="container-shell flex items-center gap-1 overflow-x-auto py-2">
            {[
              ["Overview", "#overview"],
              ["Photos & video", "#gallery"],
              ["Amenities", "#amenities"],
              ["Location", "#location"],
              ["About builder", "#builder"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="shrink-0 rounded-full px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-[#f3f5f7] hover:text-[#071a2f]"
              >
                {label}
              </a>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hidden h-10 shrink-0 items-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white transition hover:bg-[#c9a227] hover:text-[#071a2f] sm:inline-flex"
            >
              Ask about this project
            </a>
          </div>
        </nav>

        <section id="overview" className="container-shell relative z-10 scroll-mt-20 pb-24 pt-8">
          <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(7,26,47,0.12)] sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
            {[
              { icon: MapPin, label: "Location", value: project.location },
              { icon: BedDouble, label: "Homes", value: project.configuration },
              { icon: IndianRupee, label: "Indicative price", value: project.price },
              {
                icon: CalendarClock,
                label: "Possession",
                value: project.possession || "Confirm current phase",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-[#f7f8fa] p-5">
                <Icon className="size-5 text-[#c9a227]" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#071a2f]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {project.launchNote && (
            <div className="mt-5 flex items-start gap-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <ShieldCheck className="mt-0.5 size-6 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
                  EOI / pre-launch protection
                </p>
                <p className="mt-2 text-sm leading-7">{project.launchNote}</p>
              </div>
            </div>
          )}

          <ProjectFitCard project={project} />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_45px_rgba(7,26,47,0.06)]">
              <Building2 className="size-7 text-[#c9a227]" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Project snapshot
              </p>
              <div className="mt-5 space-y-4">
                {[
                  ["Property type", project.propertyType || "Premium residential community"],
                  ["Unit sizes", project.unitSizes || "Request current area schedule"],
                  ["Development", project.area || "Confirm current phase"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-5 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="max-w-[60%] text-right text-sm font-semibold leading-6 text-[#071a2f]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-[#c9a227]/25 bg-[#fffaf0] p-6">
              <Sparkles className="size-7 text-[#b08a16]" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#9a7613]">
                Asher buyer lens
              </p>
              <div className="mt-5 space-y-4">
                {buyerNotes.map((note) => (
                  <div key={note} className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-[#b08a16]" />
                    <p className="text-sm leading-6 text-[#5e4a15]">{note}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-slate-200 bg-[#071a2f] p-6 text-white">
              <BadgeCheck className="size-7 text-[#e4c462]" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                Verification desk
              </p>
              <p className="mt-5 text-sm leading-7 text-white/65">
                We reconfirm the selected tower, inventory, floor plan, payment
                schedule and all-inclusive cost before arranging your visit.
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/40">Last editorial check</p>
                <p className="mt-1 font-semibold">{project.verifiedAt}</p>
              </div>
            </article>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            <div id="gallery" className="scroll-mt-20">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                Project gallery
              </p>
              <h2 className="mt-4 text-4xl font-medium text-[#071a2f] sm:text-5xl">
                See the experience
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((image, index) => (
                  <div
                    key={image}
                    className={cn(
                      "relative overflow-hidden rounded-[1.5rem] bg-slate-200",
                      index === 0 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${project.name} gallery ${index + 1}`}
                      fill
                      className="object-cover transition duration-700 hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                    />
                  </div>
                ))}
              </div>
              {project.mediaNote && (
                <p className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs leading-6 text-slate-500">
                  <strong className="text-[#071a2f]">Media note:</strong>{" "}
                  {project.mediaNote}
                </p>
              )}
              {project.video && (
                <div className="mt-10">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#071a2f] text-[#e4c462]">
                      <ArrowRight className="size-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b08a16]">
                        Official project film
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Stream only when you choose to play
                      </p>
                    </div>
                  </div>
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={project.image}
                    className="aspect-video w-full rounded-[1.5rem] bg-[#071a2f] object-cover"
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>
                </div>
              )}

              <section id="amenities" className="mt-16 scroll-mt-20">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                  Lifestyle programme
                </p>
                <h2 className="mt-4 text-4xl font-medium text-[#071a2f]">
                  Amenities buyers ask about
                </h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff7dc]">
                        <Check className="size-4 text-[#b08a16]" />
                      </span>
                      <span className="text-sm font-semibold text-[#071a2f]">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="location" className="mt-16 scroll-mt-20 overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
                <div className="border-b border-slate-100 bg-[#f7f8fa] p-7">
                  <Route className="size-7 text-[#c9a227]" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#b08a16]">
                    Location context
                  </p>
                  <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
                    What sits around the address
                  </h2>
                </div>
                <div className="grid gap-0 sm:grid-cols-2">
                  {nearby.map((place) => (
                    <div
                      key={place}
                      className="flex gap-3 border-b border-slate-100 p-5 sm:border-r"
                    >
                      <MapPinned className="mt-0.5 size-5 shrink-0 text-[#b08a16]" />
                      <span className="text-sm leading-6 text-slate-600">{place}</span>
                    </div>
                  ))}
                </div>
              </section>

              {developerProfile && (
                <section
                  id="builder"
                  className="mt-16 scroll-mt-20 overflow-hidden rounded-[2rem] border border-slate-200 bg-white"
                >
                  <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
                    <div className="flex flex-col justify-between bg-[#071a2f] p-7 text-white sm:p-9">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                          About the builder
                        </p>
                        {developerLogo && (
                          <div className="relative mt-6 h-16 w-44 rounded-xl bg-white p-3">
                            <Image
                              src={developerLogo}
                              alt={`${project.developer} official logo`}
                              fill
                              className="object-contain p-3"
                              sizes="176px"
                              unoptimized={developerLogo.endsWith(".svg")}
                            />
                          </div>
                        )}
                        <h2 className="mt-7 text-3xl font-medium">
                          {developerProfile.name}
                        </h2>
                        <p className="mt-2 text-xs font-semibold text-white/40">
                          {developerProfile.established} · {developerProfile.headquarters}
                        </p>
                      </div>
                      <Link
                        href={`/builders/${developerSlug(developerProfile.name)}`}
                        className="mt-8 inline-flex items-center text-sm font-bold text-[#e4c462]"
                      >
                        Full builder profile
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </div>
                    <div className="p-7 sm:p-9">
                      <p className="text-sm leading-8 text-slate-600">
                        {developerProfile.summary}
                      </p>
                      <div className="mt-7 flex flex-wrap gap-2">
                        {developerProfile.knownFor.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-[#fff7dc] px-3 py-2 text-[10px] font-bold text-[#765907]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="mt-7 rounded-2xl bg-[#f3f5f7] p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a47b10]">
                          Buyer perspective
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#071a2f]">
                          {developerProfile.buyerLens}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="h-fit rounded-[2rem] bg-[#071a2f] p-7 text-white lg:sticky lg:top-28">
              <ShieldCheck className="size-9 text-[#e4c462]" />
              <h2 className="mt-5 text-3xl font-medium">Buyer-ready brief</h2>
              <p className="mt-4 leading-7 text-white/60">
                {isComingSoon
                  ? "Get the current EOI terms, RERA check, phase release and launch updates from one Asher Realty advisor."
                  : "Get the current cost sheet, available units, floor plans and guided site-visit assistance from one Asher Realty advisor."}
              </p>
              <div className="mt-7 space-y-4">
                {project.highlights.map((highlight) => (
                  <div key={highlight} className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#c9a227]/15">
                      <Check className="size-3.5 text-[#e4c462]" />
                    </span>
                    <span className="text-sm leading-6 text-white/78">{highlight}</span>
                  </div>
                ))}
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#c9a227] px-6 font-semibold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                {isComingSoon ? "Request Verified EOI Brief" : "Request Complete Details"}
              </a>
              <p className="mt-5 text-xs leading-5 text-white/35">
                Verified {project.verifiedAt}. Pricing and inventory require
                live developer confirmation.
              </p>
              {project.rera && (
                <p className="mt-3 break-words text-[10px] leading-5 text-white/35">
                  RERA: {project.rera}
                </p>
              )}
              <Link
                href={`/decision-lab?project=${projectSlug(project.name)}`}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full border border-[#c9a227]/45 bg-[#c9a227]/10 px-5 text-sm font-semibold text-[#e4c462] transition hover:bg-[#c9a227] hover:text-[#071a2f]"
              >
                <BrainCircuit className="mr-2 size-4" />
                Run through Decision Lab
              </Link>
              <Link
                href="/tools"
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white/75 transition hover:border-[#c9a227] hover:text-[#e4c462]"
              >
                <Calculator className="mr-2 size-4" />
                Estimate EMI & buying cost
              </Link>
              <Link
                href="/book-site-visit"
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white/75 transition hover:border-[#c9a227] hover:text-[#e4c462]"
              >
                <MapPin className="mr-2 size-4" />
                Plan a guided site visit
              </Link>
            </aside>
          </div>

          <div className="mt-20 border-t border-slate-200 pt-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                  Similar options
                </p>
                <h2 className="mt-4 text-4xl font-medium text-[#071a2f] sm:text-5xl">
                  Compare before deciding
                </h2>
              </div>
              <Link
                href={`/compare?projects=${projectSlug(project.name)},${projectSlug(
                  projects.find(
                    (candidate) =>
                      candidate.name !== project.name &&
                      candidate.corridor === project.corridor
                  )?.name ?? projects.find((candidate) => candidate.name !== project.name)!.name
                )}`}
                className="inline-flex items-center text-sm font-bold text-[#071a2f] hover:text-[#b08a16]"
              >
                Open comparison
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {projects
                .filter(
                  (candidate) =>
                    candidate.name !== project.name &&
                    (candidate.corridor === project.corridor ||
                      candidate.developer === project.developer)
                )
                .slice(0, 3)
                .map((candidate) => (
                  <Link
                    key={candidate.name}
                    href={`/projects/${projectSlug(candidate.name)}`}
                    className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={candidate.image}
                        alt={candidate.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b08a16]">
                        {candidate.developer} · {candidate.status}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium text-[#071a2f]">
                        {candidate.name}
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {candidate.location} · {candidate.configuration}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <FloatingWhatsApp />
    </>
  );
}
