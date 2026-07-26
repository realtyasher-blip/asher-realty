import type { Metadata } from "next";
import { BadgeCheck, CalendarCheck, MapPinned, Route } from "lucide-react";

import SiteVisitForm from "@/components/forms/SiteVisitForm";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Book a Bengaluru Property Site Visit",
  description:
    "Request a guided Bengaluru property site visit with Asher Realty. Select a project, date and preferred time.",
};

export default function BookSiteVisitPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f5f6f8] pt-20">
        <section className="bg-[#071a2f] py-16 text-white sm:py-20">
          <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.22em] text-[#e4c462]">
                Guided project visits
              </p>
              <h1 className="mt-5 text-6xl font-medium leading-[1.02] sm:text-7xl">
                Tour the right homes, not every home.
              </h1>
              <p className="mt-6 max-w-xl leading-8 text-white/62">
                Choose your project and preferred slot. We verify availability,
                organise the route and help you compare without sales pressure.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: BadgeCheck, text: "Inventory checked before confirmation" },
                  { icon: Route, text: "Efficient multi-project route planning" },
                  { icon: MapPinned, text: "Clear meeting-point coordination" },
                  { icon: CalendarCheck, text: "Advisor-supported walkthrough" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/65">
                    <Icon className="size-4 shrink-0 text-[#e4c462]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <SiteVisitForm />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

