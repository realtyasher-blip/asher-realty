import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Clock3 } from "lucide-react";

import { guides } from "@/data/guides";

export default function KnowledgeHub() {
  const featured = guides.filter((guide) => guide.featured).slice(0, 3);

  return (
    <section className="content-auto-section overflow-hidden bg-[#f5f6f8] py-24 sm:py-28">
      <div className="container-shell">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8b6a0f] shadow-sm">
              <BookOpen className="size-4" />
              Bengaluru Buyer Library
            </span>
            <h2 className="mt-6 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              Read for ten minutes.
              <span className="block text-[#b08a16]">Ask sharper questions for years.</span>
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              Interesting, practical guides about documents, money, locations and the small details that make a home work.
            </p>
          </div>
          <Link
            href="/guides"
            className="inline-flex h-12 w-fit items-center rounded-full bg-[#071a2f] px-6 text-xs font-bold text-white transition hover:bg-[#c9a227] hover:text-[#071a2f]"
          >
            Explore all buyer guides
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
          {featured[0] && (
            <article className="group overflow-hidden rounded-[2rem] bg-[#071a2f] text-white shadow-[0_24px_80px_rgba(7,26,47,.15)]">
              <div className="relative aspect-[16/8] overflow-hidden">
                <Image
                  src={featured[0].cover}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f] via-[#071a2f]/25 to-transparent" />
              </div>
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4c462]">
                  {featured[0].category}
                  <span>·</span>
                  {featured[0].readTime}
                </div>
                <h3 className="mt-4 max-w-2xl text-4xl font-medium leading-tight">{featured[0].title}</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">{featured[0].dek}</p>
                <Link
                  href={`/guides/${featured[0].slug}`}
                  className="mt-6 inline-flex items-center text-xs font-bold text-white transition hover:text-[#e4c462]"
                >
                  Read the featured guide
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </div>
            </article>
          )}

          <div className="grid gap-5">
            {featured.slice(1).map((guide) => (
              <article key={guide.slug} className="group grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white sm:grid-cols-[180px_1fr]">
                <div className="relative min-h-44 overflow-hidden">
                  <Image
                    src={guide.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="180px"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#b08a16]">
                    <Clock3 className="size-3.5" />
                    {guide.readTime}
                  </div>
                  <h3 className="mt-3 text-2xl font-medium leading-tight text-[#071a2f]">{guide.title}</h3>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="mt-5 inline-flex items-center text-xs font-bold text-[#071a2f] hover:text-[#b08a16]"
                  >
                    Continue reading
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
