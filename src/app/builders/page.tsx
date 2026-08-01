import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ShieldCheck } from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  developerProfiles,
  developerSlug,
  getDeveloperLogo,
} from "@/data/developers";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Bengaluru Builders | Developer Profiles & Projects",
  description:
    "Understand leading Bengaluru builders, what each is known for, what buyers should verify and which current projects are available to compare.",
};

export default function BuildersPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f3f5f7]">
        <section className="relative overflow-hidden bg-[#041421] pb-20 pt-36 text-white">
          <div className="premium-grid absolute inset-0 opacity-35" />
          <div className="container-shell relative">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                <ShieldCheck className="size-4" />
                Builder intelligence
              </span>
              <h1 className="mt-7 text-5xl font-medium leading-[0.98] sm:text-7xl">
                Know the builder before you choose the building.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Compare the background, strengths, buyer fit and verification
                points of Bengaluru&apos;s leading developers—without leaving the
                Asher Realty platform.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {[
                  `${developerProfiles.length} developer profiles`,
                  `${projects.length} current projects`,
                  "Buyer-side verification lens",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-16 sm:py-20">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {developerProfiles.map((profile) => {
              const logo = getDeveloperLogo(profile.name);
              const count = projects.filter(
                (project) => project.developer === profile.name
              ).length;

              return (
                <Link
                  key={profile.name}
                  href={`/builders/${developerSlug(profile.name)}`}
                  className="group flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(7,26,47,.06)] transition hover:-translate-y-1 hover:border-[#c9a227]/45 hover:shadow-[0_24px_65px_rgba(7,26,47,.11)]"
                >
                  <div className="flex items-start justify-between gap-5">
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
                    <span className="rounded-full bg-[#f3f5f7] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      {count} project{count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a47b10]">
                    {profile.established} · {profile.headquarters}
                  </p>
                  <h2 className="mt-2 text-3xl font-medium text-[#071a2f]">
                    {profile.name}
                  </h2>
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                    {profile.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {profile.knownFor.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#fff7dc] px-3 py-1.5 text-[10px] font-bold text-[#765907]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="mt-7 inline-flex items-center text-sm font-bold text-[#071a2f]">
                    View builder profile
                    <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 grid gap-4 rounded-[2rem] bg-[#071a2f] p-7 text-white md:grid-cols-3 sm:p-9">
            {[
              {
                icon: Building2,
                title: "Compare the exact project",
                text: "A strong builder does not make every phase identical. Review the specific tower, plan and legal entity.",
              },
              {
                icon: BadgeCheck,
                title: "Verify current disclosures",
                text: "RERA, possession, specifications, inventory and cost sheets should be checked for the current phase.",
              },
              {
                icon: ShieldCheck,
                title: "Use reputation as context",
                text: "Brand history is useful, but your decision should still rest on project-level facts and personal fit.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <Icon className="size-5 text-[#e4c462]" />
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
