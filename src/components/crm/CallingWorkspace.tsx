"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CalendarCheck,
  Clock3,
  Download,
  FileSpreadsheet,
  Headphones,
  MessageCircle,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Upload,
} from "lucide-react";

import {
  callOutcomes,
  callingSummary,
  consentOptions,
  interestLevels,
  type CallAssessmentInput,
  type CallOutcome,
  type ConsentStatus,
  type InterestLevel,
} from "@/lib/crm/calling";
import type { Lead } from "@/lib/crm/types";

type CallingWorkspaceProps = {
  initialLeads: Lead[];
  initialError?: string;
  providerConfigured: boolean;
};

type FormState = CallAssessmentInput;

const emptyForm: FormState = {
  consentStatus: "Not verified",
  consentSource: "",
  outcome: "Answered",
  interest: "Unknown",
  language: "English",
  disclosedAi: true,
  budgetConfirmed: false,
  timeline: "",
  summary: "",
  objection: "",
  transcript: "",
  recordingUrl: "",
  followUpAt: "",
  siteVisitDate: "",
  siteVisitTime: "",
};

const classStyles = {
  Hot: "bg-rose-50 text-rose-700 border-rose-200",
  Warm: "bg-amber-50 text-amber-700 border-amber-200",
  Nurture: "bg-blue-50 text-blue-700 border-blue-200",
  Unreached: "bg-slate-100 text-slate-600 border-slate-200",
  "Not a prospect": "bg-zinc-100 text-zinc-600 border-zinc-200",
};

