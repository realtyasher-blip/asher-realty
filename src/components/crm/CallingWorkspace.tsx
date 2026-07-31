"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CalendarCheck,
  Clock3,
  Copy,
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
  assessLead,
  callingSummary,
  consentOptions,
  interestLevels,
  type CallAssessmentInput,
  type CallOutcome,
  type ConsentStatus,
  type InterestLevel,
} from "@/lib/crm/calling";
import type { Lead } from "@/lib/crm/types";
import type { VoiceReadiness } from "@/lib/crm/voice-types";

type CallingWorkspaceProps = {
  initialLeads: Lead[];
  initialError?: string;
  voiceReadiness: VoiceReadiness;
};

type FormState = CallAssessmentInput;
type ViewFilter = "All" | "Eligible" | "New" | "Hot" | "Warm" | "Follow-up" | "Unreached" | "Suppressed";

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

function leadPriority(lead: Lead, queued: boolean) {
  const { profile, latest, eligible } = callingSummary(lead);
  if (profile.doNotCall || profile.consentStatus === "Withdrawn") return -100;
  let priority = queued ? 200 : 0;
  if (latest?.classification === "Hot") priority += 100;
  else if (latest?.classification === "Warm") priority += 70;
  else if (latest?.classification === "Unreached") priority += 35;
  else if (!latest) priority += 45;
  if (eligible) priority += 30;
  if (lead.follow_up_at) priority += 15;
  return priority + (latest?.score || 0);
}

function nextBestAction(lead: Lead) {
  const { profile, latest, eligible } = callingSummary(lead);
  if (profile.doNotCall || profile.consentStatus === "Withdrawn") {
    return "Keep this contact suppressed. Do not call or add it to a future campaign.";
  }
  if (!eligible) return "Verify the permission source before any automated call is attempted.";
  if (!latest) return "Make a short first-response call, confirm requirements and offer two relevant project options.";
  if (latest.siteVisitDate) return "Confirm the visit slot, send the map and assign a human advisor before the visit.";
  if (latest.classification === "Hot") return "Human advisor handoff within 5 minutes. Close on a site-visit date, not another information exchange.";
  if (latest.classification === "Warm") return "Send a two-project comparison, then schedule a specific follow-up time.";
  if (latest.classification === "Unreached") return "Retry once in a different approved time window; stop after the configured attempt limit.";
  if (latest.classification === "Not a prospect") return "No sales follow-up. Retain only the minimum record needed for suppression and reporting.";
  return "Move to a low-frequency nurture flow with useful Bengaluru buyer information.";
}

function openerForLead(lead: Lead, language: string) {
  const project = lead.project ? ` about ${lead.project}` : " about homes in Bengaluru";
  return `Hi ${lead.name}, I’m Aira, Asher Realty’s virtual property assistant. You recently contacted us${project}. Is now a convenient time for a brief 60-second update? Continue in ${language}.`;
}

function handoffGuidance(form: FormState, score?: ReturnType<typeof assessLead> | null) {
  const sensitiveTopic = /legal|rera|loan|finance|discount|negotiat|complaint|refund|agreement/i.test(
    `${form.objection} ${form.summary}`
  );
  if (form.outcome === "Do not call" || form.consentStatus === "Withdrawn") {
    return {
      urgent: false,
      title: "Suppress immediately",
      text: "No sales handoff. Record the opt-out and prevent future campaign selection.",
    };
  }
  if (score?.classification === "Hot") {
    return {
      urgent: true,
      title: "Live human handoff",
      text: "Connect an advisor within 5 minutes and close on a specific site-visit slot.",
    };
  }
  if (sensitiveTopic) {
    return {
      urgent: true,
      title: "Specialist handoff",
      text: "Move this conversation to a human advisor for pricing, legal, finance or complaint handling.",
    };
  }
  return {
    urgent: false,
    title: "Assistant can continue",
    text: "Complete qualification, confirm the next action and send a concise WhatsApp recap.",
  };
}

