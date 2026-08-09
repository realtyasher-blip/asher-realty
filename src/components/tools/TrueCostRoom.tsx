"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Check,
  CircleAlert,
  GitCompareArrows,
  IndianRupee,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import { projectPriceCrores } from "@/lib/decisionEngine";
import {
  calculateTrueCost,
  emptyTrueCostInputs,
  formatLakhs,
  formatRupees,
  type TrueCostInputs,
} from "@/lib/trueCost";

const STORAGE_KEY = "asher-true-cost-quotes-v1";

type SavedQuote = {
  id: string;
  savedAt: string;
  projectName: string;
  inputs: TrueCostInputs;
};

type NumericField = Exclude<
  keyof TrueCostInputs,
  "projectSlug" | "otherProjectName" | "referenceType"
>;

const chargeFields: Array<{
  field: NumericField;
  label: string;
  hint: string;
  step?: string;
}> = [
  {
    field: "floorViewPremiumLakhs",
    label: "Floor / view premium",
    hint: "₹ lakh",
  },
  { field: "parkingLakhs", label: "Parking", hint: "₹ lakh" },
  {
    field: "amenitiesLakhs",
    label: "Clubhouse / amenities",
    hint: "₹ lakh",
  },
  {
    field: "maintenanceCorpusLakhs",
    label: "Maintenance / corpus",
    hint: "₹ lakh",
  },
  { field: "taxesLakhs", label: "Taxes shown", hint: "₹ lakh" },
  {
    field: "registrationLakhs",
    label: "Stamp duty / registration",
    hint: "₹ lakh",
  },
  { field: "otherLakhs", label: "Other charges", hint: "₹ lakh" },
];

function initialInputs(initialProjectSlug?: string): TrueCostInputs {
  if (!initialProjectSlug) return { ...emptyTrueCostInputs };
  const project = projects.find(
    (item) => projectSlug(item.name) === initialProjectSlug
  );
  if (!project) return { ...emptyTrueCostInputs };
  const visiblePrice = projectPriceCrores(project.price);
  return {
    ...emptyTrueCostInputs,
    projectSlug: initialProjectSlug,
    baseValueLakhs: visiblePrice ? visiblePrice * 100 : 0,
    referenceType: visiblePrice
      ? "Platform starting-price reference"
      : "Builder quote",
  };
}

function readSavedQuotes(): SavedQuote[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed
          .filter(
            (item): item is SavedQuote =>
              Boolean(item?.id && item?.inputs && item?.projectName)
          )
          .slice(0, 4)
      : [];
  } catch {
    return [];
  }
}

