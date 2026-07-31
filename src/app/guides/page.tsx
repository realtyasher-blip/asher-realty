import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Newspaper,
  ShieldCheck,
} from "lucide-react";

import GuidesLibrary from "@/components/guides/GuidesLibrary";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { guides } from "@/data/guides";
import { getMarketNews } from "@/lib/marketNews";

export const metadata: Metadata = {
  title: "Bengaluru Homebuyer Guides & Real Estate Knowledge",
  description:
    "Practical Bengaluru property guides about RERA, Khata, home loans, apartment costs, floor plans, locations and better site visits.",
};

export const revalidate = 86400;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function GuidesPage() {
  const news = await getMarketNews();

  return (
    <>
      <Navbar />
      <main className="bg-white pt-20">
        <section className="relative overflow-hidden bg-[#071a2f] py-20 text-white sm:py-28">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_82%_15%,#c9a227_0,transparent_26%),linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:auto,68px_68px,68px_68px]" />
          <div className="container-shell relative grid gap-12 xl:grid-cols-[1fr_.8fr] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                <BookOpen className="size-4" />
                Bengaluru Buyer Library
              </span>
              <h1 className="mt-7 max-w-4xl text-6xl font-medium leading-[.98] sm:text-7xl">
                Property knowledge
                <span className="mt-2 block text-[#e4c462]">worth returning for.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">
                Useful, readable guidance for the decisions between “I like this home” and “I understand what I am buying.”
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/55">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{guides.length} in-depth guides</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Official sources linked</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Updated for Bengaluru buyers</span>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Newspaper className="size-5 text-[#e4c462]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e4c462]">Today’s reading desk</p>
                    <p className="mt-1 text-[10px] text-white/35">Refreshed {formatDate(news.updatedAt)}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-bold text-emerald-300">Daily</span>
              </div>
              <div className="mt-6 divide-y divide-white/10">
                {news.items.slice(0, 4).map((item) => (
                  <a
                    key={`${item.url}-${item.title}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block py-4 first:pt-0"
                  >
                    <p className="line-clamp-2 text-xs font-semibold leading-5 text-white/72 transition group-hover:text-[#e4c462]">{item.title}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/30">{item.source} · {item.category}</p>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="container-shell grid gap-0 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Practical",
                text: "Designed to improve a real buying decision",
              },
              {
                icon: BookOpen,
                title: "Readable",
                text: "Clear explanations without industry fog",
              },
              {
                icon: Clock3,
                title: "Current",
                text: "Sources and update dates shown openly",
              },
            ].map(({ icon: GuideIcon, title, text }) => {
              return (
                <div key={title} className="flex gap-4 border-b border-slate-200 py-6 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0">
                  <GuideIcon className="size-5 shrink-0 text-[#b08a16]" />
                  <div>
                    <p className="text-sm font-bold text-[#071a2f]">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <GuidesLibrary />

        <section className="bg-white py-20">
          <div className="container-shell flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#071a2f] p-7 text-white sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e4c462]">Have a question we should explain?</p>
              <h2 className="mt-3 text-4xl font-medium">Turn your property doubt into the next buyer guide.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">Ask Asher about a document, cost, location or project claim. You will get a useful answer—and it may help another buyer too.</p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-[#c9a227] px-6 text-xs font-bold text-[#071a2f]"
            >
              Ask a buyer question
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