function conversationStages(lead: Lead, language: string) {
  const project = lead.project || "their Bengaluru property search";
  return [
    {
      label: "Permission",
      coaching: "Identify Aira clearly, mention the enquiry context and ask permission to continue.",
      line: openerForLead(lead, language),
    },
    {
      label: "Discover",
      coaching: "Ask one question at a time and let the buyer finish before moving on.",
      line: `To help me narrow the right options for ${project}, is this purchase mainly for your own use or for investment?`,
    },
    {
      label: "Qualify",
      coaching: "Confirm location, configuration, budget and purchase timeline without sounding like a form.",
      line: "Which matters most for your decision right now: the location, total budget, larger space or possession timeline?",
    },
    {
      label: "Advise",
      coaching: "Reflect the requirement first. Offer no more than two relevant options and use approved facts only.",
      line: "Based on what you shared, I can arrange a concise comparison of two suitable options with verified pricing and availability.",
    },
    {
      label: "Next step",
      coaching: "End with one specific action: human callback, comparison or site visit. Confirm the exact time.",
      line: "Would you prefer a short advisor call today, or should I help arrange a guided site visit this weekend?",
    },
  ];
}

function objectionCoach(objection: string) {
  if (!objection.trim()) return null;
  if (/price|cost|expensive|budget|discount/i.test(objection)) {
    return {
      title: "Price concern",
      response: "Acknowledge the budget, avoid promising discounts and offer a verified all-in cost comparison with two alternatives.",
    };
  }
  if (/location|traffic|distance|commute|far/i.test(objection)) {
    return {
      title: "Location concern",
      response: "Ask for the buyer's daily destination and preferred maximum commute before comparing corridors or projects.",
    };
  }
  if (/later|time|not now|wait|future/i.test(objection)) {
    return {
      title: "Timing concern",
      response: "Respect the timeline, ask what event will trigger the purchase and agree on a specific low-pressure follow-up date.",
    };
  }
  if (/trust|legal|rera|approval|delay|possession/i.test(objection)) {
    return {
      title: "Trust or legal concern",
      response: "Do not interpret documents. Offer verified RERA references and connect a human advisor for factual clarification.",
    };
  }
  if (/loan|emi|finance|bank/i.test(objection)) {
    return {
      title: "Finance concern",
      response: "Confirm the comfortable monthly range and offer a human loan specialist; never imply loan approval.",
    };
  }
  return {
    title: "Clarify before answering",
    response: "Reflect the concern in the buyer's own words, ask one clarifying question and avoid a rehearsed rebuttal.",
  };
}

function qualityChecklist(form: FormState) {
  const answered = form.outcome === "Answered" || form.outcome === "Call back requested";
  const checks = [
    { label: "Permission documented", passed: form.consentStatus !== "Not verified" && form.consentStatus !== "Withdrawn" && Boolean(form.consentSource.trim()) },
    { label: "AI identity disclosed", passed: !answered || form.disclosedAi },
    { label: "Useful conversation summary", passed: !answered || form.summary.trim().length >= 20 },
    { label: "Requirement qualified", passed: !answered || form.budgetConfirmed || Boolean(form.timeline.trim()) },
    { label: "Clear next action", passed: Boolean(form.followUpAt || form.siteVisitDate) || ["No answer", "Busy", "Wrong number", "Not interested", "Do not call"].includes(form.outcome) },
  ];
  return { checks, score: checks.filter((check) => check.passed).length * 20 };
}