function InputField({
  label,
  value,
  onChange,
  hint,
  step = "0.1",
  min = 0,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint: string;
  step?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-[#071a2f]">{label}</span>
      <span className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-[#c9a227] focus-within:ring-2 focus-within:ring-[#c9a227]/10">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value || ""}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#071a2f] outline-none placeholder:text-slate-300"
          placeholder="0"
        />
        <span className="ml-2 shrink-0 text-[10px] font-semibold text-slate-400">
          {hint}
        </span>
      </span>
    </label>
  );
}

export default function TrueCostRoom({
  initialProjectSlug,
}: {
  initialProjectSlug?: string;
}) {
  const [inputs, setInputs] = useState<TrueCostInputs>(() =>
    initialInputs(initialProjectSlug)
  );
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setSavedQuotes(readSavedQuotes()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedProject = projects.find(
    (project) => projectSlug(project.name) === inputs.projectSlug
  );
  const projectName =
    selectedProject?.name || inputs.otherProjectName.trim() || "Untitled quote";
  const result = useMemo(() => calculateTrueCost(inputs), [inputs]);
  const propertyShare = result.allInLakhs
    ? Math.min(100, (result.propertySubtotalLakhs / result.allInLakhs) * 100)
    : 0;

  function setNumber(field: NumericField, value: number) {
    setInputs((current) => ({ ...current, [field]: value }));
    setNotice("");
  }

  function selectProject(slug: string) {
    const project = projects.find((item) => projectSlug(item.name) === slug);
    const visiblePrice = project ? projectPriceCrores(project.price) : null;
    setInputs((current) => ({
      ...emptyTrueCostInputs,
      projectSlug: slug,
      otherProjectName: slug === "other" ? current.otherProjectName : "",
      baseValueLakhs: visiblePrice ? visiblePrice * 100 : 0,
      referenceType: visiblePrice
        ? "Platform starting-price reference"
        : "Builder quote",
      downPaymentPercent: current.downPaymentPercent,
      loanRatePercent: current.loanRatePercent,
      loanTenureYears: current.loanTenureYears,
      monthlyRentRupees: current.monthlyRentRupees,
      monthsToPossession: current.monthsToPossession,
    }));
    setNotice("");
  }

  function saveQuote() {
    if (!result.allInLakhs) {
      setNotice("Enter the agreement value before saving this quote.");
      return;
    }
    const next: SavedQuote[] = [
      {
        id: `${Date.now()}`,
        savedAt: new Date().toISOString(),
        projectName,
        inputs,
      },
      ...savedQuotes,
    ].slice(0, 4);
    setSavedQuotes(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setNotice("Saved privately on this device. Add another quote to compare.");
  }

  function removeQuote(id: string) {
    const next = savedQuotes.filter((quote) => quote.id !== id);
    setSavedQuotes(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function loadQuote(quote: SavedQuote) {
    setInputs(quote.inputs);
    setNotice(`Loaded ${quote.projectName}.`);
    document.getElementById("truecost-room")?.scrollIntoView({ behavior: "smooth" });
  }

  function printReport() {
    document.body.classList.add("truecost-printing");
    const cleanup = () => document.body.classList.remove("truecost-printing");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1200);
  }

  const advisorMessage = encodeURIComponent(
    `Hi Asher Realty, please review my TrueCost calculation for ${projectName}. Reference: ${inputs.referenceType}. Likely all-in amount: ${formatLakhs(result.allInLakhs)}. Illustrative own-funds requirement: ${formatLakhs(result.equityAndExtrasLakhs)}. Effective carpet-area rate: ${result.carpetRateRupees ? formatRupees(result.carpetRateRupees) : "not entered"} per sq ft. Questions to verify: ${result.questions.slice(0, 4).join(" | ") || "Please check the written cost sheet and current unit details."}`
  );

  return (
    <section id="truecost-room" className="bg-[#eeece6] py-16 sm:py-24">
      <div className="container-shell">
        <div className="grid gap-7 xl:grid-cols-[.88fr_1.12fr] xl:items-start">
          <div className="truecost-print-hide rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_22px_70px_rgba(7,26,47,.08)] sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7411]">
                  Enter what the quote shows
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#071a2f]">
                  Your quote inputs
                </h2>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
                <Calculator className="size-5" />
              </span>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-[11px] font-bold text-[#071a2f]">
                  Project
                </span>
                <select
                  value={inputs.projectSlug}
                  onChange={(event) => selectProject(event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#071a2f] outline-none focus:border-[#c9a227]"
                >
                  <option value="">Choose a project</option>
                  {projects.map((project) => (
                    <option key={project.name} value={projectSlug(project.name)}>
                      {project.name} · {project.location}
                    </option>
                  ))}
                  <option value="other">Other project</option>
                </select>
              </label>

              {inputs.projectSlug === "other" && (
                <label className="sm:col-span-2">
                  <span className="text-[11px] font-bold text-[#071a2f]">
                    Project / unit label
                  </span>
                  <input
                    value={inputs.otherProjectName}
                    onChange={(event) =>
                      setInputs((current) => ({
                        ...current,
                        otherProjectName: event.target.value,
                      }))
                    }
                    placeholder="e.g. Builder, project, tower and unit"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#071a2f] outline-none focus:border-[#c9a227]"
                  />
                </label>
              )}

              <div className="sm:col-span-2 rounded-2xl border border-[#dcc76e]/40 bg-[#fff9e7] p-4">
                <p className="flex items-start gap-2 text-[11px] leading-5 text-[#6f5817]">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {inputs.referenceType === "Platform starting-price reference"
                    ? "The agreement value below starts from the platform’s visible starting price. Replace it with the exact written unit quote."
                    : "Enter figures from the developer’s written cost sheet. Zero means the item still needs confirmation, not that it is free."}
                </p>
              </div>

              <InputField
                label="Agreement / base value"
                value={inputs.baseValueLakhs}
                hint="₹ lakh"
                onChange={(value) => {
                  setNumber("baseValueLakhs", value);
                  setInputs((current) => ({
                    ...current,
                    baseValueLakhs: value,
                    referenceType: "Builder quote",
                  }));
                }}
              />
              <InputField
                label="RERA carpet area"
                value={inputs.carpetAreaSqft}
                hint="sq ft"
                step="1"
                onChange={(value) => setNumber("carpetAreaSqft", value)}
              />
              <InputField
                label="Saleable / super area"
                value={inputs.saleableAreaSqft}
                hint="sq ft"
                step="1"
                onChange={(value) => setNumber("saleableAreaSqft", value)}
              />
            </div>

            <details className="mt-7 rounded-2xl border border-slate-200 bg-[#f8f8f6] open:bg-white">
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-bold text-[#071a2f]">
                Add every quoted charge
                <span className="ml-2 text-[10px] font-semibold text-slate-400">
                  improves accuracy
                </span>
              </summary>
              <div className="grid gap-4 border-t border-slate-200 p-5 sm:grid-cols-2">
                {chargeFields.map(({ field, label, hint, step }) => (
                  <InputField
                    key={field}
                    label={label}
                    value={inputs[field]}
                    hint={hint}
                    step={step}
                    onChange={(value) => setNumber(field, value)}
                  />
                ))}
              </div>
            </details>

            <details className="mt-4 rounded-2xl border border-slate-200 bg-[#f8f8f6] open:bg-white">
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-bold text-[#071a2f]">
                Add your finance and rent context
              </summary>
              <div className="grid gap-4 border-t border-slate-200 p-5 sm:grid-cols-2">
                <InputField
                  label="Down payment"
                  value={inputs.downPaymentPercent}
                  hint="%"
                  step="1"
                  max={100}
                  onChange={(value) => setNumber("downPaymentPercent", value)}
                />
                <InputField
                  label="Illustrative loan rate"
                  value={inputs.loanRatePercent}
                  hint="% p.a."
                  max={30}
                  onChange={(value) => setNumber("loanRatePercent", value)}
                />
                <InputField
                  label="Loan tenure"
                  value={inputs.loanTenureYears}
                  hint="years"
                  step="1"
                  min={1}
                  max={40}
                  onChange={(value) => setNumber("loanTenureYears", value)}
                />
                <InputField
                  label="Current monthly rent"
                  value={inputs.monthlyRentRupees}
                  hint="₹ / month"
                  step="1000"
                  onChange={(value) => setNumber("monthlyRentRupees", value)}
                />
                <InputField
                  label="Months until possession"
                  value={inputs.monthsToPossession}
                  hint="months"
                  step="1"
                  max={120}
                  onChange={(value) => setNumber("monthsToPossession", value)}
                />
              </div>
            </details>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveQuote}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white transition hover:bg-[#0d2948]"
              >
                <Check className="mr-2 size-4 text-[#e4c462]" />
                Save this quote privately
              </button>
              <button
                type="button"
                onClick={() => setInputs(initialInputs(initialProjectSlug))}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-5 text-xs font-bold text-slate-500 transition hover:border-slate-400 hover:text-[#071a2f]"
              >
                Start again
              </button>
            </div>
            {notice && (
              <p role="status" className="mt-4 text-xs font-semibold text-emerald-700">
                {notice}
              </p>
            )}
          </div>

          <article className="truecost-print-report overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(7,26,47,.11)] xl:sticky xl:top-28">
            <div className="relative overflow-hidden bg-[#071a2f] p-6 text-white sm:p-9">
              <div className="premium-grid absolute inset-0 opacity-25" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4c462]">
                    Asher TrueCost report
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[9px] font-bold text-white/55">
                    {result.fieldsEntered}/9 quote fields entered
                  </span>
                </div>
                <h2 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">
                  {projectName}
                </h2>
                <p className="mt-3 text-xs leading-6 text-white/48">
                  {inputs.referenceType} · edit any figure to update this report
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#e4c462]/25 bg-[#c9a227]/10 p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#e4c462]">
                      Likely all-in amount
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-white">
                      {formatLakhs(result.allInLakhs)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/38">
                      Illustrative monthly EMI
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {formatRupees(result.emiRupees)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Property + unit charges", formatLakhs(result.propertySubtotalLakhs)],
                  ["Taxes + ownership extras", formatLakhs(result.ownershipExtrasLakhs)],
                  ["Illustrative own-funds need", formatLakhs(result.equityAndExtrasLakhs)],
                  ["Rent until possession", formatLakhs(result.rentOverlapLakhs)],
                  [
                    "Effective carpet-area rate",
                    result.carpetRateRupees
                      ? `${formatRupees(result.carpetRateRupees)} / sq ft`
                      : "Add carpet area",
                  ],
                  [
                    "Effective saleable-area rate",
                    result.saleableRateRupees
                      ? `${formatRupees(result.saleableRateRupees)} / sq ft`
                      : "Add saleable area",
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-[#f8f8f6] p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-bold text-[#071a2f]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-bold text-[#071a2f]">Where the all-in number comes from</p>
                  <p className="text-[10px] font-semibold text-slate-400">
                    {Math.round(propertyShare)}% unit value
                  </p>
                </div>
                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
                  <span className="bg-[#071a2f]" style={{ width: `${propertyShare}%` }} />
                  <span className="flex-1 bg-[#c9a227]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-semibold text-slate-500">
                  <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#071a2f]" /> Agreement + premiums</span>
                  <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#c9a227]" /> Taxes + extras</span>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a7411]">
                      Questions before booking
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#071a2f]">
                      What still needs confirmation
                    </h3>
                  </div>
                  <ShieldCheck className="size-6 text-[#b08a16]" />
                </div>
                <div className="mt-5 grid gap-2.5">
                  {(result.questions.length
                    ? result.questions
                    : ["Ask the developer to confirm the final unit, tower, payment schedule and all-inclusive amount in writing."]
                  ).map((question) => (
                    <div key={question} className="flex items-start gap-3 rounded-xl bg-[#fff9e7] p-3.5">
                      <CircleAlert className="mt-0.5 size-4 shrink-0 text-[#9a7411]" />
                      <p className="text-xs leading-6 text-[#4f431e]">{question}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="truecost-print-hide mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href={`https://wa.me/919019697170?text=${advisorMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-label="TrueCost advisor review"
                  className="shine-button inline-flex min-h-13 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Ask Asher to verify this
                </a>
                <button
                  type="button"
                  onClick={printReport}
                  className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#071a2f]/15 px-5 text-xs font-bold text-[#071a2f] transition hover:border-[#c9a227]"
                >
                  Print / save decision pack
                </button>
              </div>

              <p className="mt-6 flex items-start gap-2 text-[9px] leading-5 text-slate-400">
                <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
                This is a planning estimate from buyer-entered figures or a visible starting-price reference. Developer documentation prevails. Taxes, registration and financing require current confirmation; this is not legal, tax or lending advice.
              </p>
            </div>
          </article>
        </div>

        {savedQuotes.length > 0 && (
          <section className="truecost-print-hide mt-10 rounded-[2rem] bg-[#071a2f] p-6 text-white sm:p-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                  <GitCompareArrows className="size-4" /> Saved quote comparison
                </p>
                <h2 className="mt-3 text-4xl font-medium">Compare real commitments.</h2>
              </div>
              <p className="max-w-lg text-xs leading-6 text-white/45">
                Stored only on this device. Compare up to four quotes and keep the assumptions visible.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {savedQuotes.map((quote) => {
                const quoteResult = calculateTrueCost(quote.inputs);
                return (
                  <article key={quote.id} className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#e4c462]">
                          {new Date(quote.savedAt).toLocaleDateString("en-IN")}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">{quote.projectName}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuote(quote.id)}
                        aria-label={`Remove ${quote.projectName} quote`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/30 transition hover:bg-white/10 hover:text-white"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs">
                      <div className="flex justify-between gap-3"><span className="text-white/40">All-in</span><strong>{formatLakhs(quoteResult.allInLakhs)}</strong></div>
                      <div className="flex justify-between gap-3"><span className="text-white/40">Carpet rate</span><strong>{quoteResult.carpetRateRupees ? formatRupees(quoteResult.carpetRateRupees) : "—"}</strong></div>
                      <div className="flex justify-between gap-3"><span className="text-white/40">Open questions</span><strong>{quoteResult.questions.length}</strong></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadQuote(quote)}
                      className="mt-5 inline-flex items-center text-xs font-bold text-[#e4c462] transition hover:text-white"
                    >
                      Open this quote <ArrowRight className="ml-2 size-4" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <div className="truecost-print-hide mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.6rem] border border-[#c9a227]/25 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7411]">
              <BadgeCheck className="size-4" /> Continue your decision
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Compare the strongest projects, then plan site visits only for the options that remain sensible after the complete-cost review.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/compare" className="inline-flex h-12 items-center rounded-full border border-[#071a2f]/15 px-5 text-xs font-bold text-[#071a2f] hover:border-[#c9a227]">
              Compare projects
            </Link>
            <Link href="/book-site-visit" className="inline-flex h-12 items-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white hover:bg-[#0d2948]">
              Plan site visits <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
