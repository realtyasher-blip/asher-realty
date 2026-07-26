"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  LogOut,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { leadStatuses, type Lead, type LeadStatus } from "@/lib/crm/types";

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
  }).format(new Date(value));
}

export default function CrmDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/crm/leads", { cache: "no-store" });
    if (response.status === 401) {
      window.location.reload();
      return;
    }
    const data = (await response.json()) as { leads?: Lead[] };
    setLeads(data.leads || []);
    setSelected((current) =>
      current ? data.leads?.find((lead) => lead.id === current.id) || null : null
    );
    setLoading(false);
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => void load());
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return leads.filter(
      (lead) =>
        (filter === "All" || lead.status === filter) &&
        (!term ||
          [lead.name, lead.phone, lead.project, lead.location, lead.source]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term))
    );
  }, [filter, leads, query]);

  const stats = {
    total: leads.length,
    new: leads.filter((lead) => lead.status === "New").length,
    visits: leads.filter((lead) => lead.status.includes("Site visit")).length,
    booked: leads.filter((lead) => lead.status === "Booked").length,
  };

  async function save() {
    if (!selected) return;
    setSaving(true);
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
    if (response.ok) await load();
    setSaving(false);
  }

  async function logout() {
    await fetch("/api/crm/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#071a2f]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b08a16]">Asher Realty</p>
            <h1 className="mt-1 text-3xl font-medium">Lead operations</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void load()} className="flex size-11 items-center justify-center rounded-full border border-slate-200" aria-label="Refresh leads">
              <RefreshCw className="size-4" />
            </button>
            <button onClick={logout} className="flex size-11 items-center justify-center rounded-full border border-slate-200" aria-label="Sign out">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Users, label: "Total leads", value: stats.total },
            { icon: MessageCircle, label: "New", value: stats.new },
            { icon: CalendarClock, label: "Visit pipeline", value: stats.visits },
            { icon: CheckCircle2, label: "Booked", value: stats.booked },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <Icon className="size-5 text-[#b08a16]" />
              <p className="mt-4 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
          <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[1fr_220px]">
              <label className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, project or area" className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-11 pr-4 text-sm outline-none focus:border-[#c9a227]" />
              </label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm outline-none">
                <option>All</option>
                {leadStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>

            {loading ? (
              <p className="p-10 text-center text-sm text-slate-400">Loading leads…</p>
            ) : filtered.length === 0 ? (
              <p className="p-10 text-center text-sm text-slate-400">No matching leads yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className={`grid w-full gap-3 p-5 text-left transition hover:bg-[#f7f8fa] sm:grid-cols-[1fr_1fr_160px] ${
                      selected?.id === lead.id ? "bg-[#fff9e5]" : ""
                    }`}
                  >
                    <span>
                      <span className="block font-bold">{lead.name}</span>
                      <span className="mt-1 block text-xs text-slate-400">{lead.phone} · {lead.source}</span>
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{lead.project || lead.location || "General enquiry"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{lead.budget || "Budget not shared"}</span>
                    </span>
                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold">{lead.status}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
            {!selected ? (
              <div className="flex min-h-[420px] items-center justify-center text-center text-sm leading-7 text-slate-400">
                Select a lead to view requirements, plan follow-up and update status.
              </div>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#b08a16]">Lead details</p>
                <h2 className="mt-3 text-3xl font-medium">{selected.name}</h2>
                <div className="mt-5 flex gap-2">
                  <a href={`tel:${selected.phone}`} className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#071a2f] text-sm font-bold text-white">
                    <Phone className="mr-2 size-4" /> Call
                  </a>
                  <a href={`https://wa.me/91${selected.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer" className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#25D366] text-sm font-bold text-white">
                    <MessageCircle className="mr-2 size-4" /> WhatsApp
                  </a>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs">
                  {[
                    ["Project", selected.project],
                    ["Location", selected.location],
                    ["Configuration", selected.configuration],
                    ["Budget", selected.budget],
                    ["Purpose", selected.purpose],
                    ["Timeline", selected.timeline],
                    ["Visit date", selected.preferred_visit_date],
                    ["Visit time", selected.preferred_visit_time],
                    ["Created", formatDate(selected.created_at)],
                  ].map(([label, value]) => (
                    <div key={label || ""}>
                      <dt className="text-slate-400">{label}</dt>
                      <dd className="mt-1 font-semibold">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
                <label className="mt-6 block text-xs font-bold">
                  Status
                  <select
                    value={selected.status}
                    onChange={(e) => setSelected({ ...selected, status: e.target.value as LeadStatus })}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-sm"
                  >
                    {leadStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="mt-4 block text-xs font-bold">
                  Follow-up date and time
                  <input
                    type="datetime-local"
                    value={selected.follow_up_at?.slice(0, 16) || ""}
                    onChange={(e) => setSelected({ ...selected, follow_up_at: e.target.value || null })}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-3 text-sm"
                  />
                </label>
                <label className="mt-4 block text-xs font-bold">
                  Notes
                  <textarea
                    rows={5}
                    value={selected.notes || ""}
                    onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] p-3 text-sm outline-none focus:border-[#c9a227]"
                  />
                </label>
                <button onClick={save} disabled={saving} className="mt-5 h-12 w-full rounded-full bg-[#c9a227] text-sm font-bold disabled:opacity-60">
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

