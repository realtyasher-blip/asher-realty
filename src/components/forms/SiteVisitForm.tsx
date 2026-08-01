"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, MessageCircle } from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import { trackEvent } from "@/lib/analytics";
import { readBuyerPreferences } from "@/lib/buyerProfile";

type VisitForm = {
  name: string;
  phone: string;
  project: string;
  location: string;
  budget: string;
  configuration: string;
  purpose: string;
  timeline: string;
  preferred_visit_date: string;
  preferred_visit_time: string;
  transport: string;
  website: string;
  ai_call_consent: boolean;
};

const initial: VisitForm = {
  name: "",
  phone: "",
  project: "",
  location: "",
  budget: "",
  configuration: "",
  purpose: "Self-use",
  timeline: "Within 3 months",
  preferred_visit_date: "",
  preferred_visit_time: "",
  transport: "I will reach the project",
  website: "",
  ai_call_consent: false,
};

const visitBudgetMap: Record<string, string> = {
  "Up to ₹2 Cr": "₹1–2 crore",
  "₹2–3 Cr": "₹2–3 crore",
  "₹3 Cr+": "₹3 crore+",
};

export default function SiteVisitForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "fallback">("idle");
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const requestedProject = params.get("project");
      const project = projects.find(
        (item) => projectSlug(item.name) === requestedProject
      );
      const preferences = readBuyerPreferences();

      setForm((current) => ({
        ...current,
        project: project?.name || current.project,
        location:
          preferences.customized && preferences.corridor !== "Flexible"
            ? preferences.corridor
            : current.location,
        configuration: preferences.customized
          ? `${preferences.configuration} BHK`
          : current.configuration,
        budget:
          preferences.customized && preferences.budget !== "Flexible"
            ? visitBudgetMap[preferences.budget] || current.budget
            : current.budget,
      }));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function update(name: keyof VisitForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    `Hi Asher Realty, I would like to book a site visit.

Name: ${form.name}
Phone: ${form.phone}
Project: ${form.project || "Please recommend"}
Preferred area: ${form.location || "Flexible"}
Configuration: ${form.configuration}
Budget: ${form.budget}
Visit date: ${form.preferred_visit_date}
Visit time: ${form.preferred_visit_time}
Transport: ${form.transport}`
  )}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    trackEvent("site_visit_request", {
      project_name: form.project || "advisor recommendation",
      preferred_location: form.location,
      configuration: form.configuration,
      budget_band: form.budget,
      visit_time: form.preferred_visit_time,
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "site_visit_booking" }),
      });
      setState(response.ok ? "saved" : "fallback");
    } catch {
      setState("fallback");
    }
  }

  if (state === "saved" || state === "fallback") {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(7,26,47,.1)]">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-4xl font-medium text-[#071a2f]">
          {state === "saved" ? "Visit request received" : "Continue on WhatsApp"}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600">
          {state === "saved"
            ? "An Asher Realty advisor will confirm project availability and your visit slot."
            : "Secure CRM storage is being connected. Send the prepared WhatsApp message so the team can confirm your visit."}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-label="Site visit confirmation WhatsApp"
          className="mt-7 inline-flex h-13 items-center justify-center rounded-full bg-[#25D366] px-7 text-sm font-bold text-white"
        >
          <MessageCircle className="mr-2 size-5" />
          Confirm on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setState("idle");
          }}
          className="mt-4 block w-full text-sm font-semibold text-slate-500 hover:text-[#071a2f]"
        >
          Book another visit
        </button>
      </div>
    );
  }

  const inputClass =
    "mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition focus:border-[#c9a227] focus:bg-white";

  return (
    <form
      onSubmit={submit}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(7,26,47,.1)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Full name</span>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Mobile number</span>
          <input required type="tel" pattern="[0-9+\-\s]{8,15}" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-[#071a2f]">Project</span>
          <select value={form.project} onChange={(e) => update("project", e.target.value)} className={inputClass}>
            <option value="">Let Asher Realty recommend</option>
            {projects.map((project) => <option key={project.name}>{project.name}</option>)}
          </select>
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Preferred area</span>
          <input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Whitefield, Sarjapur…" className={inputClass} />
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Configuration</span>
          <select required value={form.configuration} onChange={(e) => update("configuration", e.target.value)} className={inputClass}>
            <option value="">Select home size</option>
            <option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4 BHK or larger</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Budget</span>
          <select required value={form.budget} onChange={(e) => update("budget", e.target.value)} className={inputClass}>
            <option value="">Select budget</option>
            <option>₹50 lakh – ₹1 crore</option><option>₹1–2 crore</option><option>₹2–3 crore</option><option>₹3 crore+</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Visit date</span>
          <input required type="date" min={minDate} value={form.preferred_visit_date} onChange={(e) => update("preferred_visit_date", e.target.value)} className={inputClass} />
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Preferred time</span>
          <select required value={form.preferred_visit_time} onChange={(e) => update("preferred_visit_time", e.target.value)} className={inputClass}>
            <option value="">Select time</option>
            <option>9:00 AM – 11:00 AM</option><option>11:00 AM – 1:00 PM</option><option>2:00 PM – 4:00 PM</option><option>4:00 PM – 6:00 PM</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Buying for</span>
          <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)} className={inputClass}>
            <option>Self-use</option><option>Investment</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-semibold text-[#071a2f]">Transport</span>
          <select value={form.transport} onChange={(e) => update("transport", e.target.value)} className={inputClass}>
            <option>I will reach the project</option><option>Please discuss pickup assistance</option>
          </select>
        </label>
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          className="hidden"
        />
      </div>
      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4 text-left">
        <input
          type="checkbox"
          checked={form.ai_call_consent}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              ai_call_consent: e.target.checked,
            }))
          }
          className="mt-0.5 size-4 accent-[#c9a227]"
        />
        <span className="text-[11px] leading-5 text-slate-500">
          I agree to receive a site-visit coordination call from Asher Realty,
          including from its clearly identified virtual assistant. This is
          optional and can be withdrawn at any time.
        </span>
      </label>
      <button
        disabled={state === "saving"}
        type="submit"
        className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#c9a227] px-8 font-bold text-[#071a2f] transition hover:bg-[#e4c462] disabled:opacity-60"
      >
        <CalendarCheck className="mr-2 size-5" />
        {state === "saving" ? "Securing your request…" : "Request Site Visit"}
      </button>
      <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
        Your details are used only to coordinate this property enquiry. The visit
        is confirmed after inventory and project-team availability are checked.
      </p>
    </form>
  );
}
