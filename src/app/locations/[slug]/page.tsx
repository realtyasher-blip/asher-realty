import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  GitCompareArrows,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProjectCard from "@/components/projects/ProjectCard";
import {
  getLocationHub,
  getProjectsForLocation,
  locationHubs,
} from "@/data/locations";
import { projectSlug } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return locationHubs.map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hub = getLocationHub((await params).slug);
  if (!hub) return {};
  return {
    title: `${hub.name} Properties & Projects`,
    description: `${hub.summary} Compare active ${hub.name} projects with buyer guidance from Asher Realty.`,
    alternates: { canonical: `/locations/${hub.slug}` },
  };
}

export default async function LocationDetailPage({ params }: Props) {
  const hub = getLocationHub((await params).slug);
  if (!hub) notFound();

  const matches = getProjectsForLocation(hub);
  const developers = Array.from(new Set(matches.map((project) => project.developer)));
  const underConstruction = matches.filter(
    (project) => project.status === "Under construction"
  ).length;
  const compareUrl =
    matches.length > 1
      ? `/compare?projects=${matches
          .slice(0, 2)
          .map((project) => projectSlug(project.name))
          .join(",")}`
      : "/compare";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Active residential projects in ${hub.name}`,
    numberOfItems: matches.length,
    itemListElement: matches.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: `https://asherrealty.in/projects/${projectSlug(project.name)}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />
      <main className="bg-[#f5f6f8] pt-20">
        <section className="bg-[#071a2f] py-16 text-white sm:py-20">
          <div className="container-shell">
            <Link
              href="/locations"
              className="inline-flex items-center text-sm font-semibold text-white/60 hover:text-[#e4c462]"
            >
              <ArrowLeft className="mr-2 size-4" />
              All Bengaluru locations
            </Link>
            <p className="mt-10 text-sm font-bold uppercase tracking-[0.24em] text-[#e4c462]">
              {hub.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-6xl font-medium leading-[1.02] sm:text-7xl">
              Property in {hub.name}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/62">
              {hub.summary}
            </p>

            <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
              {[
                { icon: Building2, value: matches.length, label: "Active projects" },
                { icon: Users, value: developers.length, label: "Developers represented" },
                { icon: BadgeCheck, value: underConstruction, label: "Under construction" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Icon className="size-5 text-[#e4c462]" />
                  <p className="mt-4 text-3xl font-bold">{value}</p>
                  <p className="mt-1 text-xs text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container-shell grid gap-8 lg:grid-cols-[1fr_.72fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b08a16]">
                Who this location suits
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {hub.bestFor.map((item) => (
                  <div key={item} className="rounded-xl bg-[#f5f6f8] p-4 text-sm font-semibold text-[#071a2f]">
                    <ShieldCheck className="mb-3 size-5 text-[#b08a16]" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-slate-100 pt-6 text-sm leading-7 text-slate-600">
                <strong className="text-[#071a2f]">Buyer check:</strong>{" "}
                {hub.buyerNote}
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-[#071a2f] p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e4c462]">
                Location anchors
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {hub.connectivity.map((item) => (
                  <span key={item} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/65">
                    <MapPin className="mr-2 size-3.5 text-[#e4c462]" />
                    {item}
                  </span>
                ))}
              </div>
              <Link
                href={compareUrl}
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#071a2f]"
              >
                <GitCompareArrows className="mr-2 size-4" />
                Compare leading options
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-shell">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.2em] text-[#b08a16]">
                  Active catalogue
                </p>
                <h2 className="mt-3 text-5xl font-medium text-[#071a2f]">
                  Projects in {hub.name}
                </h2>
              </div>
              <a
                href={`https://wa.me/919019697170?text=${encodeURIComponent(
                  `Hi Asher Realty, please create a current shortlist of the best projects in ${hub.name} for my budget and commute.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-label={`${hub.name} shortlist request`}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#071a2f] px-6 text-sm font-bold text-white"
              >
                Build a location shortlist
                <ArrowRight className="ml-2 size-4" />
              </a>
            </div>
            <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {matches.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
