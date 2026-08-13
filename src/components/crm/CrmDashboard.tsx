"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { leadStatuses, type Lead, type LeadStatus } from "@/lib/crm/types";
import {
  callingSummary,
  mergeCallingProfile,
  parseCallingProfile,
  stripCallingData,
} from "@/lib/crm/calling";
import { propertySubmissionReference } from "@/lib/listings/reference";
import {
  mergePropertySubmissionIntake,
  propertySubmissionIntake,
  stripPropertySubmissionIntake,
} from "@/lib/listings/intake";

const completedStatuses: LeadStatus[] = ["Booked", "Not interested"];

const statusStyles: Record<LeadStatus, string> = {
  New: "bg-blue-50 text-blue-700",
  Contacted: "bg-violet-50 text-violet-700",
  Qualified: "bg-cyan-50 text-cyan-700",
  "Site visit scheduled": "bg-amber-50 text-amber-700",
  "Site visit completed": "bg-orange-50 text-orange-700",
  Negotiation: "bg-fuchsia-50 text-fuchsia-700",
  Booked: "bg-emerald-50 text-emerald-700",
  "Follow up later": "bg-slate-100 text-slate-700",
  "Not interested": "bg-rose-50 text-rose-700",
};

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  const source = new Date(value);
  const india = new Date(source.getTime() + 5.5 * 60 * 60 * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = `${india.getUTCDate()} ${months[india.getUTCMonth()]} ${india.getUTCFullYear()}`;
  if (!value.includes("T")) return date;
  const hours = india.getUTCHours();
  const minutes = String(india.getUTCMinutes()).padStart(2, "0");
  return `${date}, ${hours % 12 || 12}:${minutes} ${hours >= 12 ? "pm" : "am"}`;
}

