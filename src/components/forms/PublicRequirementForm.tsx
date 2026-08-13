"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { trackEvent } from "@/lib/analytics";

type RequirementMode = "rent" | "resale";

const popularAreas = [
  "Whitefield / ITPL",
  "ORR / Bellandur",
  "Manyata / Hebbal",
  "Electronic City",
  "Sarjapur Road",
  "Airport / Devanahalli",
];

const initial = {
  name: "",
  phone: "",
  location: "",
  configuration: "",
  budget: "",
  timeline: "",
  furnishing: "",
  parking: "",
  household: "",
  pets: "",
  propertyType: "",
  occupancyPreference: "",
  propertyAgePreference: "",
  loanRequirement: "",
  contactConsent: false,
  website: "",
};

export default function PublicRequirementForm({ mode }: { mode: RequirementMode }) {
  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "fallback">("idle");
  const [error, setError] = useState("");
  const rental = mode === "rent";

  function update(name: keyof typeof initial, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  const roleDetails = useMemo(() => {
    const pairs = rental
      ? [
          ["Furnishing", form.furnishing],
          ["Parking", form.parking],
          ["Household", form.household],
          ["Pets", form.pets],
        ]
      : [
          ["Property type", form.propertyType],
          ["Occupancy", form.occupancyPreference],
          ["Property age", form.propertyAgePreference],
          ["Loan support", form.loanRequirement],
        ];
    return pairs.filter(([, value]) => value);
  }, [form, rental]);

  const requirementDetails = [
    `${rental ? "TENANT" : "RESALE BUYER"} REQUIREMENT — PRIVATE ASSISTED MATCHING`,
    `Preferred area / work hub: ${form.location}`,
    `Configuration: ${form.configuration}`,
    `Budget: ${form.budget}`,
    `Timeline: ${form.timeline}`,
    ...roleDetails.map(([label, value]) => `${label}: ${value}`),
    "Contact permission applies only to this property requirement.",
  ].join("\n");

  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    `Hi Asher Realty, I am looking for a ${rental ? "rental home" : "resale home"} in Bengaluru.\n\nName: ${form.name}\nPhone: ${form.phone}\n${requirementDetails}`
  )}`;

  function continueToContact() {
    if (!form.location.trim() || !form.configuration || !form.budget.trim() || !form.timeline) {
      setError("Add the area, home size, budget and timeline to continue.");
      return;
    }
    trackEvent("requirement_step_completed", { form_name: `${mode}_requirement`, step: 1 });
    setStep(1);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.contactConsent) {
      setError("Please allow us to respond to this specific requirement.");
      return;
    }
    setState("saving");
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          location: form.location,
          configuration: form.configuration,
          budget: form.budget,
          timeline: form.timeline,
          contactConsent: form.contactConsent,
          website: form.website,
          requirementDetails,
          source: rental ? "rental_requirement" : "resale_requirement",
          purpose: rental ? "Tenant requirement" : "Resale purchase",
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (response.ok) {
        setState("saved");
        trackEvent("generate_lead", { form_name: `${mode}_requirement` });
      } else if (response.status >= 500) {
        setState("fallback");
      } else {
        setState("idle");
        setError(result.error || "Please review the required details and try again.");
      }
    } catch {
      setState("fallback");
    }
  }

  if (state === "saved" || state === "fallback") {
    return (
      <div aria-live="polite" className="rounded-[1.75rem] border border-slate-200 bg-white p-7 text-center shadow-[0_20px_65px_rgba(7,26,47,.1)]">
        {state === "saved" ? (
          <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
        ) : (
          <AlertTriangle className="mx-auto size-12 text-amber-600" />
        )}
        <h3 className="mt-5 text-3xl font-medium text-[#071a2f]">
          {state === "saved" ? "Your brief is with the advisor desk" : "Continue on WhatsApp"}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {state === "saved"
            ? "We will review the requirement before suggesting the next useful options. Availability is confirmed before a visit is proposed."
            : "Secure storage is temporarily unavailable. Send the prepared brief to reach the team immediately."}
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#25D366] px-6 text-sm font-bold text-white">
          <MessageCircle className="mr-2 size-4" /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  const fieldClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition focus:border-[#c9a227] focus:bg-white";

  return (
    <form onSubmit={submit} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_65px_rgba(7,26,47,.1)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">Private requirement brief</p>
          <h3 className="mt-2 text-3xl font-medium text-[#071a2f]">{step === 0 ? "Build your brief." : "Where should we respond?"}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-[#071a2f] px-3 py-2 text-[10px] font-bold text-[#e4c462]">{step + 1} of 2</span>
      </div>

      {step === 0 ? (
        <div className="mt-6">
          <p className="flex items-center gap-2 text-xs font-bold text-[#071a2f]"><MapPin className="size-4 text-[#a47b10]" /> Popular Bengaluru starting points</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularAreas.map((area) => (
              <button key={area} type="button" onClick={() => update("location", area)} className={`rounded-full border px-3 py-2 text-[10px] font-bold transition ${form.location === area ? "border-[#c9a227] bg-[#fff6d8] text-[#071a2f]" : "border-slate-200 text-slate-500 hover:border-[#c9a227]/50"}`}>
                {area}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="text-xs font-bold">Preferred locality or work hub*</span><input required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Area, metro station or work hub" className={fieldClass} /></label>
            <label><span className="text-xs font-bold">Home size*</span><select required value={form.configuration} onChange={(e) => update("configuration", e.target.value)} className={fieldClass}><option value="">Select</option><option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4+ BHK</option><option>Villa</option></select></label>
            <label><span className="text-xs font-bold">{rental ? "Monthly budget*" : "Purchase budget*"}</span><input required value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder={rental ? "e.g. ₹45,000" : "e.g. ₹1.5 crore"} className={fieldClass} /></label>
            <label className="sm:col-span-2"><span className="text-xs font-bold">Move or purchase timeline*</span><select required value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={fieldClass}><option value="">Select</option><option>Immediately</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>Just exploring</option></select></label>
            {rental ? (
              <>
                <label><span className="text-xs font-bold">Furnishing</span><select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)} className={fieldClass}><option value="">Flexible</option><option>Unfurnished</option><option>Semi-furnished</option><option>Fully furnished</option></select></label>
                <label><span className="text-xs font-bold">Parking</span><select value={form.parking} onChange={(e) => update("parking", e.target.value)} className={fieldClass}><option value="">Flexible</option><option>Required</option><option>Not required</option><option>Two cars</option></select></label>
                <label><span className="text-xs font-bold">Household</span><select value={form.household} onChange={(e) => update("household", e.target.value)} className={fieldClass}><option value="">Prefer not to say</option><option>Individual</option><option>Couple</option><option>Family</option><option>Shared home</option></select></label>
                <label><span className="text-xs font-bold">Pets</span><select value={form.pets} onChange={(e) => update("pets", e.target.value)} className={fieldClass}><option value="">No preference</option><option>Pet-friendly needed</option><option>No pets</option></select></label>
              </>
            ) : (
              <>
                <label><span className="text-xs font-bold">Property type</span><select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={fieldClass}><option value="">Flexible</option><option>Apartment</option><option>Villa</option><option>Independent house</option></select></label>
                <label><span className="text-xs font-bold">Occupancy</span><select value={form.occupancyPreference} onChange={(e) => update("occupancyPreference", e.target.value)} className={fieldClass}><option value="">Flexible</option><option>Vacant / ready to move</option><option>Owner occupied</option><option>Tenant occupied</option></select></label>
                <label><span className="text-xs font-bold">Property age</span><select value={form.propertyAgePreference} onChange={(e) => update("propertyAgePreference", e.target.value)} className={fieldClass}><option value="">Flexible</option><option>Up to 5 years</option><option>5–10 years</option><option>Open to older homes</option></select></label>
                <label><span className="text-xs font-bold">Home-loan support</span><select value={form.loanRequirement} onChange={(e) => update("loanRequirement", e.target.value)} className={fieldClass}><option value="">Not decided</option><option>Required</option><option>Pre-approved</option><option>Not required</option></select></label>
              </>
            )}
          </div>
          {error && <p className="mt-4 text-xs font-semibold text-rose-600" aria-live="polite">{error}</p>}
          <button type="button" onClick={continueToContact} className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#071a2f] px-6 text-sm font-bold text-white">
            Continue to contact <ArrowRight className="ml-2 size-4 text-[#e4c462]" />
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div className="rounded-2xl bg-[#071a2f] p-5 text-white">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]"><Sparkles className="size-4" /> Your clear brief</p>
            <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
              <p><span className="text-white/40">Where</span><span className="mt-1 block font-semibold">{form.location}</span></p>
              <p><span className="text-white/40">Home</span><span className="mt-1 block font-semibold">{form.configuration}</span></p>
              <p><span className="text-white/40">Budget</span><span className="mt-1 block font-semibold">{form.budget}</span></p>
              <p><span className="text-white/40">Timeline</span><span className="mt-1 block font-semibold">{form.timeline}</span></p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label><span className="text-xs font-bold">Full name*</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} className={fieldClass} /></label>
            <label><span className="text-xs font-bold">Mobile number*</span><input required type="tel" pattern="[0-9+\-\s]{8,15}" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={fieldClass} /></label>
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" />
          </div>
          <label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f7f8fa] p-4">
            <input type="checkbox" checked={form.contactConsent} onChange={(e) => update("contactConsent", e.target.checked)} className="mt-0.5 size-4 accent-[#c9a227]" />
            <span className="text-[11px] leading-5 text-slate-500">I agree to be contacted about this specific requirement. This does not opt me into unrelated promotional calls.</span>
          </label>
          {error && <p className="mt-4 text-xs font-semibold text-rose-600" aria-live="polite">{error}</p>}
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => { setStep(0); setError(""); }} className="inline-flex h-13 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-bold text-[#071a2f]"><ArrowLeft className="mr-2 size-4" /> Back</button>
            <button disabled={state === "saving"} type="submit" className="inline-flex h-13 flex-1 items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] disabled:opacity-60">
              {state === "saving" ? "Sending…" : "Ask Asher to shortlist"}<ArrowRight className="ml-2 size-4" />
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
