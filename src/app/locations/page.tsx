import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, Users } from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getProjectsForLocation, locationHubs } from "@/data/locations";

export const metadata: Metadata = {
  title: "Bengaluru Property Locations",
  description:
    "Explore Bengaluru property corridors, active projects and buyer-focused location insights from Asher Realty.",
};

export default function LocationsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f5f6f8] pt-20">
        <section className="bg-[#071a2f] py-20 text-white sm:py-24">
          <div className="container-shell">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#e4c462]">
              Bengaluru location intelligence
            </p>
            <h1 className="mt-5 max-w-4xl text-6xl font-medium leading-[1.02] sm:text-7xl">
              Choose the corridor before the tower.
            </h1>
            <p className="mt-7 max-w-2xl leading-8 text-white/62">
              Compare active supply, buyer fit and practical location trade-offs
              across Bengaluru’s major residential hubs.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="container-shell grid gap-6 md:grid-cols-2">
            {locationHubs.map((hub) => {
              const matches = getProjectsForLocation(hub);
              const developers = new Set(matches.map((project) => project.developer));
              return (
                <article
                  key={hub.slug}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(7,26,47,.06)]"
                >
                  <div className="relative aspect-[16/8] overflow-hidden">
                    <Image
                      src={matches[0]?.image || "/images/hero-property-v2.png"}
                      alt={`${hub.name} residential property`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/90 via-[#071a2f]/10 to-transparent" />
                    <div className="absolute inset-x-6 bottom-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                        {hub.eyebrow}
                      </p>
                      <h2 className="mt-2 text-4xl font-medium">{hub.name}</h2>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    <p className="text-sm leading-7 text-slate-600">{hub.summary}</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f5f6f8] p-4">
                        <Building2 className="size-4 text-[#b08a16]" />
                        <p className="mt-2 text-xl font-bold text-[#071a2f]">{matches.length}</p>
                        <p className="text-[10px] uppercase tracking-[.12em] text-slate-400">Active projects</p>
                      </div>
                      <div className="rounded-xl bg-[#f5f6f8] p-4">
                        <Users className="size-4 text-[#b08a16]" />
                        <p className="mt-2 text-xl font-bold text-[#071a2f]">{developers.size}</p>
                        <p className="text-[10px] uppercase tracking-[.12em] text-slate-400">Developers</p>
                      </div>
                    </div>
                    <Link
                      href={`/locations/${hub.slug}`}
                      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#071a2f] px-5 text-sm font-bold text-white transition hover:bg-[#c9a227] hover:text-[#071a2f]"
                    >
                      <MapPin className="mr-2 size-4" />
                      Explore {hub.name}
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