function sourceLabel(source: string) {
  const labels: Record<string, string> = {
    owner_property_submission: "Owner property",
    rental_requirement: "Tenant search",
    resale_requirement: "Resale buyer",
    property_consultation: "Buyer consultation",
    site_visit_booking: "Site visit",
    excel_contact_import: "Imported contact",
  };
  return labels[source] || source.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function whatsappPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function csvCell(value: unknown) {
  const raw = String(value ?? "");
  const safe = /^[=+\-@]/u.test(raw.trimStart()) ? `'${raw}` : raw;
  return `"${safe.replaceAll('"', '""')}"`;
}

function isOwnerLead(lead: Lead) {
  return lead.source === "owner_property_submission";
}

function statusLabel(lead: Lead) {
  if (!isOwnerLead(lead)) return lead.status;
  const labels: Partial<Record<LeadStatus, string>> = {
    New: "Awaiting owner review",
    Contacted: "Owner contacted",
    Qualified: "Property facts reviewed",
    "Site visit scheduled": "Viewing scheduled",
    "Site visit completed": "Viewing completed",
    Booked: "Closed",
    "Not interested": "Rejected / withdrawn",
  };
  return labels[lead.status] || lead.status;
}

type CrmDashboardProps = {
  initialLeads: Lead[];
  initialError?: string;
  initialNow: number;
};

export default function CrmDashboard({
  initialLeads,
  initialError = "",
  initialNow,
}: CrmDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All people");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(initialError);
  const [now, setNow] = useState(initialNow);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/crm/leads", { cache: "no-store" });
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      const data = (await response.json()) as { leads?: Lead[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to load leads.");
      setLeads(data.leads || []);
      setNow(Date.now());
      setSelected((current) =>
        current
          ? data.leads?.find((lead) => lead.id === current.id) || null
          : null
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load leads."
      );
    } finally {
      setLoading(false);
    }
  }

  const dueFollowUps = useMemo(
    () =>
      leads
        .filter(
          (lead) =>
            lead.follow_up_at &&
            new Date(lead.follow_up_at).getTime() <= now &&
            !completedStatuses.includes(lead.status)
        )
        .sort(
          (a, b) =>
            new Date(a.follow_up_at || 0).getTime() -
            new Date(b.follow_up_at || 0).getTime()
        ),
    [leads, now]
  );

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Follow-ups due"
          ? Boolean(
              lead.follow_up_at &&
                new Date(lead.follow_up_at).getTime() <= now &&
                !completedStatuses.includes(lead.status)
            )
          : lead.status === filter);
      const matchesQuery =
        !term ||
        [
          lead.name,
          lead.id,
          lead.phone,
          lead.project,
          lead.location,
          lead.source,
          lead.budget,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesSource =
        sourceFilter === "All people" ||
        (sourceFilter === "Owners" && lead.source === "owner_property_submission") ||
        (sourceFilter === "Tenants" && lead.source === "rental_requirement") ||
        (sourceFilter === "Resale buyers" && lead.source === "resale_requirement") ||
        (sourceFilter === "Buyers" && ["property_consultation", "site_visit_booking", "website"].includes(lead.source)) ||
        (sourceFilter === "Imported" && lead.source === "excel_contact_import");
      return matchesFilter && matchesQuery && matchesSource;
    });
  }, [filter, leads, now, query, sourceFilter]);

  const stats = {
    total: leads.length,
    new: leads.filter((lead) => lead.status === "New").length,
    due: dueFollowUps.length,
    booked: leads.filter((lead) => lead.status === "Booked").length,
  };

  const sources = useMemo(() => {
    const counts = leads.reduce<Record<string, number>>((result, lead) => {
      result[lead.source] = (result[lead.source] || 0) + 1;
      return result;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [leads]);

  async function save() {
    if (!selected) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          status: selected.status,
          follow_up_at: selected.follow_up_at || null,
          notes: selected.notes || "",
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to save changes.");
      setMessage("Lead updated successfully.");
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  function exportLeads() {
    const columns = [
      "Created",
      "Name",
      "Phone",
      "Email",
      "Source",
      "Project",
      "Location",
      "Configuration",
      "Budget",
      "Purpose",
      "Timeline",
      "Visit date",
      "Visit time",
      "Status",
      "Follow-up",
      "Calling permission",
      "Prospect class",
      "Lead score",
      "Call outcome",
      "Last call",
      "Call summary",
      "Notes",
    ];
    const rows = leads.map((lead) => {
      const { profile, latest } = callingSummary(lead);
      return [
        lead.created_at,
        lead.name,
        lead.phone,
        lead.email,
        lead.source,
        lead.project,
        lead.location,
        lead.configuration,
        lead.budget,
        lead.purpose,
        lead.timeline,
        lead.preferred_visit_date,
        lead.preferred_visit_time,
        lead.status,
        lead.follow_up_at,
        profile.consentStatus,
        latest?.classification,
        latest?.score,
        latest?.outcome,
        latest?.recordedAt,
        latest?.summary,
        stripCallingData(lead.notes),
      ]
        .map(csvCell)
        .join(",");
    });
    const blob = new Blob(
      [`\uFEFF${columns.map(csvCell).join(",")}\n${rows.join("\n")}`],
      { type: "text/csv;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asher-realty-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/crm/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#071a2f]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b08a16]">
              Asher Realty operations
            </p>
            <h1 className="mt-1 text-3xl font-medium">Sales cockpit</h1>
            <p className="mt-1 text-xs text-slate-400">
              Leads, site visits and follow-ups in one workspace
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/crm/calling"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#fff9e5] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#c9a227]"
            >
              <Bot className="mr-2 size-4" /> AI Calling
            </a>
            <a
              href="/api/crm/export"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white transition hover:bg-[#17324e]"
            >
              <Download className="mr-2 size-4" /> Download Excel
            </a>
            <button
              onClick={exportLeads}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-xs font-bold transition hover:border-[#c9a227]"
            >
              <Download className="mr-2 size-4" /> Download CSV
            </button>
            <button
              onClick={() => void load()}
              className="flex size-11 items-center justify-center rounded-full border border-slate-200"
              aria-label="Refresh leads"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={logout}
              className="flex size-11 items-center justify-center rounded-full border border-slate-200"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8">
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="size-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Users,
              label: "Total leads",
              value: stats.total,
              detail: "All website enquiries",
            },
            {
              icon: MessageCircle,
              label: "New",
              value: stats.new,
              detail: "Waiting for first contact",
            },
            {
              icon: Clock3,
              label: "Follow-ups due",
              value: stats.due,
              detail: "Action required now",
            },
            {
              icon: CheckCircle2,
              label: "Booked",
              value: stats.booked,
              detail: "Converted opportunities",
            },
          ].map(({ icon: Icon, label, value, detail }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-[#b08a16]" />
                <span className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-300">
                  Live
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-xs font-semibold">{label}</p>
              <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <section className="rounded-2xl border border-slate-200 bg-[#071a2f] p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#e4c462]">
                  Priority queue
                </p>
                <h2 className="mt-2 text-2xl font-medium">Follow-ups requiring attention</h2>
              </div>
              <CalendarClock className="size-6 text-[#e4c462]" />
            </div>
            {dueFollowUps.length === 0 ? (
              <p className="mt-5 text-sm text-white/55">
                You are all caught up. Schedule the next follow-up from any lead.
              </p>
            ) : (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {dueFollowUps.slice(0, 4).map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
                  >
                    <span>
                      <span className="block text-sm font-bold">{lead.name}</span>
                      <span className="mt-1 block text-[11px] text-white/50">
                        Due {formatDate(lead.follow_up_at)}
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-[#e4c462]" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#b08a16]">
                  Lead sources
                </p>
                <h2 className="mt-2 text-xl font-medium">Acquisition mix</h2>
              </div>
              <BarChart3 className="size-5 text-[#b08a16]" />
            </div>
            <div className="mt-4 space-y-3">
              {sources.length === 0 ? (
                <p className="text-xs text-slate-400">Lead-source data will appear here.</p>
              ) : (
                sources.map(([source, count]) => (
                  <div key={source}>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold">{sourceLabel(source)}</span>
                      <span className="text-slate-400">{count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#c9a227]"
                        style={{ width: `${Math.max(8, (count / stats.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
          <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[1fr_190px_190px]">
              <label className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, phone, project or area"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-11 pr-4 text-sm outline-none focus:border-[#c9a227]"
                />
              </label>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm outline-none"
              >
                <option>All</option>
                <option>Follow-ups due</option>
                {leadStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value)}
                aria-label="Filter by lead type"
                className="h-11 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm outline-none"
              >
                <option>All people</option>
                <option>Owners</option>
                <option>Tenants</option>
                <option>Resale buyers</option>
                <option>Buyers</option>
                <option>Imported</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-[11px] text-slate-400">
              <span>{filtered.length} matching leads</span>
              <span>Newest first</span>
            </div>

            {loading ? (
              <p className="p-10 text-center text-sm text-slate-400">Loading leads…</p>
            ) : filtered.length === 0 ? (
              <p className="p-10 text-center text-sm text-slate-400">
                No matching leads yet.
              </p>
            ) : (
              <div className="max-h-[720px] divide-y divide-slate-100 overflow-y-auto">
                {filtered.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setSelected(lead);
                      setMessage("");
                    }}
                    className={`grid w-full gap-3 p-5 text-left transition hover:bg-[#f7f8fa] sm:grid-cols-[1.1fr_1fr_170px] ${
                      selected?.id === lead.id ? "bg-[#fff9e5]" : ""
                    }`}
                  >
                    <span>
                      <span className="block font-bold">{lead.name}</span>
                      <span className="mt-1 block text-xs text-slate-400">
                        {lead.phone} · {sourceLabel(lead.source)}
                      </span>
                      {isOwnerLead(lead) && (
                        <span className="mt-2 inline-flex rounded-full bg-[#fff3c4] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-[#8a6710]">
                          Review required · {propertySubmissionReference(lead.id)}
                        </span>
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {lead.project || lead.location || "General enquiry"}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        {lead.location && <MapPin className="size-3" />}
                        {lead.location || lead.budget || "Requirement review pending"}
                      </span>
                    </span>
                    <span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold ${statusStyles[lead.status]}`}
                      >
                        {statusLabel(lead)}
                      </span>
                      <span className="mt-2 block text-[10px] text-slate-400">
                        {formatDate(lead.created_at)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="self-start rounded-[1.5rem] border border-slate-200 bg-white p-6 xl:sticky xl:top-6">
            {!selected ? (
              <div className="flex min-h-[480px] items-center justify-center text-center text-sm leading-7 text-slate-400">
                Select a lead to view requirements, plan the next follow-up and
                update the sales stage.
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#b08a16]">
                      Lead details
                    </p>
                    <h2 className="mt-3 text-3xl font-medium">{selected.name}</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Added {formatDate(selected.created_at)}
                    </p>
                    {isOwnerLead(selected) && (
                      <p className="mt-2 font-mono text-xs font-bold text-[#9a7410]">
                        {propertySubmissionReference(selected.id)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${statusStyles[selected.status]}`}
                  >
                    {statusLabel(selected)}
                  </span>
                </div>

                <div className="mt-5 flex gap-2">
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#071a2f] text-sm font-bold text-white"
                  >
                    <Phone className="mr-2 size-4" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${whatsappPhone(selected.phone)}?text=${encodeURIComponent(
                      isOwnerLead(selected)
                        ? `Hi ${selected.name}, this is Asher Realty regarding your ${selected.purpose === "Owner rental" ? "rental" : "resale"} property submission${selected.project ? ` for ${selected.project}` : ""}. Reference: ${propertySubmissionReference(selected.id)}.`
                        : `Hi ${selected.name}, this is Asher Realty regarding your property enquiry${selected.project ? ` for ${selected.project}` : ""}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#25D366] text-sm font-bold text-white"
                  >
                    <MessageCircle className="mr-2 size-4" /> WhatsApp
                  </a>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#f7f8fa] p-4 text-xs">
                  {[
                    ["Project", selected.project],
                    ["Location", selected.location],
                    ["Configuration", selected.configuration],
                    ["Budget", selected.budget],
                    ["Purpose", selected.purpose],
                    ["Timeline", selected.timeline],
                    ["Visit date", selected.preferred_visit_date],
                    ["Visit time", selected.preferred_visit_time],
                    ["Transport", selected.transport],
                    ["Source", sourceLabel(selected.source)],
                  ].map(([label, value]) => (
                    <div key={label || ""}>
                      <dt className="text-slate-400">{label}</dt>
                      <dd className="mt-1 font-semibold">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>

                {isOwnerLead(selected) && propertySubmissionIntake(selected.notes) && (
                  <section className="mt-5 rounded-2xl border border-[#c9a227]/25 bg-[#fff9e8] p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#9a7410]">Read-only owner intake</p>
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-[11px] leading-6 text-slate-600">
                      {propertySubmissionIntake(selected.notes)}
                    </pre>
                  </section>
                )}

                <label className="mt-6 block text-xs font-bold">
                  Sales stage
                  <select
                    value={selected.status}
                    onChange={(event) =>
                      setSelected({
                        ...selected,
                        status: event.target.value as LeadStatus,
                      })
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-sm"
                  >
                    {leadStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-xs font-bold">
                  Next follow-up
                  <input
                    type="datetime-local"
                    value={selected.follow_up_at?.slice(0, 16) || ""}
                    onChange={(event) =>
                      setSelected({
                        ...selected,
                        follow_up_at: event.target.value || null,
                      })
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-sm"
                  />
                </label>

                <label className="mt-4 block text-xs font-bold">
                  Conversation notes
                  <textarea
                    rows={5}
                    value={stripPropertySubmissionIntake(stripCallingData(selected.notes))}
                    onChange={(event) =>
                      setSelected({
                        ...selected,
                        notes: mergeCallingProfile(
                          mergePropertySubmissionIntake(
                            event.target.value,
                            propertySubmissionIntake(selected.notes)
                          ),
                          parseCallingProfile(selected.notes)
                        ),
                      })
                    }
                    placeholder="Add requirements, objections, visit feedback and next steps…"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] p-3 text-sm outline-none focus:border-[#c9a227]"
                  />
                </label>

                {message && (
                  <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700">
                    {message}
                  </p>
                )}

                <button
                  onClick={save}
                  disabled={saving}
                  className="mt-5 h-12 w-full rounded-full bg-[#c9a227] text-sm font-bold transition hover:bg-[#e4c462] disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save lead updates"}
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
