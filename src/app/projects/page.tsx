import type { Metadata } from "next";
import Link from "next/link";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProjectMarketplace from "@/components/projects/ProjectMarketplace";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Bengaluru Projects | Search New & Under-Construction Homes",
  description:
    "Search and compare new-launch and under-construction Bengaluru properties by builder, corridor, configuration, price and project stage.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#071a2f] pb-16 pt-32 text-white">
          <div className="container-shell">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#e4c462]">
                Bengaluru Property Marketplace
              </p>
              <h1 className="mt-5 text-5xl font-medium leading-tight sm:text-7xl">
                Find a home that fits your real life.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                Search a professionally curated catalogue of current new-launch
                and under-construction homes. Compare facts, save favourites and
                plan a guided visit without opening ten builder websites.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/decision-lab"
                  className="inline-flex h-13 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  Get my AI shortlist
                </Link>
                <a
                  href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20please%20help%20me%20shortlist%20Bengaluru%20projects."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-6 text-sm font-bold text-white transition hover:border-[#c9a227]/60 hover:bg-white/[0.1]"
                >
                  Ask an advisor
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                {[
                  `${projects.length} active options`,
                  `${new Set(projects.map((project) => project.developer)).size} leading builders`,
                  "Official project media",
                  "RERA & possession tracking",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/7 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <ProjectMarketplace />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
