import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  FileCheck2,
  Images,
  MessageCircle,
  PhoneCall,
  Scale,
  ShieldAlert,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "How Property Information Is Reviewed | Asher Realty",
  description:
    "Understand Asher Realty's separate checks for contact, authority, property facts, availability, media, documents and specialist legal verification.",
};

const reviewLayers = [
  {
    icon: PhoneCall,
    label: "01 · Contact",
    title: "Contact confirmed",
    what: "We confirm that the submitted phone number can be reached and that the person responds about the specific property.",
    not: "This alone does not confirm identity, ownership, authority, availability or property facts.",
  },
  {
    icon: BadgeCheck,
    label: "02 · Authority",
    title: "Owner or authority reviewed",
    what: "We ask whether the submitter is the owner, a power-of-attorney holder or another authorised representative, then agree on an appropriate private evidence check.",
    not: "A declaration or contact confirmation is not the same as a legal title opinion or an ownership guarantee.",
  },
  {
    icon: FileCheck2,
    label: "03 · Property facts",
    title: "Key facts reconciled",
    what: "Project/building, locality, property type, configuration, area basis, floor, age, occupancy and commercial expectations are compared with available records or supporting information.",
    not: "If a fact cannot be reconciled, it should remain marked for confirmation rather than presented as settled.",
  },
  {
    icon: Images,
    label: "04 · Availability, media and documents",
    title: "Current readiness reviewed",
    what: "We date-check availability, review whether media appears current and relevant, and record which transaction documents are available for a later private review.",
    not: "Photos do not prove title, and a document checklist does not mean that every document has been legally examined.",
  },
  {
    icon: Scale,
    label: "05 · Legal verification",
    title: "Independent specialist step",
    what: "When a legal opinion is needed, Asher Realty can coordinate with an appropriate legal professional under a separately agreed scope.",
    not: "Asher Realty does not issue title certificates or substitute its marketplace review for an advocate's legal opinion.",
  },
] as const;

const publicLabels = [
  {
    label: "Submitted",
    meaning: "Information has been received but has not completed review.",
  },
  {
    label: "Contact confirmed",
    meaning: "The supplied contact has responded about this property.",
  },
  {
    label: "Owner/authority reviewed",
    meaning: "The submitter's claimed role has received an agreed evidence review; this is not a title opinion.",
  },
  {
    label: "Facts reviewed",
    meaning: "Listed factual fields were compared with the information available on the stated review date.",
  },
  {
    label: "Availability refreshed",
    meaning: "Availability was reconfirmed on the displayed date and can still change afterward.",
  },
] as const;

export default function HowWeVerifyPage() {
  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    "Hi Asher Realty, I have a question about how a property or owner-submitted detail is reviewed."
  )}`;

  return (
    <>
      <Navbar />
      <main className="bg-[#eef2f3] pt-20">
        <section className="relative overflow-hidden bg-[#041421] py-16 text-white sm:py-24">
          <div className="premium-grid absolute inset-0 opacity-25" />
          <div className="absolute -right-40 top-0 size-[34rem] rounded-full bg-[#c9a227]/10 blur-3xl" />
          <div className="container-shell relative grid gap-10 lg:grid-cols-[1fr_.68fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4c462]">
                <BadgeCheck className="size-4" /> Evidence, not a blanket badge
              </p>
              <h1 className="mt-5 max-w-4xl text-6xl font-medium leading-[.96] sm:text-7xl">
                Different property claims need different checks.
              </h1>
            </div>
            <div>
              <p className="text-sm leading-8 text-white/62 sm:text-base">
                “Verified” can hide important differences. We separate contact,
                authority, facts, availability, media, documents and legal review
                so you can see what was checked—and what was not.
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                <p className="text-xs leading-6 text-white/58">
                  No review removes the need to verify price, availability,
                  identity, authority and transaction documents for the exact
                  property before paying or signing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="container-shell">
            <div className="space-y-4">
              {reviewLayers.map(({ icon: Icon, label, title, what, not }) => (
                <article
                  key={title}
                  className="grid overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_16px_55px_rgba(7,26,47,.05)] lg:grid-cols-[.5fr_1.5fr]"
                >
                  <div className="bg-[#071a2f] p-6 text-white sm:p-8">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c9a227] text-[#071a2f]">
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.17em] text-[#e4c462]">
                      {label}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
                  </div>
                  <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
                    <div className="bg-white p-6 sm:p-8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                        What this review can mean
                      </p>
                      <p className="mt-3 text-xs leading-7 text-slate-600">{what}</p>
                    </div>
                    <div className="bg-[#faf9f5] p-6 sm:p-8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                        What it does not mean
                      </p>
                      <p className="mt-3 text-xs leading-7 text-slate-600">{not}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="container-shell">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7410]">
                  <CalendarClock className="size-4" /> Read the label and date
                </p>
                <h2 className="mt-4 text-5xl font-medium leading-[1] text-[#071a2f]">
                  What public review labels should mean.
                </h2>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  A useful label names the check and shows when it happened. It
                  should never imply that every aspect of a property has been
                  independently guaranteed.
                </p>
              </div>
              <div className="overflow-hidden rounded-[1.6rem] border border-slate-200">
                {publicLabels.map((item, index) => (
                  <div
                    key={item.label}
                    className={`grid gap-2 bg-[#f8f9fa] p-5 sm:grid-cols-[.45fr_1.55fr] sm:p-6 ${
                      index ? "border-t border-slate-200" : ""
                    }`}
                  >
                    <p className="text-sm font-bold text-[#071a2f]">{item.label}</p>
                    <p className="text-xs leading-6 text-slate-500">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.7rem] bg-[#071a2f] p-7 text-white sm:p-9 lg:flex-row lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#e4c462]">
                  See an unclear or incorrect claim?
                </p>
                <h2 className="mt-3 text-3xl font-medium">
                  Ask what was reviewed or report the detail.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-xs font-bold text-[#071a2f]"
                >
                  <MessageCircle className="mr-2 size-4" /> Ask on WhatsApp
                </a>
                <Link
                  href="/safety"
                  className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-xs font-bold text-white"
                >
                  Safety guidance <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
