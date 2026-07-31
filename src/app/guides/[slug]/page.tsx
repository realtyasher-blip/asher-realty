import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getGuide, guides } from "@/data/guides";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.dek,
    openGraph: {
      title: guide.title,
      description: guide.dek,
      type: "article",
      images: [{ url: guide.cover }],
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guides
    .filter((item) => item.slug !== guide.slug)
    .sort((a, b) => Number(b.category === guide.category) - Number(a.category === guide.category))
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.dek,
    image: `https://asherrealty.in${guide.cover}`,
    dateModified: "2026-07-31",
    datePublished: "2026-07-31",
    author: { "@type": "Organization", name: "Asher Realty" },
    publisher: { "@type": "Organization", name: "Asher Realty" },
    mainEntityOfPage: `https://asherrealty.in/guides/${guide.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />
      <main className="bg-white pt-20">
        <article>
          <header className="relative overflow-hidden bg-[#071a2f] text-white">
            <div className="relative min-h-[580px]">
              <Image
                src={guide.cover}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071a2f] via-[#071a2f]/92 to-[#071a2f]/38" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/70 via-transparent to-transparent" />
              <div className="container-shell relative flex min-h-[580px] items-center py-16">
                <div className="max-w-4xl">
                  <Link href="/guides" className="inline-flex items-center text-xs font-bold text-white/55 transition hover:text-[#e4c462]">
                    <ArrowLeft className="mr-2 size-4" />
                    Buyer Library
                  </Link>
                  <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.13em] text-[#e4c462]">
                    <span className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-2">{guide.category}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{guide.readTime}</span>
                    <span>Updated {guide.updatedAt}</span>
                  </div>
                  <h1 className="mt-6 text-5xl font-medium leading-[1.02] sm:text-7xl">{guide.title}</h1>
                  <p className="mt-7 max-w-3xl text-lg leading-8 text-white/65">{guide.dek}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="container-shell grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start sm:py-20">
            <div className="min-w-0">
              <section className="rounded-[1.75rem] border border-[#c9a227]/25 bg-[#fffaf0] p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8b6a0f]">
                  <BookOpen className="size-4" />
                  What you will know
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {guide.keyTakeaways.map((takeaway) => (
                    <div key={takeaway} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                      <p className="text-xs font-semibold leading-6 text-[#071a2f]">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="mt-12 space-y-14">
                {guide.sections.map((section, index) => (
                  <section key={section.heading} id={`section-${index + 1}`}>
                    <div className="flex items-start gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#071a2f] text-xs font-bold text-[#e4c462]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-3xl font-medium leading-tight text-[#071a2f] sm:text-4xl">{section.heading}</h2>
                    </div>
                    <div className="mt-6 space-y-5 text-[15px] leading-8 text-slate-600 sm:pl-13 sm:text-base">
                      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      {section.bullets && (
                        <ul className="space-y-3 rounded-[1.5rem] bg-[#f7f8fa] p-6">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-3">
                              <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#b08a16]" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.callout && (
                        <blockquote className="border-l-4 border-[#c9a227] bg-[#fffaf0] px-6 py-5 font-semibold text-[#071a2f]">
                          {section.callout}
                        </blockquote>
                      )}
                    </div>
                  </section>
                ))}
              </div>

              <section className="mt-14 rounded-[1.75rem] border border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-[#b08a16]" />
                  <h2 className="text-2xl font-medium text-[#071a2f]">Sources and further verification</h2>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  These links lead to public authorities or named research organisations. Processes and requirements can change; verify the latest official position for your transaction.
                </p>
                <div className="mt-5 space-y-3">
                  {guide.sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-xl bg-[#f7f8fa] px-4 py-3 text-xs font-semibold text-[#071a2f] transition hover:bg-[#fff3c4]"
                    >
                      {source.label}
                      <ExternalLink className="size-4 shrink-0 text-[#b08a16]" />
                    </a>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-[1.75rem] bg-[#071a2f] p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e4c462]">Apply this to your shortlist</p>
                <h2 className="mt-4 text-3xl font-medium">Ask an Asher buyer advisor.</h2>
                <p className="mt-3 text-xs leading-6 text-white/48">
                  Turn the guide into project-specific questions, a comparison and a better site visit.
                </p>
                <div className="mt-6 grid gap-3">
                  <a href="tel:+919019697170" className="inline-flex h-11 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f]">
                    <Phone className="mr-2 size-4" />
                    Call 9019697170
                  </a>
                  <a
                    href={`https://wa.me/919019697170?text=${encodeURIComponent(`Hi Asher Realty, I read your guide "${guide.title}". Please help me apply it to my property shortlist.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-xs font-bold text-white"
                  >
                    <MessageCircle className="mr-2 size-4" />
                    Discuss this guide
                  </a>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fa] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Editorial standard</p>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  Educational content only—not legal, tax, investment or lending advice. Independent professional review remains essential.
                </p>
              </div>
            </aside>
          </div>
        </article>

        <section className="bg-[#f5f6f8] py-20">
          <div className="container-shell">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b08a16]">Continue learning</p>
                <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">Related buyer guides</h2>
              </div>
              <Link href="/guides" className="hidden items-center text-xs font-bold text-[#071a2f] sm:inline-flex">
                View all
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/guides/${item.slug}`} className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#b08a16]">{item.category} · {item.readTime}</p>
                  <h3 className="mt-4 text-2xl font-medium leading-tight text-[#071a2f]">{item.title}</h3>
                  <span className="mt-5 inline-flex items-center text-xs font-bold text-[#071a2f]">
                    Read next
                    <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