function sourceLabel(source: string) {
  return source.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

function displayDate(value?: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formForLead(lead: Lead): FormState {
  const { profile, latest } = callingSummary(lead);
  return {
    ...emptyForm,
    consentStatus: profile.consentStatus,
    consentSource: profile.consentSource,
    language: latest?.language || "English",
    timeline: lead.timeline || latest?.timeline || "",
    siteVisitDate: lead.preferred_visit_date || "",
    siteVisitTime: lead.preferred_visit_time || "",
  };
}

export default function CallingWorkspace({
  initialLeads,
  initialError = "",
  providerConfigured,
}: CallingWorkspaceProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("All projects");
  const [mode, setMode] = useState<"Inbound follow-up" | "Consent-verified outreach">("Inbound follow-up");
  const [queueIds, setQueueIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(initialError);
  const uploadRef = useRef<HTMLInputElement>(null);

  const projectOptions = useMemo(
    () =>
      Array.from(new Set(leads.map((lead) => lead.project).filter((value): value is string => Boolean(value))))
        .sort(),
    [leads]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const projectMatch = project === "All projects" || lead.project === project;
      const searchMatch =
        !term ||
        [lead.name, lead.phone, lead.project, lead.location, lead.budget, lead.source]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      return projectMatch && searchMatch;
    });
  }, [leads, project, query]);

  const eligible = filtered.filter((lead) => {
    const { eligible: consented, profile } = callingSummary(lead);
    return consented && !profile.doNotCall && !["Booked", "Not interested"].includes(lead.status);
  });

  const stats = useMemo(() => {
    let hot = 0;
    let visits = 0;
    let suppressed = 0;
    let assessed = 0;
    for (const lead of leads) {
      const { profile, latest } = callingSummary(lead);
      if (latest) assessed += 1;
      if (latest?.classification === "Hot") hot += 1;
      if (latest?.siteVisitDate || lead.status === "Site visit scheduled") visits += 1;
      if (profile.doNotCall || profile.consentStatus === "Withdrawn") suppressed += 1;
    }
    return { hot, visits, suppressed, assessed };
  }, [leads]);

  function openLead(lead: Lead) {
    setSelected(lead);
    setForm(formForLead(lead));
    setNotice("");
    setError("");
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildQueue() {
    setQueueIds(eligible.map((lead) => lead.id));
    setNotice(
      eligible.length
        ? `${eligible.length} consent-verified lead${eligible.length === 1 ? "" : "s"} added to the review queue.`
        : "No leads in this view have verified calling permission yet."
    );
  }

  async function saveAssessment() {
    if (!selected) return;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/crm/calling/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selected.id, ...form }),
      });
      const data = (await response.json()) as { lead?: Lead; error?: string };
      if (!response.ok || !data.lead) throw new Error(data.error || "Unable to save assessment.");
      setLeads((current) => current.map((lead) => (lead.id === data.lead?.id ? data.lead : lead)));
      setSelected(data.lead);
      setForm(formForLead(data.lead));
      setNotice("Response saved, lead scored and sales stage updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save assessment.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadContacts(file?: File) {
    if (!file) return;
    setUploading(true);
    setNotice("");
    setError("");
    try {
      const payload = new FormData();
      payload.append("file", file);
      const response = await fetch("/api/crm/calling/import", {
        method: "POST",
        body: payload,
      });
      const data = (await response.json()) as {
        imported?: number;
        duplicates?: number;
        rejected?: number;
        errors?: Array<{ row: number; reason: string }>;
        error?: string;
      };
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) throw new Error(data.error || "Unable to import contacts.");

      const leadsResponse = await fetch("/api/crm/leads", { cache: "no-store" });
      const leadsData = (await leadsResponse.json()) as { leads?: Lead[] };
      if (leadsResponse.ok && leadsData.leads) setLeads(leadsData.leads);

      const firstError = data.errors?.[0];
      setNotice(
        `${data.imported || 0} contact${data.imported === 1 ? "" : "s"} imported. ` +
          `${data.duplicates || 0} duplicate${data.duplicates === 1 ? "" : "s"} skipped. ` +
          `${data.rejected || 0} invalid row${data.rejected === 1 ? "" : "s"} skipped.` +
          (firstError ? ` First issue: row ${firstError.row} — ${firstError.reason}.` : "")
      );
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to import contacts.");
    } finally {
      setUploading(false);
      if (uploadRef.current) uploadRef.current.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-[#eef1f4] text-[#071a2f]">
      <header className="border-b border-white/10 bg-[#071a2f] text-white">
        <div className="mx-auto max-w-[1560px] px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[#c9a227]/35 bg-[#c9a227]/10">
                <Bot className="size-6 text-[#e4c462]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#e4c462]">Asher Realty AI operations</p>
                <h1 className="mt-1 text-3xl font-medium">Calling intelligence</h1>
                <p className="mt-1 text-xs text-white/45">Consent-led calling, human-readable outcomes and site-visit conversion</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="/crm" className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-xs font-bold text-white/75 transition hover:bg-white/10">
                <ArrowLeft className="mr-2 size-4" /> Leads CRM
              </a>
              <a href="/api/crm/export" className="inline-flex h-11 items-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]">
                <FileSpreadsheet className="mr-2 size-4" /> Export Excel
              </a>
              <a href="/api/crm/calling/import" className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-xs font-bold text-white/75 transition hover:bg-white/10">
                <Download className="mr-2 size-4" /> Name–number template
              </a>
              <input
                ref={uploadRef}
                type="file"
                accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onChange={(event) => void uploadContacts(event.target.files?.[0])}
                className="hidden"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => uploadRef.current?.click()}
                className="inline-flex h-11 items-center rounded-full border border-[#c9a227]/40 bg-[#c9a227]/10 px-5 text-xs font-bold text-[#e4c462] transition hover:bg-[#c9a227]/20 disabled:opacity-60"
              >
                <Upload className="mr-2 size-4" /> {uploading ? "Importing…" : "Upload contacts"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1560px] px-5 py-7 sm:px-8">
        <section className={`rounded-2xl border p-5 ${providerConfigured ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className={`mt-0.5 size-5 shrink-0 ${providerConfigured ? "text-emerald-700" : "text-amber-700"}`} />
              <div>
                <p className="text-sm font-bold">{providerConfigured ? "Provider credentials detected — activation review required" : "Safe setup mode — public AI calls are disabled"}</p>
                <p className="mt-1 max-w-4xl text-xs leading-6 text-slate-600">
                  The workspace can verify permission, create a compliant queue, capture responses, score prospects and export results now. Live calling activates only after Exotel, OpenAI Realtime, caller-ID registration and suppression checks are completed.
                </p>
              </div>
            </div>
            <span className="inline-flex h-9 shrink-0 items-center rounded-full border border-current/15 bg-white/70 px-4 text-[10px] font-bold uppercase tracking-[.15em]">
              <span className={`mr-2 size-2 rounded-full ${providerConfigured ? "bg-emerald-500" : "bg-amber-500"}`} />
              {providerConfigured ? "Review gate" : "No outbound calls"}
            </span>
          </div>
        </section>

        {(error || notice) && (
          <div className={`mt-4 rounded-2xl border p-4 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {error || notice}
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Headphones, label: "Assessed leads", value: stats.assessed, detail: "Responses captured" },
            { icon: Sparkles, label: "Hot prospects", value: stats.hot, detail: "High intent or visit-ready" },
            { icon: CalendarCheck, label: "Visits scheduled", value: stats.visits, detail: "From all CRM activity" },
            { icon: ShieldCheck, label: "Suppressed", value: stats.suppressed, detail: "DNC or permission withdrawn" },
          ].map(({ icon: Icon, label, value, detail }) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><Icon className="size-5 text-[#b08a16]" /><span className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-300">Live CRM</span></div>
              <p className="mt-4 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-xs font-bold">{label}</p>
              <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 overflow-hidden rounded-[1.75rem] bg-[#071a2f] text-white shadow-[0_20px_60px_rgba(7,26,47,.14)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end lg:p-8">
            <label className="text-xs font-bold text-white/70">
              Calling workflow
              <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none">
                <option className="text-[#071a2f]">Inbound follow-up</option>
                <option className="text-[#071a2f]">Consent-verified outreach</option>
              </select>
            </label>
            <label className="text-xs font-bold text-white/70">
              Project queue
              <select value={project} onChange={(event) => setProject(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none">
                <option className="text-[#071a2f]">All projects</option>
                {projectOptions.map((name) => <option className="text-[#071a2f]" key={name}>{name}</option>)}
              </select>
            </label>
            <button onClick={buildQueue} className="inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-7 text-xs font-bold text-[#071a2f] hover:bg-[#e4c462]">
              <UserCheck className="mr-2 size-4" /> Review {eligible.length} eligible
            </button>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-3">
            <div className="p-5"><p className="text-[10px] uppercase tracking-[.15em] text-white/35">Permission rule</p><p className="mt-2 text-xs leading-6 text-white/65">Only explicit, recorded permission enters the queue.</p></div>
            <div className="border-white/10 p-5 sm:border-l"><p className="text-[10px] uppercase tracking-[.15em] text-white/35">Identity rule</p><p className="mt-2 text-xs leading-6 text-white/65">The assistant introduces itself as Asher Realty&apos;s virtual assistant.</p></div>
            <div className="border-white/10 p-5 sm:border-l"><p className="text-[10px] uppercase tracking-[.15em] text-white/35">Suppression rule</p><p className="mt-2 text-xs leading-6 text-white/65">Opt-outs are suppressed before any future queue is built.</p></div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
          <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[1fr_auto]">
              <label className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, project, location or budget" className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-11 pr-4 text-sm outline-none focus:border-[#c9a227]" />
              </label>
              <span className="inline-flex h-11 items-center rounded-xl bg-[#f7f8fa] px-4 text-xs font-bold text-slate-500"><Users className="mr-2 size-4" /> {filtered.length} leads · {queueIds.length} queued</span>
            </div>

            {filtered.length === 0 ? (
              <p className="p-12 text-center text-sm text-slate-400">No leads match this calling view.</p>
            ) : (
              <div className="max-h-[800px] divide-y divide-slate-100 overflow-y-auto">
                {filtered.map((lead) => {
                  const { profile, latest, eligible: isEligible } = callingSummary(lead);
                  return (
                    <button key={lead.id} onClick={() => openLead(lead)} className={`grid w-full gap-3 p-5 text-left transition hover:bg-[#f7f8fa] md:grid-cols-[1.2fr_1fr_180px] ${selected?.id === lead.id ? "bg-[#fff9e5]" : ""}`}>
                      <span>
                        <span className="flex items-center gap-2"><span className="font-bold">{lead.name}</span>{queueIds.includes(lead.id) && <span className="size-2 rounded-full bg-emerald-500" />}</span>
                        <span className="mt-1 block text-xs text-slate-400">{lead.phone} · {sourceLabel(lead.source)}</span>
                        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold ${isEligible ? "border-emerald-200 bg-emerald-50 text-emerald-700" : profile.doNotCall ? "border-rose-200 bg-rose-50 text-rose-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                          {profile.doNotCall ? "Suppressed" : isEligible ? "Permission verified" : "Permission needed"}
                        </span>
                      </span>
                      <span><span className="block text-sm font-semibold">{lead.project || "General property enquiry"}</span><span className="mt-1 block text-xs text-slate-400">{lead.location || lead.budget || "Requirement review pending"}</span><span className="mt-2 block text-[10px] text-slate-400">Last response: {latest ? displayDate(latest.recordedAt) : "Not called"}</span></span>
                      <span className="md:text-right">
                        {latest ? <><span className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold ${classStyles[latest.classification]}`}>{latest.classification}</span><span className="mt-2 block text-xs font-bold text-[#b08a16]">Score {latest.score}/100</span></> : <span className="text-xs text-slate-400">Awaiting assessment</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="self-start rounded-[1.5rem] border border-slate-200 bg-white p-6 xl:sticky xl:top-6">
            {!selected ? (
              <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#071a2f]"><PhoneCall className="size-7 text-[#e4c462]" /></div>
                <h2 className="mt-6 text-2xl font-medium">Select a lead</h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">Verify calling permission, capture the response and let the scoring model organise the next sales action.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#b08a16]">Call response</p><h2 className="mt-2 text-3xl font-medium">{selected.name}</h2><p className="mt-1 text-xs text-slate-400">{selected.project || "General enquiry"}</p></div>
                  <a href={`tel:${selected.phone}`} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#071a2f] text-white" aria-label="Call manually"><Phone className="size-4" /></a>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold">Permission status<select value={form.consentStatus} onChange={(e) => update("consentStatus", e.target.value as ConsentStatus)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs">{consentOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="text-xs font-bold">Permission source<input value={form.consentSource} onChange={(e) => update("consentSource", e.target.value)} placeholder="Form, CRM note, campaign" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs" /></label>
                  <label className="text-xs font-bold">Outcome<select value={form.outcome} onChange={(e) => update("outcome", e.target.value as CallOutcome)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs">{callOutcomes.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="text-xs font-bold">Interest<select value={form.interest} onChange={(e) => update("interest", e.target.value as InterestLevel)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs">{interestLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="text-xs font-bold">Language<select value={form.language} onChange={(e) => update("language", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs"><option>English</option><option>Kannada</option><option>Hindi</option><option>Tamil</option><option>Telugu</option></select></label>
                  <label className="text-xs font-bold">Timeline<input value={form.timeline} onChange={(e) => update("timeline", e.target.value)} placeholder="Within 3 months" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs" /></label>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f7f8fa] p-3 text-xs font-semibold"><input type="checkbox" checked={form.disclosedAi} onChange={(e) => update("disclosedAi", e.target.checked)} className="accent-[#c9a227]" /> Assistant identity disclosed</label>
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f7f8fa] p-3 text-xs font-semibold"><input type="checkbox" checked={form.budgetConfirmed} onChange={(e) => update("budgetConfirmed", e.target.checked)} className="accent-[#c9a227]" /> Budget confirmed</label>
                </div>

                <label className="mt-4 block text-xs font-bold">Conversation summary<textarea rows={3} value={form.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Requirement, motivation and agreed next step" className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] p-3 text-sm outline-none focus:border-[#c9a227]" /></label>
                <label className="mt-4 block text-xs font-bold">Primary objection<input value={form.objection} onChange={(e) => update("objection", e.target.value)} placeholder="Price, location, timing or financing" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-sm" /></label>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold">Site visit date<input type="date" value={form.siteVisitDate} onChange={(e) => update("siteVisitDate", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs" /></label>
                  <label className="text-xs font-bold">Visit time<input value={form.siteVisitTime} onChange={(e) => update("siteVisitTime", e.target.value)} placeholder="11:00 AM" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs" /></label>
                  <label className="text-xs font-bold sm:col-span-2">Next follow-up<input type="datetime-local" value={form.followUpAt} onChange={(e) => update("followUpAt", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-xs" /></label>
                </div>

                <details className="mt-4 rounded-xl border border-slate-200 bg-[#f7f8fa] p-4">
                  <summary className="cursor-pointer text-xs font-bold">Transcript and recording reference</summary>
                  <label className="mt-4 block text-xs font-bold">Transcript<textarea rows={3} value={form.transcript} onChange={(e) => update("transcript", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs" /></label>
                  <label className="mt-3 block text-xs font-bold">Recording URL<input type="url" value={form.recordingUrl} onChange={(e) => update("recordingUrl", e.target.value)} placeholder="Added automatically after provider connection" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs" /></label>
                </details>

                <button onClick={() => void saveAssessment()} disabled={saving} className="mt-5 h-12 w-full rounded-full bg-[#c9a227] text-sm font-bold transition hover:bg-[#e4c462] disabled:opacity-60">{saving ? "Scoring and saving…" : "Save response and classify"}</button>
                <a href={`https://wa.me/91${cleanPhone(selected.phone)}?text=${encodeURIComponent(`Hi ${selected.name}, this is Asher Realty following up on your property requirement${selected.project ? ` for ${selected.project}` : ""}.`)}`} target="_blank" rel="noopener noreferrer" className="mt-3 flex h-11 items-center justify-center rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:border-[#25D366] hover:text-[#1f9d50]"><MessageCircle className="mr-2 size-4" /> Continue on WhatsApp</a>
              </>
            )}
          </aside>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            { icon: Bot, title: "Human-sounding, never deceptive", text: "Natural pacing, interruption handling and Bengaluru language choices—while clearly identifying the virtual assistant." },
            { icon: Clock3, title: "Fast response for inbound leads", text: "The eventual provider workflow can prioritise fresh enquiries, then hand hot prospects to a human advisor." },
            { icon: Download, title: "Excel-ready outcomes", text: "Every saved assessment, score, objection, follow-up and visit field is included in the CRM workbook." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="size-5 text-[#b08a16]" /><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{text}</p></article>
          ))}
        </section>
      </div>
    </main>
  );
}
