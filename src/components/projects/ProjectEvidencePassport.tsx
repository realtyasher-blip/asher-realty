import { ArrowUpRight, BadgeCheck, Check, FileText, ShieldCheck } from "lucide-react";

import type { Project } from "@/data/projects";
import {
  getProjectEvidence,
  getReraCertificateUrl,
  type EvidenceStatus,
} from "@/data/projectEvidence";

const statusLabel: Record<EvidenceStatus, string> = {
  official: "Karnataka RERA record",
  published: "Developer-published",
  "live-check": "Live confirmation required",
  "not-public": "Not found in reviewed public material",
  "review-pending": "Detailed review pending",
};

const statusStyle: Record<EvidenceStatus, string> = {
  official: "border-emerald-200 bg-emerald-50 text-emerald-800",
  published: "border-sky-200 bg-sky-50 text-sky-800",
  "live-check": "border-amber-200 bg-amber-50 text-amber-800",
  "not-public": "border-slate-200 bg-slate-100 text-slate-600",
  "review-pending": "border-violet-200 bg-violet-50 text-violet-800",
};

function documentStyle(status: string) {
  if (status === "Published in K-RERA" || status === "Official link available") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (status === "Not found in reviewed filing") {
    return "bg-rose-100 text-rose-800";
  }
  return "bg-amber-100 text-amber-800";
}

export default function ProjectEvidencePassport({ project }: { project: Project }) {
  const evidence = getProjectEvidence(project);
  const requestUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    `Hi Asher Realty, please prepare the official evidence pack for ${project.name}. I need the exact RERA phase, sanctioned plan, tower floor plan, carpet-area schedule and unit-specific UDS before I shortlist.`
  )}`;

  return (
    <section
      id="evidence"
      aria-labelledby="evidence-title"
      className="mt-8 scroll-mt-24 overflow-hidden rounded-[2rem] border border-[#c9a227]/30 bg-white shadow-[0_22px_70px_rgba(7,26,47,0.09)]"
    >
      <div className="bg-[#071a2f] px-6 py-7 text-white sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10">
                <ShieldCheck className="size-5 text-[#e4c462]" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4c462]">
                Project Evidence Passport
              </p>
            </div>
            <h2 id="evidence-title" className="mt-5 text-4xl font-medium sm:text-5xl">
              Evidence before marketing.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              Every number below states its source, scope and uncertainty. Price,
              inventory and the legal schedule for your exact unit still require a
              current written confirmation.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
              Evidence status
            </p>
            <p className="mt-2 text-sm font-semibold text-[#f0d477]">
              {evidence.reviewLabel}
            </p>
            <p className="mt-1 text-xs text-white/45">Checked {evidence.checkedAt}</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 lg:p-9">
        <div className="grid gap-4 lg:grid-cols-2">
          {evidence.facts.map((fact) => (
            <article
              key={fact.label}
              className="rounded-[1.5rem] border border-slate-200 bg-[#f8f9fb] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  {fact.label}
                </p>
                <span
                  className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${statusStyle[fact.status]}`}
                >
                  {statusLabel[fact.status]}
                </span>
              </div>
              <p className="mt-4 break-words text-lg font-semibold leading-7 text-[#071a2f]">
                {fact.value}
              </p>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a47b10]">
                  {fact.source} · {fact.scope}
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-500">{fact.note}</p>
              </div>
            </article>
          ))}
        </div>

        {(evidence.legalPromoter || evidence.inventory || evidence.planApproval) && (
          <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <BadgeCheck className="size-5 text-emerald-700" />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                Official filing snapshot
              </p>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Legal promoter", evidence.legalPromoter],
                ["K-RERA status", evidence.officialStatus],
                ["Approved on", evidence.approvedOn],
                ["Declared completion", evidence.officialCompletion],
                ["Filed inventory", evidence.inventory],
                ["Plan approval", evidence.planApproval],
              ]
                .filter((item): item is [string, string] => Boolean(item[1]))
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700/70">
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm font-semibold leading-6 text-[#123d2b]">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[1.5rem] border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-[#b08a16]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9a7613]">
                  Document register
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Availability is not the same as legal clearance.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {evidence.documents.map((document) => (
                <div
                  key={document.label}
                  className="rounded-2xl border border-slate-100 bg-[#f8f9fb] p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-[#071a2f]">{document.label}</p>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${documentStyle(document.status)}`}
                    >
                      {document.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{document.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[#071a2f] p-5 text-white sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e4c462]">
              Official record actions
            </p>
            {evidence.registrations.length > 0 ? (
              <div className="mt-5 space-y-3">
                {evidence.registrations.map((registration) => (
                  <a
                    key={registration}
                    href={getReraCertificateUrl(registration)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#c9a227]/55 hover:bg-white/10"
                  >
                    <span>
                      <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-white/35">
                        Open regulator-hosted certificate
                      </span>
                      <span className="mt-1 block break-all text-xs font-semibold text-white/80">
                        {registration}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-[#e4c462]" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <p className="text-sm font-semibold text-[#f0d477]">Registration mapping required</p>
                <p className="mt-2 text-xs leading-6 text-white/55">
                  Do not pay an EOI or booking amount until the exact phase registration is identified.
                </p>
              </div>
            )}

            <a
              href="https://rera.karnataka.gov.in/viewAllProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-xs font-semibold text-white/60 transition hover:text-[#e4c462]"
            >
              Search the official Karnataka RERA register
              <ArrowUpRight className="ml-2 size-3.5" />
            </a>

            <a
              href={requestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
            >
              Request exact plan + UDS pack
            </a>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-[#e4c462]" />
                <p className="text-[11px] leading-6 text-white/45">
                  Regulator and third-party plan files are linked or requested, not mirrored while reuse permission is pending. This protects document provenance and avoids presenting an outdated plan as current.
                </p>
              </div>
              <a
                href="https://rera.karnataka.gov.in/copyrightpolicy"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-[10px] font-semibold text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-white"
              >
                Karnataka RERA reuse policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