export default function CallingWorkspace({
  initialLeads,
  initialError = "",
  voiceReadiness,
}: CallingWorkspaceProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("All projects");
  const [mode, setMode] = useState<"Inbound follow-up" | "Consent-verified outreach">("Inbound follow-up");
  const [campaignLanguage, setCampaignLanguage] = useState("English");
  const [campaignGoal, setCampaignGoal] = useState("Qualify and book a site visit");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("All");
  const [queueIds, setQueueIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(initialError);
  const [copied, setCopied] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [startingTestCall, setStartingTestCall] = useState(false);
  const [transferringCall, setTransferringCall] = useState(false);
  const [testAcknowledged, setTestAcknowledged] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const providerConfigured = voiceReadiness.ready;

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
      const { profile, latest, eligible } = callingSummary(lead);
      const viewMatch =
        viewFilter === "All" ||
        (viewFilter === "Eligible" && eligible) ||
        (viewFilter === "New" && !latest) ||
        (viewFilter === "Hot" && latest?.classification === "Hot") ||
        (viewFilter === "Warm" && latest?.classification === "Warm") ||
        (viewFilter === "Follow-up" && Boolean(lead.follow_up_at)) ||
        (viewFilter === "Unreached" && latest?.classification === "Unreached") ||
        (viewFilter === "Suppressed" && (profile.doNotCall || profile.consentStatus === "Withdrawn"));
      const searchMatch =
        !term ||
        [lead.name, lead.phone, lead.project, lead.location, lead.budget, lead.source]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      return projectMatch && viewMatch && searchMatch;
    }).sort((a, b) => leadPriority(b, queueIds.includes(b.id)) - leadPriority(a, queueIds.includes(a.id)));
  }, [leads, project, query, queueIds, viewFilter]);

  const eligible = filtered.filter((lead) => {
    const { eligible: consented, profile } = callingSummary(lead);
    return consented && !profile.doNotCall && !["Booked", "Not interested"].includes(lead.status);
  });

  const stats = useMemo(() => {
    let hot = 0;
    let visits = 0;
    let suppressed = 0;
    let attempts = 0;
    let answered = 0;
    let warm = 0;
    let eligibleCount = 0;
    let newLeads = 0;
    let followUps = 0;
    for (const lead of leads) {
      const { profile, latest, eligible: isEligible } = callingSummary(lead);
      attempts += profile.attempts.length;
      answered += profile.attempts.filter((attempt) =>
        ["Answered", "Call back requested", "Not interested", "Do not call"].includes(attempt.outcome)
      ).length;
      if (latest?.classification === "Hot") hot += 1;
      if (latest?.classification === "Warm") warm += 1;
      if (latest?.siteVisitDate || lead.status === "Site visit scheduled") visits += 1;
      if (profile.doNotCall || profile.consentStatus === "Withdrawn") suppressed += 1;
      if (isEligible && !profile.doNotCall && !["Booked", "Not interested"].includes(lead.status)) eligibleCount += 1;
      if (!latest) newLeads += 1;
      if (lead.follow_up_at) followUps += 1;
    }
    return {
      hot,
      warm,
      visits,
      suppressed,
      attempts,
      answered,
      eligibleCount,
      newLeads,
      followUps,
      answerRate: attempts ? Math.round((answered / attempts) * 100) : 0,
      visitRate: answered ? Math.round((visits / answered) * 100) : 0,
    };
  }, [leads]);

  const selectedCalling = selected ? callingSummary(selected) : null;
  const scorePreview = selected ? assessLead(selected, form) : null;
  const opener = selected ? openerForLead(selected, campaignLanguage) : "";
  const handoff = handoffGuidance(form, scorePreview);
  const stages = selected ? conversationStages(selected, campaignLanguage) : [];
  const activeStage = stages[currentStage];
  const objectionHelp = objectionCoach(form.objection);
  const quality = qualityChecklist(form);

  function openLead(lead: Lead) {
    setSelected(lead);
    setForm(formForLead(lead));
    setNotice("");
    setError("");
    setCopied(false);
    setCurrentStage(0);
    setTestAcknowledged(false);
  }

  async function copyScript(text: string) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openSmartQueue(filter: ViewFilter) {
    setViewFilter(filter);
    requestAnimationFrame(() => document.getElementById("calling-leads")?.scrollIntoView({ behavior: "smooth", block: "start" }));
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

  async function startTestCall() {
    if (!selected || !testAcknowledged) return;
    const confirmed = window.confirm(
      `Start one AI test call to ${selected.name} at ${selected.phone}? This is allowed only because the CRM shows verified permission.`
    );
    if (!confirmed) return;
    setStartingTestCall(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/crm/calling/test-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selected.id,
          acknowledgement: "START_SINGLE_CONSENTED_TEST_CALL",
        }),
      });
      const data = (await response.json()) as {
        lead?: Lead;
        result?: { message?: string };
        error?: string;
      };
      if (!response.ok || !data.lead) {
        throw new Error(data.error || "Unable to start the test call.");
      }
      setLeads((current) =>
        current.map((lead) => (lead.id === data.lead?.id ? data.lead : lead))
      );
      setSelected(data.lead);
      setNotice(data.result?.message || "The controlled test call was requested.");
      setTestAcknowledged(false);
    } catch (callError) {
      setError(callError instanceof Error ? callError.message : "Unable to start the test call.");
    } finally {
      setStartingTestCall(false);
    }
  }

  async function transferActiveCall() {
    if (!selected) return;
    setTransferringCall(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/crm/calling/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selected.id }),
      });
      const data = (await response.json()) as { lead?: Lead; error?: string };
      if (!response.ok || !data.lead) {
        throw new Error(data.error || "Unable to transfer the call.");
      }
      setLeads((current) =>
        current.map((lead) => (lead.id === data.lead?.id ? data.lead : lead))
      );
      setSelected(data.lead);
      setNotice("The active AI call was transferred to the configured human advisor.");
    } catch (transferError) {
      setError(
        transferError instanceof Error ? transferError.message : "Unable to transfer the call."
      );
    } finally {
      setTransferringCall(false);
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
              {providerConfigured ? "Single-test ready" : "No outbound calls"}
            </span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {voiceReadiness.checks.map((check) => (
              <div key={check.key} className="rounded-xl border border-current/10 bg-white/65 p-3">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${check.ready ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <p className="text-[10px] font-bold uppercase tracking-[.12em]">{check.label}</p>
                </div>
                <p className="mt-2 text-[10px] leading-5 text-slate-500">{check.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-slate-500">
            Voice: {voiceReadiness.voice} · Model: {voiceReadiness.model} · Bulk calling remains unavailable in this release.
          </p>
        </section>

        {(error || notice) && (
          <div className={`mt-4 rounded-2xl border p-4 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {error || notice}
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { icon: Headphones, label: "Call attempts", value: stats.attempts, detail: "Recorded interactions" },
            { icon: PhoneCall, label: "Answer rate", value: `${stats.answerRate}%`, detail: "Connected conversations" },
            { icon: Sparkles, label: "Hot prospects", value: stats.hot, detail: "High intent or visit-ready" },
            { icon: CalendarCheck, label: "Visit conversion", value: `${stats.visitRate}%`, detail: `${stats.visits} visits scheduled` },
            { icon: ShieldCheck, label: "Suppressed", value: stats.suppressed, detail: "DNC or permission withdrawn" },
          ].map(({ icon: Icon, label, value, detail }) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between"><Icon className="size-5 text-[#b08a16]" /><span className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-300">Live CRM</span></div>
              <p className="mt-4 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-xs font-bold">{label}</p>
              <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#b08a16]">AI daily briefing</p>
                <h2 className="mt-2 text-3xl font-medium">The queue that deserves attention now</h2>
              </div>
              <p className="max-w-sm text-xs leading-6 text-slate-500">Aira prioritises permission, buyer intent and the next agreed action—never just list order.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { filter: "Eligible" as ViewFilter, label: "Ready to contact", value: stats.eligibleCount, text: "Permission verified" },
                { filter: "New" as ViewFilter, label: "Unassessed", value: stats.newLeads, text: "Needs first review" },
                { filter: "Hot" as ViewFilter, label: "Human handoff", value: stats.hot, text: "High intent" },
                { filter: "Follow-up" as ViewFilter, label: "Follow-ups", value: stats.followUps, text: "Next action saved" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => openSmartQueue(item.filter)}
                  className="group rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#c9a227]/45 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{item.value}</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#b08a16] transition group-hover:bg-[#071a2f] group-hover:text-white">→</span>
                  </div>
                  <p className="mt-3 text-xs font-bold">{item.label}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{item.text}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[#071a2f] p-5 text-white shadow-[0_18px_50px_rgba(7,26,47,.14)] sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e4c462]">Conversion funnel</p>
                <h2 className="mt-2 text-2xl font-medium">From call to visit</h2>
              </div>
              <Sparkles className="size-6 text-[#e4c462]" />
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: "Attempts", value: stats.attempts, width: stats.attempts ? 100 : 0 },
                { label: "Conversations", value: stats.answered, width: stats.attempts ? Math.round((stats.answered / stats.attempts) * 100) : 0 },
                { label: "Qualified", value: stats.hot + stats.warm, width: stats.answered ? Math.round(((stats.hot + stats.warm) / stats.answered) * 100) : 0 },
                { label: "Site visits", value: stats.visits, width: stats.answered ? Math.round((stats.visits / stats.answered) * 100) : 0 },
              ].map((step) => (
                <div key={step.label}>
                  <div className="flex items-center justify-between text-[11px]"><span className="text-white/55">{step.label}</span><span className="font-bold">{step.value}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#c9a227] to-[#e4c462]" style={{ width: `${Math.min(100, step.width)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[1.75rem] bg-[#071a2f] text-white shadow-[0_20px_60px_rgba(7,26,47,.14)]">
          <div className="border-b border-white/10 px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e4c462]">Campaign preflight</p>
                <h2 className="mt-2 text-2xl font-medium">Prepare the assistant before building the queue</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-200">Identity disclosure on</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/55">10 AM–7 PM IST</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/55">Max 2 attempts</span>
              </div>
            </div>
          </div>
          <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-[.85fr_1fr_.7fr_1fr_auto] xl:items-end lg:p-8">
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
            <label className="text-xs font-bold text-white/70">
              Conversation language
              <select value={campaignLanguage} onChange={(event) => setCampaignLanguage(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none">
                {['English', 'Kannada', 'Hindi', 'Tamil', 'Telugu'].map((language) => <option className="text-[#071a2f]" key={language}>{language}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-white/70">
              Primary objective
              <select value={campaignGoal} onChange={(event) => setCampaignGoal(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none">
                <option className="text-[#071a2f]">Qualify and book a site visit</option>
                <option className="text-[#071a2f]">Confirm project interest</option>
                <option className="text-[#071a2f]">Reconnect and schedule follow-up</option>
              </select>
            </label>
            <button onClick={buildQueue} className="inline-flex h-12 items-center justify-center rounded-full bg-[#c9a227] px-7 text-xs font-bold text-[#071a2f] hover:bg-[#e4c462]">
              <UserCheck className="mr-2 size-4" /> Review {eligible.length} eligible
            </button>
          </div>
          <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[.035] px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs font-bold">{queueIds.length ? `${queueIds.length} leads ready for final review` : "Build a permission-verified queue"}</p>
              <p className="mt-1 text-[11px] text-white/45">{campaignGoal} · {campaignLanguage} · human handoff for hot prospects or buyer requests</p>
            </div>
            <button disabled className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-xs font-bold text-white/35">
              <PhoneCall className="mr-2 size-4" /> {providerConfigured ? "Select one eligible lead below" : "Complete voice activation checks"}
            </button>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-3">
            <div className="p-5"><p className="text-[10px] uppercase tracking-[.15em] text-white/35">Permission rule</p><p className="mt-2 text-xs leading-6 text-white/65">Only explicit, recorded permission enters the queue.</p></div>
            <div className="border-white/10 p-5 sm:border-l"><p className="text-[10px] uppercase tracking-[.15em] text-white/35">Identity rule</p><p className="mt-2 text-xs leading-6 text-white/65">The assistant introduces itself as Asher Realty&apos;s virtual assistant.</p></div>
            <div className="border-white/10 p-5 sm:border-l"><p className="text-[10px] uppercase tracking-[.15em] text-white/35">Suppression rule</p><p className="mt-2 text-xs leading-6 text-white/65">Opt-outs are suppressed before any future queue is built.</p></div>
          </div>
        </section>

        <div id="calling-leads" className="mt-6 grid scroll-mt-5 gap-6 xl:grid-cols-[1.35fr_.85fr]">
          <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[1fr_auto]">
              <label className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, project, location or budget" className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-11 pr-4 text-sm outline-none focus:border-[#c9a227]" />
              </label>
              <span className="inline-flex h-11 items-center rounded-xl bg-[#f7f8fa] px-4 text-xs font-bold text-slate-500"><Users className="mr-2 size-4" /> {filtered.length} leads · {queueIds.length} queued</span>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3">
              {(["All", "Eligible", "New", "Hot", "Warm", "Follow-up", "Unreached", "Suppressed"] as ViewFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setViewFilter(filter)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold transition ${
                    viewFilter === filter
                      ? "bg-[#071a2f] text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-[#c9a227]/50 hover:text-[#071a2f]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-[#f9fafb] px-5 py-3 text-[10px] text-slate-400">
              <span>Highest-priority leads appear first</span>
              <span>Queued → Hot → Warm → New</span>
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

                <div className="mt-5 rounded-2xl bg-[#071a2f] p-4 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#e4c462]">Next best action</p>
                    {selectedCalling?.latest && (
                      <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${classStyles[selectedCalling.latest.classification]}`}>
                        {selectedCalling.latest.classification} · {selectedCalling.latest.score}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-xs leading-6 text-white/70">{nextBestAction(selected)}</p>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#b08a16]">Controlled voice test</p>
                      <p className="mt-1 text-xs font-bold">One buyer, one explicit action, full safety gate</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${providerConfigured && selectedCalling?.eligible ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                      {providerConfigured && selectedCalling?.eligible ? "Eligible" : "Blocked"}
                    </span>
                  </div>
                  <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-[10px] leading-5 text-slate-600">
                    <input
                      type="checkbox"
                      checked={testAcknowledged}
                      onChange={(event) => setTestAcknowledged(event.target.checked)}
                      className="mt-1 accent-[#c9a227]"
                    />
                    I confirm this lead has documented permission, is not on a suppression list, and may receive one disclosed AI test call now.
                  </label>
                  <button
                    type="button"
                    onClick={() => void startTestCall()}
                    disabled={!providerConfigured || !selectedCalling?.eligible || !testAcknowledged || startingTestCall}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white transition hover:bg-[#c9a227] hover:text-[#071a2f] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    <PhoneCall className="mr-2 size-4" /> {startingTestCall ? "Requesting test call…" : "Start one controlled AI test call"}
                  </button>
                  {selectedCalling?.profile.providerCalls.length ? (
                    <div className="mt-3 space-y-2">
                      {[...selectedCalling.profile.providerCalls].reverse().slice(0, 3).map((call) => (
                        <div key={call.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px]">
                          <span><strong>{call.status.replaceAll("-", " ")}</strong> · {displayDate(call.updatedAt)}</span>
                          {call.openaiCallId && call.status === "in-progress" ? (
                            <button type="button" disabled={transferringCall} onClick={() => void transferActiveCall()} className="rounded-full bg-rose-600 px-3 py-1.5 font-bold text-white disabled:opacity-50">
                              {transferringCall ? "Transferring…" : "Transfer to advisor"}
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-3 text-[9px] leading-5 text-slate-400">
                    No bulk action is available. Recording is controlled in Exotel and must match your approved notice and retention policy.
                  </p>
                </div>

                <details open className="mt-4 rounded-2xl border border-[#c9a227]/25 bg-[#fffaf0] p-4">
                  <summary className="cursor-pointer text-xs font-bold text-[#071a2f]">Aira conversation opener</summary>
                  <div className="mt-4 rounded-xl border border-[#c9a227]/15 bg-white p-4">
                    <p className="text-sm leading-7 text-slate-600">{opener}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[10px] text-slate-400">Goal: {campaignGoal}</p>
                      <button type="button" onClick={() => void copyScript(opener)} className="inline-flex h-9 items-center rounded-full bg-[#071a2f] px-4 text-[10px] font-bold text-white">
                        <Copy className="mr-2 size-3.5" /> {copied ? "Copied" : "Copy opener"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] leading-5 text-slate-500">Ask one question at a time. Pause after the buyer answers. Never invent inventory, offers or final pricing.</p>
                </details>

                {activeStage && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#b08a16]">Guided call · Step {currentStage + 1} of {stages.length}</p>
                          <h3 className="mt-1 text-lg font-bold">{activeStage.label}</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{Math.round(((currentStage + 1) / stages.length) * 100)}%</span>
                      </div>
                      <div className="mt-4 grid grid-cols-5 gap-1.5">
                        {stages.map((stage, index) => (
                          <button
                            type="button"
                            key={stage.label}
                            aria-label={`Open ${stage.label} step`}
                            onClick={() => { setCurrentStage(index); setCopied(false); }}
                            className={`h-1.5 rounded-full transition ${index <= currentStage ? "bg-[#c9a227]" : "bg-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] leading-5 text-slate-500">{activeStage.coaching}</p>
                      <div className="mt-3 rounded-xl bg-[#f7f8fa] p-3">
                        <p className="text-xs leading-6 text-[#071a2f]">“{activeStage.line}”</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <button type="button" disabled={currentStage === 0} onClick={() => { setCurrentStage((stage) => Math.max(0, stage - 1)); setCopied(false); }} className="h-9 rounded-full border border-slate-200 px-4 text-[10px] font-bold text-slate-500 disabled:opacity-35">Previous</button>
                        <button type="button" onClick={() => void copyScript(activeStage.line)} className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 text-[10px] font-bold text-[#071a2f]"><Copy className="mr-2 size-3.5" /> Copy line</button>
                        <button type="button" disabled={currentStage === stages.length - 1} onClick={() => { setCurrentStage((stage) => Math.min(stages.length - 1, stage + 1)); setCopied(false); }} className="h-9 rounded-full bg-[#071a2f] px-4 text-[10px] font-bold text-white disabled:opacity-35">Next</button>
                      </div>
                    </div>
                  </div>
                )}

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

                {objectionHelp && (
                  <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-blue-700" />
                      <div>
                        <p className="text-xs font-bold text-blue-800">AI objection coach · {objectionHelp.title}</p>
                        <p className="mt-1 text-[11px] leading-5 text-slate-600">{objectionHelp.response}</p>
                      </div>
                    </div>
                  </div>
                )}

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

                {!form.disclosedAi && form.outcome === "Answered" && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-700">
                    Identity disclosure is missing. The assistant must identify itself as a virtual assistant at the start of an answered call.
                  </div>
                )}

                {scorePreview && (
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-400">Predicted classification</p>
                      <span className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold ${classStyles[scorePreview.classification]}`}>
                        {scorePreview.classification}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#071a2f]">{scorePreview.score}</p>
                      <p className="text-[9px] font-bold uppercase tracking-[.12em] text-slate-400">Intent score</p>
                    </div>
                  </div>
                )}

                <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-400">Call quality coach</p>
                        <p className="mt-1 text-xs font-bold">{quality.score >= 80 ? "Ready to save" : "Improve the call record"}</p>
                      </div>
                      <div className="text-right"><span className="text-2xl font-bold">{quality.score}</span><span className="text-xs text-slate-400">/100</span></div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${quality.score >= 80 ? "bg-emerald-500" : quality.score >= 60 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${quality.score}%` }} /></div>
                  </summary>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {quality.checks.map((check) => (
                      <div key={check.label} className={`rounded-xl border p-3 text-[10px] font-bold ${check.passed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-[#f7f8fa] text-slate-400"}`}>
                        {check.passed ? "✓" : "○"} {check.label}
                      </div>
                    ))}
                  </div>
                </details>

                <div className={`mt-4 rounded-2xl border p-4 ${handoff.urgent ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"}`}>
                  <p className={`text-xs font-bold ${handoff.urgent ? "text-rose-700" : "text-emerald-700"}`}>{handoff.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">{handoff.text}</p>
                </div>

                {selectedCalling && selectedCalling.profile.attempts.length > 0 && (
                  <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <summary className="cursor-pointer text-xs font-bold">Call history · {selectedCalling.profile.attempts.length} interaction{selectedCalling.profile.attempts.length === 1 ? "" : "s"}</summary>
                    <div className="mt-4 space-y-3">
                      {[...selectedCalling.profile.attempts].reverse().slice(0, 5).map((attempt) => (
                        <article key={attempt.id} className="rounded-xl bg-[#f7f8fa] p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] font-bold">{attempt.outcome}</p>
                            <span className={`rounded-full border px-2 py-1 text-[9px] font-bold ${classStyles[attempt.classification]}`}>{attempt.classification} · {attempt.score}</span>
                          </div>
                          <p className="mt-1 text-[10px] text-slate-400">{displayDate(attempt.recordedAt)}</p>
                          {(attempt.summary || attempt.objection) && <p className="mt-2 text-[11px] leading-5 text-slate-600">{attempt.summary || `Objection: ${attempt.objection}`}</p>}
                        </article>
                      ))}
                    </div>
                  </details>
                )}

                <button onClick={() => void saveAssessment()} disabled={saving} className="mt-5 h-12 w-full rounded-full bg-[#c9a227] text-sm font-bold transition hover:bg-[#e4c462] disabled:opacity-60">{saving ? "Scoring and saving…" : `Save response · ${scorePreview?.classification || "Classify"} ${scorePreview?.score ?? ""}`}</button>
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

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b08a16]">Aira conversation playbook</p>
              <h2 className="mt-3 text-3xl font-medium">Helpful, concise and unmistakably AI</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Listen first", "Use short turns, allow interruptions and reflect the buyer's requirement before recommending."],
                  ["One question", "Ask one clear question at a time: location, budget, timeline, purpose and visit intent."],
                  ["Evidence only", "Use approved inventory and CRM data. Never create prices, offers, possession dates or legal claims."],
                  ["Earn the handoff", "Give enough value to clarify the requirement, then connect the right human advisor at the right moment."],
                ].map(([title, text]) => (
                  <article key={title} className="rounded-2xl bg-[#f7f8fa] p-4">
                    <p className="text-xs font-bold">{title}</p>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">{text}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="bg-[#071a2f] p-6 text-white sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#e4c462]">Immediate human handoff</p>
              <h2 className="mt-3 text-3xl font-medium">Know when the agent should stop talking</h2>
              <div className="mt-6 space-y-3">
                {[
                  "The buyer asks to speak with a person",
                  "Intent score reaches 75 or a site visit is requested",
                  "Final price, discount or negotiation is discussed",
                  "RERA, legal, loan or agreement advice is requested",
                  "A complaint, distress signal or opt-out is detected",
                ].map((rule, index) => (
                  <div key={rule} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#c9a227] text-[10px] font-bold text-[#071a2f]">{index + 1}</span>
                    <p className="pt-1 text-xs leading-5 text-white/65">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
