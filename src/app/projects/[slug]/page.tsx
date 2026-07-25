import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  CalendarClock,
  Check,
  IndianRupee,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import BrandLogo from "@/components/brand/BrandLogo";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { buttonVariants } from "@/components/ui/button";
import { getProjectBySlug, projectSlug, projects } from "@/data/projects";
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

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-[#071a2f]/70 backdrop-blur-xl">
        <div className="container-shell flex h-20 items-center justify-between">
          <Link href="/" aria-label="Asher Realty home">
            <BrandLogo />
          </Link>
          <Link
            href="/#projects"
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
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071a2f] via-[#071a2f]/80 to-[#071a2f]/20" />
          <div className="container-shell relative flex min-h-[72vh] items-end pb-16 pt-32">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
                  {project.status}
                </span>
                <span className="rounded-full border border-[#c9a227]/40 bg-[#c9a227]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e4c462] backdrop-blur">
                  {project.developer}
                </span>
              </div>
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
                  Get Price & Floor Plans
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
            </div>
          </div>
        </section>

        <section className="container-shell relative z-10 -mt-8 pb-24">
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

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
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
              {project.video && (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={project.image}
                  className="mt-4 aspect-video w-full rounded-[1.5rem] bg-[#071a2f] object-cover"
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              )}
            </div>

            <aside className="h-fit rounded-[2rem] bg-[#071a2f] p-7 text-white lg:sticky lg:top-28">
              <ShieldCheck className="size-9 text-[#e4c462]" />
              <h2 className="mt-5 text-3xl font-medium">Buyer-ready brief</h2>
              <p className="mt-4 leading-7 text-white/60">
                Get the current cost sheet, available units, floor plans and
                guided site-visit assistance from one Asher Realty advisor.
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
                Request Complete Details
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
            </aside>
          </div>
        </section>
      </main>
      <FloatingWhatsApp />
    </>
  );
}
