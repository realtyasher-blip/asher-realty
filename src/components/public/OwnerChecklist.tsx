"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Download,
  Info,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const STORAGE_KEY = "asher-owner-readiness-checklist-v1";

const sections = [
  {
    title: "Your authority and contact",
    description: "Establish who can offer the property before discussing publication.",
    items: [
      "I am the owner, power-of-attorney holder or an authorised representative.",
      "The mobile number I will submit belongs to me and can be confirmed.",
      "Every co-owner or required decision-maker is aware of the proposed sale or rental.",
    ],
  },
  {
    title: "Property facts",
    description: "Prepare facts that can be stated consistently and checked privately.",
    items: [
      "I know the project/building name, locality and correct property type.",
      "I know whether the quoted area is carpet, built-up, super built-up or plot area.",
      "I can confirm configuration, floor, parking, furnishing and approximate property age.",
      "I can describe occupancy and the earliest realistic availability date.",
    ],
  },
  {
    title: "Commercial expectations",
    description: "A clear starting expectation helps the first review stay useful.",
    items: [
      "For resale, I have an expected total price and understand it is not a confirmed valuation.",
      "For rent, I can separate monthly rent, maintenance and security deposit.",
      "I am ready to discuss recent comparable evidence and realistic market positioning.",
      "I will disclose whether a tenant, loan, dues or another condition affects the transaction.",
    ],
  },
  {
    title: "Media and document readiness",
    description: "Keep sensitive records private and share them only through an agreed secure process.",
    items: [
      "I can arrange current, truthful photos or a video after the initial review.",
      "I will not upload Aadhaar, PAN, title deeds, Khata or tax receipts in a public form.",
      "I can privately discuss which ownership, tax, approval or association records are available.",
      "I understand media, documents and availability require a current review before any listing.",
    ],
  },
  {
    title: "Visits and communication",
    description: "Set practical expectations for enquiries, visits and next steps.",
    items: [
      "I can state preferred contact and property-visit times.",
      "I will notify Asher Realty promptly if price, availability or occupancy changes.",
      "I understand nothing is published automatically after I submit the initial form.",
    ],
  },
] as const;

const itemIds = sections.flatMap((section, sectionIndex) =>
  section.items.map((_, itemIndex) => `${sectionIndex}-${itemIndex}`)
);

function readSavedChecks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string =>
          typeof item === "string" && itemIds.includes(item)
        )
      : [];
  } catch {
    return [];
  }
}

export default function OwnerChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setChecked(readSavedChecks());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, ready]);

  const completed = checked.length;
  const total = itemIds.length;
  const percentage = useMemo(
    () => Math.round((completed / total) * 100),
    [completed, total]
  );

  function toggle(id: string) {
    setChecked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function reset() {
    setChecked([]);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <section className="bg-[#eef2f3] pb-24 pt-10 sm:pt-14 print:bg-white print:pb-0 print:pt-0">
      <div className="container-shell">
        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
          <aside className="rounded-[1.8rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_70px_rgba(7,26,47,.14)] sm:p-8 xl:sticky xl:top-28 print:static print:border print:border-slate-200 print:bg-white print:text-[#071a2f] print:shadow-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
              Your private preparation tool
            </p>
            <h2 className="mt-4 text-4xl font-medium">Owner readiness</h2>
            <p className="mt-4 text-sm leading-7 text-white/58 print:text-slate-600">
              Complete what you can. This checklist stays in this browser and is
              not sent to Asher Realty.
            </p>

            <div className="mt-7 rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-5 print:border-slate-200 print:bg-slate-50">
              <div className="flex items-end justify-between gap-4">
                <span className="text-5xl font-semibold text-[#e4c462]">
                  {percentage}%
                </span>
                <span className="pb-1 text-xs font-semibold text-white/48 print:text-slate-500">
                  {completed} of {total} ready
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10 print:bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#c9a227] transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-[#c9a227]/25 bg-[#c9a227]/10 p-5">
              <p className="flex items-center gap-2 text-xs font-bold text-[#f0d477] print:text-[#806008]">
                <ShieldCheck className="size-4" /> Free initial review
              </p>
              <p className="mt-2 text-[11px] leading-6 text-white/58 print:text-slate-600">
                Submitting the essentials and the first owner review are free and
                carry no obligation. If optional photography, marketing, legal or
                other paid support is appropriate, its scope and charges are
                disclosed before that work begins.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#c9a227] px-4 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
              >
                <Download className="mr-2 size-4" /> Print / save PDF
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 px-4 text-xs font-bold text-white transition hover:bg-white/[0.06]"
              >
                <RotateCcw className="mr-2 size-4" /> Reset
              </button>
            </div>
          </aside>

          <div className="space-y-5">
            {sections.map((section, sectionIndex) => {
              const sectionIds = section.items.map(
                (_, itemIndex) => `${sectionIndex}-${itemIndex}`
              );
              const sectionComplete = sectionIds.every((id) => checked.includes(id));

              return (
                <article
                  key={section.title}
                  className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-[0_16px_55px_rgba(7,26,47,.06)] sm:p-8 print:break-inside-avoid print:shadow-none"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                        Part {sectionIndex + 1}
                      </p>
                      <h3 className="mt-2 text-3xl font-semibold text-[#071a2f]">
                        {section.title}
                      </h3>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {section.description}
                      </p>
                    </div>
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                        sectionComplete
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-[#f7f8fa] text-slate-300"
                      }`}
                    >
                      {sectionComplete ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <Circle className="size-5" />
                      )}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {section.items.map((item, itemIndex) => {
                      const id = `${sectionIndex}-${itemIndex}`;
                      const active = checked.includes(id);
                      return (
                        <label
                          key={id}
                          className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition print:border-slate-200 ${
                            active
                              ? "border-[#c9a227]/55 bg-[#fff9e8]"
                              : "border-slate-200 bg-[#f8f9fa] hover:border-[#c9a227]/35 hover:bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggle(id)}
                            className="sr-only"
                          />
                          <span
                            className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border ${
                              active
                                ? "border-[#c9a227] bg-[#c9a227] text-[#071a2f]"
                                : "border-slate-300 bg-white text-transparent"
                            }`}
                          >
                            <Check className="size-4" />
                          </span>
                          <span className="text-xs font-medium leading-6 text-slate-650">
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </article>
              );
            })}

            <div className="rounded-[1.7rem] border border-[#c9a227]/30 bg-[#fff9e8] p-6 sm:p-8 print:break-inside-avoid">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
                  <Info className="size-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold text-[#071a2f]">
                    Ready to begin?
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-600">
                    You do not need every item completed to request the free
                    initial review. Start with the property essentials, and an
                    owner advisor can identify the next useful checks.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 print:hidden">
                    <Link
                      href="/post-property"
                      className="inline-flex h-11 items-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white"
                    >
                      Post property free
                      <ArrowRight className="ml-2 size-4 text-[#e4c462]" />
                    </Link>
                    <Link
                      href="/how-we-verify"
                      className="inline-flex h-11 items-center rounded-full border border-[#071a2f]/15 bg-white px-5 text-xs font-bold text-[#071a2f]"
                    >
                      See how reviews work
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
