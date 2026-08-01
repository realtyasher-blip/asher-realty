import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  developerProfiles,
  developerSlug,
  getDeveloperBySlug,
  getDeveloperLogo,
} from "@/data/developers";
import { projectSlug, projects } from "@/data/projects";

type BuilderPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return developerProfiles.map((profile) => ({
    slug: developerSlug(profile.name),
  }));
}

export async function generateMetadata({
  params,
}: BuilderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getDeveloperBySlug(slug);
  if (!profile) return {};
  return {
    title: `${profile.name} Bengaluru Projects & Builder Profile`,
    description: `${profile.summary} Explore current Bengaluru projects and buyer verification guidance from Asher Realty.`,
  };
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { slug } = await params;
  const profile = getDeveloperBySlug(slug);
  if (!profile) notFound();

  const builderProjects = projects.filter(
    (project) => project.developer === profile.name
  );
  const logo = getDeveloperLogo(profile.name);

  return (
    <>
      <Navbar />
      <main className="bg-[#f3f5f7]">
        <section className="relative overflow-hidden bg-[#041421] pb-20 pt-36 text-white">
          <div className="premium-grid absolute inset-0 opacity-35" />
          <div className="container-shell relative">
            <Link
              href="/builders"
              className="inline-flex items-center text-xs font-bold text-white/55 transition hover:text-[#e4c462]"
            >
              <ArrowLeft className="mr-2 size-4" />
              All builder profiles
            </Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
              <div className="max-w-4xl">
                <div className="relative h-20 w-52 rounded-2xl bg-white p-4 shadow-xl">
                  {logo && (
                    <Image
                      src={logo}
                      alt={`${profile.name} official logo`}
                      fill
                      className="object-contain p-4"
                      sizes="208px"
                      unoptimized={logo.endsWith(".svg")}
                    />
                  )}
                </div>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                  {profile.established} · {profile.headquarters}
                </p>
                <h1 className="mt-3 text-5xl font-medium leading-none sm:text-7xl">
                  {profile.name}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/67 sm:text-lg">
                  {profile.summary}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="text-4xl font-bold text-[#e4c462]">
                  {builderProjects.length}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                  Bengaluru projects tracked
                </p>
                <p className="mt-5 text-xs leading-6 text-white/55">
                  Current catalogue coverage on Asher Realty. Availability and
                  phase details are reconfirmed before a visit.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-16 sm:py-20">
          <div className="grid gap-5 lg:grid-cols-3">
            <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                What the builder is known for
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {profile.knownFor.map((item) => (
                  <div key={item} className="rounded-2xl bg-[#f3f5f7] p-5">
                    <BadgeCheck className="size-5 text-[#b08a16]" />
                    <p className="mt-4 text-sm font-bold leading-6 text-[#071a2f]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-[1.75rem] bg-[#fff7dc] p-7">
              <ShieldCheck className="size-7 text-[#9b7410]" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#8b6810]">
                Asher buyer lens
              </p>
              <p className="mt-4 text-sm leading-7 text-[#5e4a15]">
                {profile.buyerLens}
              </p>
            </article>
          </div>

          <div className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a16]">
                Current Bengaluru catalogue
              </p>
              <h2 className="mt-3 text-4xl font-medium text-[#071a2f] sm:text-5xl">
                Projects by {profile.name}
              </h2>
            </div>
            <Link
              href={`/projects?builder=${encodeURIComponent(profile.name)}`}
              className="inline-flex items-center text-sm font-bold text-[#071a2f]"
            >
              Open filtered marketplace
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>

          {builderProjects.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {builderProjects.map((project) => (
                <Link
                  key={project.name}
                  href={`/projects/${projectSlug(project.name)}`}
                  className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(7,26,47,.06)] transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#071a2f] backdrop-blur">
                      {project.status}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#071a2f]">
                      {project.name}
                    </h3>
                    <p className="mt-3 flex gap-2 text-xs leading-5 text-slate-500">
                      <MapPin className="size-4 shrink-0 text-[#b08a16]" />
                      {project.location}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-slate-500">
                      {project.configuration} · {project.price}
                    </p>
                    <span className="mt-6 inline-flex items-center text-sm font-bold text-[#071a2f]">
                      See full project details
                      <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center">
              <Building2 className="mx-auto size-8 text-[#c9a227]" />
              <p className="mt-4 text-sm text-slate-500">
                Ask Asher Realty to verify the latest Bengaluru inventory from
                this builder.
              </p>
            </div>
          )}

          <div className="mt-16 grid gap-7 rounded-[2rem] bg-[#071a2f] p-7 text-white lg:grid-cols-[1fr_1.1fr] sm:p-10">
            <div>
              <Check className="size-8 text-[#e4c462]" />
              <h2 className="mt-5 text-3xl font-medium sm:text-4xl">
                What to verify before you shortlist
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/55">
                Builder reputation is context. The purchase decision still
                depends on the exact project, phase, tower and legal documents.
              </p>
            </div>
            <div className="space-y-3">
              {profile.verify.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#c9a227]/15 text-xs font-bold text-[#e4c462]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-white/78">{item}</span>
                </div>
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
