import type { Metadata } from "next";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProjectMarketplace from "@/components/projects/ProjectMarketplace";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

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
                Bengaluru homes
              </p>
              <h1 className="mt-5 text-5xl font-medium leading-tight sm:text-7xl">
                Search less. Shortlist better.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                Filter by the details buyers actually use: preferred area,
                budget and home size. Save promising homes and compare only the
                strongest two before planning visits.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {[
                  "RERA-mapped project profiles",
                  "Carpet + UDS evidence on reviewed filings",
                  "Save without signing in",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/7 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Link
                href="/rera-watch"
                className="mt-7 inline-flex items-center text-sm font-bold text-[#f0d477] transition hover:text-white"
              >
                <ShieldCheck className="mr-2 size-4" />
                See the latest Bengaluru RERA approvals
                <ArrowRight className="ml-2 size-4" />
              </Link>
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
