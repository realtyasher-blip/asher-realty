"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

import { trackEvent } from "@/lib/analytics";

type RequirementMode = "rent" | "resale";

const initial = {
  name: "",
  phone: "",
  location: "",
  configuration: "",
  budget: "",
  timeline: "",
  contactConsent: false,
  website: "",
};

export default function PublicRequirementForm({ mode }: { mode: RequirementMode }) {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "fallback">("idle");
  const [error, setError] = useState("");

  function update(name: keyof typeof initial, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    `Hi Asher Realty, I am looking for a ${mode === "rent" ? "rental home" : "resale home"} in Bengaluru.

Name: ${form.name}
Phone: ${form.phone}
Preferred area: ${form.location}
Configuration: ${form.configuration}
Budget: ${form.budget}
Timeline: ${form.timeline}`
  )}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.contactConsent) {
      setError("Please allow us to respond to this specific requirement.");
      return;
    }
    setState("saving");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: mode === "rent" ? "rental_requirement" : "resale_requirement",
          purpose: mode === "rent" ? "Tenant requirement" : "Resale purchase",
        }),
      });
      setState(response.ok ? "saved" : "fallback");
      if (response.ok) {
        trackEvent("generate_lead", { form_name: `${mode}_requirement` });
      }
    } catch {
      setState("fallback");
    }
  }

  if (state === "saved" || state === "fallback") {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 text-center shadow-[0_20px_65px_rgba(7,26,47,.1)]">
        <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
        <h3 className="mt-5 text-3xl font-medium text-[#071a2f]">
          {state === "saved" ? "Requirement received" : "Continue on WhatsApp"}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {state === "saved"
            ? "An Asher advisor will review matching options and contact you for the missing details."
            : "Send the prepared summary to reach the team immediately."}
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#25D366] px-6 text-sm font-bold text-white">
          <MessageCircle className="mr-2 size-4" /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  const fieldClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm outline-none transition focus:border-[#c9a227] focus:bg-white";

  return (
    <form onSubmit={submit} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_65px_rgba(7,26,47,.1)] sm:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">Private requirement brief</p>
      <h3 className="mt-3 text-3xl font-medium text-[#071a2f]">Tell us the essentials.</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label><span className="text-xs font-bold">Full name*</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} className={fieldClass} /></label>
        <label><span className="text-xs font-bold">Mobile number*</span><input required type="tel" pattern="[0-9+\-\s]{8,15}" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={fieldClass} /></label>
        <label className="sm:col-span-2"><span className="text-xs font-bold">Preferred locality or work hub*</span><input required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Whitefield, Manyata, Electronic City…" className={fieldClass} /></label>
        <label><span className="text-xs font-bold">Home size*</span><select required value={form.configuration} onChange={(e) => update("configuration", e.target.value)} className={fieldClass}><option value="">Select</option><option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4+ BHK</option><option>Villa</option></select></label>
        <label><span className="text-xs font-bold">{mode === "rent" ? "Monthly budget*" : "Purchase budget*"}</span><input required value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder={mode === "rent" ? "e.g. ₹45,000" : "e.g. ₹1.5 crore"} className={fieldClass} /></label>
        <label className="sm:col-span-2"><span className="text-xs font-bold">Move or purchase timeline*</span><select required value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={fieldClass}><option value="">Select</option><option>Immediately</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>Just exploring</option></select></label>
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" />
      </div>
      <label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f7f8fa] p-4">
        <input type="checkbox" checked={form.contactConsent} onChange={(e) => update("contactConsent", e.target.checked)} className="mt-0.5 size-4 accent-[#c9a227]" />
        <span className="text-[11px] leading-5 text-slate-500">I agree to be contacted about this specific requirement. This does not opt me into unrelated promotional calls.</span>
      </label>
      {error && <p className="mt-4 text-xs font-semibold text-rose-600" aria-live="polite">{error}</p>}
      <button disabled={state === "saving"} type="submit" className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] disabled:opacity-60">
        {state === "saving" ? "Sending…" : "Ask Asher to shortlist"}<ArrowRight className="ml-2 size-4" />
      </button>
    </form>
  );
}
