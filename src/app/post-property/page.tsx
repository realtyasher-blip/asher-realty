import type { Metadata } from "next";
import {
  BadgeCheck,
  Camera,
  FileCheck2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import PropertySubmissionForm from "@/components/forms/PropertySubmissionForm";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Post a Property for Rent or Resale in Bengaluru",
  description:
    "Privately submit a Bengaluru property for resale or rent-out assistance. Asher Realty reviews owner authority, property facts and commercial terms before any publication.",
};

const reviewSteps = [
  {
    icon: BadgeCheck,
    title: "Owner authority check",
    text: "We first confirm who is offering the property and their authority to do so.",
  },
  {
    icon: FileCheck2,
    title: "Property fact review",
    text: "Area basis, project, availability and commercial expectations are reconciled.",
  },
  {
    icon: Camera,
    title: "Private media collection",
    text: "Photos and video are requested privately after the first review—not through this public form.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled publication",
    text: "Nothing goes live automatically. Only approved public facts are used in a listing.",
  },
];

export default async function PostPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawIntent = Array.isArray(params.intent) ? params.intent[0] : params.intent;
  const initialIntent =
    rawIntent === "sell" ? "Sell" : rawIntent === "rent" ? "Rent out" : "";

  return (
    <>
      <Navbar />
      <main className="bg-[#eef2f3] pt-20">
        <section className="relative overflow-hidden bg-[#041421] py-16 text-white sm:py-20">
          <div className="premium-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-40 top-0 size-[32rem] rounded-full bg-[#c9a227]/10 blur-3xl" />
          <div className="container-shell relative grid gap-12 xl:grid-cols-[.7fr_1.3fr] xl:items-start">
            <div className="xl:sticky xl:top-28">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f0d477]">
                <LockKeyhole className="size-4" />
                Private property intake
              </span>
              <h1 className="mt-6 text-6xl font-medium leading-[.96] sm:text-7xl">
                Sell or rent out,
                <span className="block text-[#e4c462]">with a managed review.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-8 text-white/62 sm:text-base">
                Share the essentials without uploading identity or title documents.
                An Asher owner advisor will verify the property, agree on next
                steps and request media privately before any listing is considered.
              </p>

              <div className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {reviewSteps.map(({ icon: Icon, title, text }) => (
                  <article key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.05] p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/12 text-[#e4c462]">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold">{title}</h2>
                      <p className="mt-1 text-[11px] leading-5 text-white/48">{text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <a
                href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20would%20like%20help%20posting%20my%20Bengaluru%20property%20for%20rent%20or%20resale."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex h-12 items-center rounded-full border border-white/15 px-5 text-xs font-bold text-white transition hover:border-[#c9a227]/50"
              >
                <MessageCircle className="mr-2 size-4 text-[#e4c462]" />
                Prefer advisor-assisted posting?
              </a>
            </div>

            <PropertySubmissionForm initialIntent={initialIntent} />
          </div>
        </section>

        <section className="py-14 sm:py-18">
          <div className="container-shell rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 sm:p-8">
            <p className="font-bold text-[#071a2f]">Important before you submit</p>
            <p className="mt-2">
              This is a private request for assistance—not an instant public advertisement or guaranteed valuation. Do not enter an exact flat number or upload Aadhaar, PAN, sale deeds, Khata, tax receipts or other sensitive documents through the public form. Any brokerage, photography, legal-review or marketing charges will be disclosed before a paid service begins.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
