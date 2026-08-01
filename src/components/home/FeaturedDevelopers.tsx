import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import {
  developerProfiles,
  developerSlug,
  getDeveloperLogo,
} from "@/data/developers";
import { projects } from "@/data/projects";

export default function FeaturedDevelopers() {
  return (
    <section className="content-auto-section overflow-hidden bg-white py-20 sm:py-24">
      <div className="container-shell">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              Builder Intelligence
            </p>
            <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              Understand who is building your home
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Go beyond the logo. See each developer&apos;s background, strengths,
              current Bengaluru projects and the details buyers should verify.
            </p>
          </div>
          <Link
            href="/builders"
            className="inline-flex h-12 w-fit items-center justify-center rounded-full border border-[#071a2f]/20 bg-white px-6 text-sm font-semibold text-[#071a2f] transition hover:bg-[#071a2f] hover:text-white"
          >
            Explore all builders
            <ArrowUpRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {developerProfiles.slice(0, 6).map((profile) => {
            const logo = getDeveloperLogo(profile.name);
            const count = projects.filter(
              (project) => project.developer === profile.name
            ).length;

            return (
              <Link
                key={profile.name}
                href={`/builders/${developerSlug(profile.name)}`}
                className="group rounded-[1.6rem] border border-slate-200 bg-[#f7f8fa] p-6 transition hover:-translate-y-1 hover:border-[#c9a227]/45 hover:bg-white hover:shadow-[0_20px_55px_rgba(7,26,47,.1)]"
              >
                <div className="flex items-center justify-between gap-5">
                  <div className="relative h-14 w-36">
                    {logo && (
                      <Image
                        src={logo}
                        alt={`${profile.name} official logo`}
                        fill
                        className="object-contain object-left"
                        sizes="144px"
                        unoptimized={logo.endsWith(".svg")}
                      />
                    )}
                  </div>
                  <span className="rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 shadow-sm">
                    {count} option{count === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9b7410]">
                  {profile.established} · {profile.headquarters}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#071a2f]">
                  {profile.name}
                </h3>
                <p className="mt-3 line-clamp-2 text-xs leading-6 text-slate-500">
                  {profile.summary}
                </p>
                <span className="mt-6 inline-flex items-center text-xs font-bold text-[#071a2f]">
                  Builder profile and projects
                  <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-7 text-center text-xs leading-5 text-slate-400">
          Builder information is editorial context. Project-level approvals,
          pricing, specifications and timelines require current verification.
        </p>
      </div>
    </section>
  );
}
