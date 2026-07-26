import type { Metadata } from "next";

import CompareWorkspace from "@/components/projects/CompareWorkspace";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Compare Bengaluru Properties",
  description:
    "Compare Bengaluru projects side by side across builder, location, project stage, configuration, price, possession and RERA information.",
};

type ComparePageProps = {
  searchParams: Promise<{ projects?: string }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { projects } = await searchParams;
  const [first, second] = projects?.split(",") ?? [];

  return (
    <>
      <Navbar />
      <main className="bg-[#f4f5f7] pb-24 pt-32">
        <div className="container-shell">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a16]">
              Side-by-side clarity
            </p>
            <h1 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-7xl">
              Compare the details before visiting.
            </h1>
            <p className="mt-6 max-w-2xl leading-8 text-slate-600">
              Select any two active projects, review buyer-relevant differences
              and share the comparison with your family or advisor.
            </p>
          </div>
          <div className="mt-12">
            <CompareWorkspace initialFirst={first} initialSecond={second} />
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
