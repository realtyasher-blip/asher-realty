import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  FileCheck2,
  MapPin,
  SearchCheck,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { projectSlug, projects } from "@/data/projects";

const REVIEWED_ON = "12 Aug 2026";

function approvalTimestamp(value?: string) {
  if (!value) return 0;

  const dates = value.match(/\d{1,2} [A-Z][a-z]{2} \d{4}/g);
  if (!dates?.length) return 0;

  return Math.max(
    ...dates.map((date) => {
      const parsed = Date.parse(date);
      return Number.isNaN(parsed) ? 0 : parsed;
    })
  );
}

const recentApprovals = projects
  .filter((project) => approvalTimestamp(project.reraApprovedOn) > 0)
  .sort(
    (first, second) =>
      approvalTimestamp(second.reraApprovedOn) -
      approvalTimestamp(first.reraApprovedOn)
  );

const buyerChecks = [
  {
    icon: FileCheck2,
    title: "Match the exact phase",
    text: "One marketing name can contain several registrations, towers and possession dates.",
  },
  {
    icon: SearchCheck,
    title: "Compare the filed unit row",
    text: "Ask for the carpet area, UDS and sanctioned plan that belong to the exact unit—not a generic brochure type.",
  },
  {
    icon: TriangleAlert,
    title: "Reconcile inconsistencies",
    text: "Inventory totals and parsed schedules can differ. The discrepancy should be resolved before booking.",
  },
];

const registryOnlyCandidate = {
  name: "Assetz City of Palms",
  registration: "PRM/KA/RERA/1250/303/PR/300626/008780",
  approvedOn: "30 Jun 2026",
  completion: "15 Feb 2029",
  legalPromoter: "Assetz Investments and Holdings Private Limited",
};

export default function ReraWatch({ compact = false }: { compact?: boolean }) {
  const displayedProjects = compact ? recentApprovals.slice(0, 6) : recentApprovals;

  return (
    <section id="rera-watch" className="overflow-hidden bg-[#eef3f4] py-24 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800 shadow-sm">
              <ShieldCheck className="size-4" />
              Bengaluru RERA Watch
            </span>
            <h2 className="mt-6 text-5xl font-medium leading-[1.02] text-[#071a2f] sm:text-6xl">
              New approvals,
              <span className="block text-[#9b7816]">decoded for buyers.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-slate-600">
              A regulator-first view of recently approved Bengaluru projects and
              phases. Every profile keeps its registration, approval date and
              evidence gaps visible—so a new launch is not mistaken for a fully
              verified unit.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <CalendarCheck2 className="size-4 text-emerald-700" />
                Register reviewed {REVIEWED_ON}
              </span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                Bengaluru records only
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {buyerChecks.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(7,26,47,.06)] backdrop-blur"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#071a2f] text-[#f0d477]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-[#071a2f]">{title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_25px_80px_rgba(7,26,47,.08)]">
          <div className="grid gap-px bg-slate-200 md:grid-cols-2 xl:grid-cols-3">
            {displayedProjects.map((project, index) => (
              <article key={project.name} className="group relative bg-white p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-800">
                    Approved {project.reraApprovedOn}
                  </span>
                  <span className="text-4xl font-light text-slate-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9b7816]">
                  {project.developer}
                </p>
                <h3 className="mt-2 text-2xl font-medium leading-tight text-[#071a2f]">
                  {project.name}
                </h3>
                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#b08a16]" />
                  {project.location}
                </div>
                <p className="mt-4 text-xs font-semibold text-slate-700">
                  {project.configuration}
                </p>
                <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-500">
                  {project.buyerNotes?.[0] ?? project.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <span className="text-[10px] text-slate-400">
                    Checked {project.verifiedAt}
                  </span>
                  <Link
                    href={`/projects/${projectSlug(project.name)}#evidence`}
                    className="inline-flex items-center text-xs font-bold text-[#071a2f] transition group-hover:text-[#9b7816]"
                  >
                    Open evidence
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-amber-950 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-700">
                Registry-only verification queue
              </p>
              <h3 className="mt-2 text-2xl font-medium text-[#071a2f]">
                {registryOnlyCandidate.name}
              </h3>
              <p className="mt-3 text-xs leading-6 text-amber-900/70">
                Approved {registryOnlyCandidate.approvedOn} · declared completion {registryOnlyCandidate.completion} · legal promoter {registryOnlyCandidate.legalPromoter}. The exact village, registered land, inventory and unit/plot schedule were not safely reconciled in this review, so this record is not yet promoted as a buyer listing.
              </p>
              <p className="mt-2 text-[10px] font-semibold text-amber-800">
                {registryOnlyCandidate.registration}
              </p>
            </div>
            <a
              href={`https://rera.karnataka.gov.in/certificate?CER_NO=${encodeURIComponent(registryOnlyCandidate.registration)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-white px-5 text-xs font-bold text-amber-900"
            >
              Open official certificate
              <ArrowRight className="ml-2 size-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 rounded-[1.5rem] bg-[#071a2f] px-6 py-6 text-white sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold">RERA approval is a starting point—not a purchase recommendation.</p>
            <p className="mt-2 max-w-3xl text-xs leading-6 text-white/48">
              Price, available inventory, title schedule, unit-specific UDS and
              the current Agreement for Sale still need written confirmation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {compact && (
              <Link
                href="/rera-watch"
                className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-xs font-bold text-white"
              >
                View full RERA Watch
              </Link>
            )}
            <a
              href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20please%20prepare%20a%20phase-matched%20RERA%20evidence%20pack%20for%20the%20Bengaluru%20project%20I%20am%20considering."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f]"
            >
              Request exact evidence pack
              <ArrowRight className="ml-2 size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
