import type { Metadata } from "next";

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
