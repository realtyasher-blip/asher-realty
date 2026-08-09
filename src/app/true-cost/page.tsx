import type { Metadata } from "next";
import {
  BadgeCheck,
  Calculator,
  CircleAlert,
  GitCompareArrows,
  ShieldCheck,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TrueCostRoom from "@/components/tools/TrueCostRoom";

export const metadata: Metadata = {
  title: "TrueCost Room | Decode a Bengaluru Property Quote",
  description:
    "Turn a builder cost sheet into a transparent all-in property commitment with payment, area-rate, rent-overlap and verification questions.",
};

type TrueCostPageProps = {
  searchParams: Promise<{ project?: string }>;
};

const lenses = [
  {
    icon: Calculator,
    title: "Complete-cost lens",
    text: "Combine agreement value, premiums, parking, amenities, maintenance, taxes and registration.",
  },
  {
    icon: GitCompareArrows,
    title: "Apples-to-apples lens",
    text: "Compare effective carpet-area cost and unanswered quote questions—not brochure prices alone.",
  },
  {
    icon: ShieldCheck,
    title: "Buyer-control lens",
    text: "See the result before sharing any contact details. Save or delete quotes on your own device.",
  },
];

export default async function TrueCostPage({ searchParams }: TrueCostPageProps) {
  const { project } = await searchParams;

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#041421] pb-20 pt-36 text-white sm:pb-24 sm:pt-44">
          <div className="premium-grid absolute inset-0 opacity-25" />
          <div className="absolute -right-32 top-10 size-[30rem] rounded-full bg-[#c9a227]/12 blur-3xl" />
          <div className="container-shell relative">
            <div className="grid gap-12 xl:grid-cols-[1.05fr_.95fr] xl:items-end">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e4c462]">
                  <BadgeCheck className="size-4" /> Asher TrueCost Room
                </p>
                <h1 className="mt-6 max-w-5xl text-6xl font-medium leading-[0.92] tracking-[-0.04em] sm:text-8xl">
                  The brochure price is one number.
                  <span className="mt-3 block text-[#e4c462]">
                    Your decision needs the complete picture.
                  </span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                  Enter figures from an actual cost sheet. TrueCost separates the
                  likely all-in commitment, financing assumptions, area economics
                  and items that still need written confirmation.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl sm:p-8">
                <p className="flex items-start gap-2 text-xs leading-6 text-white/62">
                  <CircleAlert className="mt-1 size-4 shrink-0 text-[#e4c462]" />
                  No login, phone number or document upload is required. Quotes
                  stay on this device unless you choose to send a summary to an
                  Asher advisor.
                </p>
                <div className="mt-6 grid gap-3">
                  {lenses.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-3 rounded-2xl bg-white/[0.05] p-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/14 text-[#e4c462]">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <strong className="block text-xs text-white">{title}</strong>
                        <span className="mt-1 block text-[10px] leading-5 text-white/42">{text}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrueCostRoom initialProjectSlug={project} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
