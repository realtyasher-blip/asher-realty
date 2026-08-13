import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  ClipboardCheck,
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
  title: "Post Property Free for Rent or Resale in Bengaluru",
  description:
    "Submit a Bengaluru property free for private resale or rent-out review. Nothing is published automatically and optional paid services are disclosed before you choose them.",
};

const reviewSteps = [
  {
    icon: BadgeCheck,
    title: "Owner / authority review",
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
                Free private property intake
              </span>
              <h1 className="mt-6 text-6xl font-medium leading-[.96] sm:text-7xl">
                Post your property.
                <span className="block text-[#e4c462]">Start free and stay in control.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-8 text-white/62 sm:text-base">
                Share the essentials without uploading identity or title documents.
                An Asher owner advisor will verify the property, agree on next
                steps and request media privately before any listing is considered.
              </p>

              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
                <p className="text-sm font-extrabold text-emerald-100">Free to submit · Free initial review · No obligation</p>
                <p className="mt-2 text-[11px] leading-5 text-white/55">
                  No payment is collected on this form. Any optional brokerage, photography, legal review, property management or paid promotion is explained and approved before it begins.
                </p>
              </div>

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
          <div className="container-shell grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 sm:p-8">
              <p className="font-bold text-[#071a2f]">Important before you submit</p>
              <p className="mt-2">
                This is a private request for assistance—not an instant public advertisement or guaranteed valuation. Do not enter an exact flat number or upload Aadhaar, PAN, sale deeds, Khata, tax receipts or other sensitive documents through the public form. Any brokerage, photography, legal-review or marketing charges will be disclosed before a paid service begins.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/how-we-verify" className="inline-flex h-11 items-center rounded-full border border-slate-200 px-5 text-xs font-bold text-[#071a2f] transition hover:border-[#c9a227]">How review works<ArrowRight className="ml-2 size-4" /></Link>
                <Link href="/safety" className="inline-flex h-11 items-center rounded-full border border-slate-200 px-5 text-xs font-bold text-[#071a2f] transition hover:border-[#c9a227]">Property safety</Link>
              </div>
            </div>
            <Link href="/owner-checklist" className="group rounded-[1.75rem] bg-[#071a2f] p-7 text-white transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
              <ClipboardCheck className="size-7 text-[#e4c462]" />
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">Free owner tool</p>
              <h2 className="mt-2 text-3xl font-medium">Prepare before you post.</h2>
              <p className="mt-3 text-xs leading-6 text-white/55">Use the private readiness checklist to collect the right facts and avoid sharing sensitive information.</p>
              <span className="mt-6 inline-flex items-center text-xs font-bold text-[#f0d477]">Open checklist<ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" /></span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
