import type { Metadata } from "next";
import { ClipboardCheck, LockKeyhole, Printer } from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import OwnerChecklist from "@/components/public/OwnerChecklist";

export const metadata: Metadata = {
  title: "Free Property Owner Readiness Checklist | Bengaluru",
  description:
    "Prepare a Bengaluru property for resale or rent-out review with a private, printable owner checklist covering authority, property facts, pricing, media and visits.",
};

export default function OwnerChecklistPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 print:pt-0">
        <section className="relative overflow-hidden bg-[#041421] py-16 text-white sm:py-20 print:bg-white print:pb-8 print:text-[#071a2f]">
          <div className="premium-grid absolute inset-0 opacity-25 print:hidden" />
          <div className="absolute -right-32 top-0 size-[30rem] rounded-full bg-[#c9a227]/10 blur-3xl print:hidden" />
          <div className="container-shell relative grid gap-10 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4c462] print:text-[#8a670b]">
                <ClipboardCheck className="size-4" /> Free owner tool
              </p>
              <h1 className="mt-5 max-w-4xl text-6xl font-medium leading-[.96] sm:text-7xl">
                Prepare your property before the first conversation.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-white/62 sm:text-base print:text-slate-600">
                A practical Bengaluru owner checklist for resale and rent-out
                readiness. Tick items as you prepare, print the result and begin
                a free initial review whenever you are ready.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50">
                <LockKeyhole className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                <p className="text-xs leading-6 text-white/58 print:text-slate-600">
                  Your checks stay in this browser. No checklist answers are sent
                  to Asher Realty.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50">
                <Printer className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                <p className="text-xs leading-6 text-white/58 print:text-slate-600">
                  Print the checklist or save a PDF for your own records. No
                  account is required.
                </p>
              </div>
            </div>
          </div>
        </section>
        <OwnerChecklist />
      </main>
      <div className="print:hidden">
        <Footer />
        <FloatingWhatsApp />
      </div>
    </>
  );
}
