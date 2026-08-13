"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { trackEvent } from "@/lib/analytics";

type SubmissionForm = {
  intent: "Sell" | "Rent out" | "";
  ownerRole: "Owner" | "Power of attorney holder" | "Authorised representative";
  propertyType: string;
  projectName: string;
  locality: string;
  pincode: string;
  configuration: string;
  bathrooms: string;
  areaValue: string;
  areaBasis: string;
  furnishing: string;
  floor: string;
  totalFloors: string;
  parking: string;
  propertyAge: string;
  expectedPrice: string;
  monthlyRent: string;
  maintenance: string;
  deposit: string;
  availableFrom: string;
  occupancy: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  contactPreference: string;
  authorityDeclaration: boolean;
  accuracyDeclaration: boolean;
  contactConsent: boolean;
  website: string;
};

const initialForm: SubmissionForm = {
  intent: "",
  ownerRole: "Owner",
  propertyType: "Apartment",
  projectName: "",
  locality: "",
  pincode: "",
  configuration: "",
  bathrooms: "",
  areaValue: "",
  areaBasis: "Carpet area",
  furnishing: "",
  floor: "",
  totalFloors: "",
  parking: "",
  propertyAge: "",
  expectedPrice: "",
  monthlyRent: "",
  maintenance: "",
  deposit: "",
  availableFrom: "",
  occupancy: "",
  description: "",
  name: "",
  phone: "",
  email: "",
  contactPreference: "Phone or WhatsApp",
  authorityDeclaration: false,
  accuracyDeclaration: false,
  contactConsent: false,
  website: "",
};

const steps = ["Your intent", "Property", "Commercials", "Contact & review"];
const DRAFT_KEY = "asher:owner-property-draft:v1";

type PropertyDraft = Omit<
  SubmissionForm,
  | "name"
  | "phone"
  | "email"
  | "description"
  | "authorityDeclaration"
  | "accuracyDeclaration"
  | "contactConsent"
  | "website"
>;

function safeDraft(form: SubmissionForm): PropertyDraft {
  return {
    intent: form.intent,
    ownerRole: form.ownerRole,
    propertyType: form.propertyType,
    projectName: form.projectName,
    locality: form.locality,
    pincode: form.pincode,
    configuration: form.configuration,
    bathrooms: form.bathrooms,
    areaValue: form.areaValue,
    areaBasis: form.areaBasis,
    furnishing: form.furnishing,
    floor: form.floor,
    totalFloors: form.totalFloors,
    parking: form.parking,
    propertyAge: form.propertyAge,
    expectedPrice: form.expectedPrice,
    monthlyRent: form.monthlyRent,
    maintenance: form.maintenance,
    deposit: form.deposit,
    availableFrom: form.availableFrom,
    occupancy: form.occupancy,
    contactPreference: form.contactPreference,
  };
}

export default function PropertySubmissionForm({
  initialIntent = "",
}: {
  initialIntent?: SubmissionForm["intent"];
}) {
  const [form, setForm] = useState<SubmissionForm>({
    ...initialForm,
    intent: initialIntent,
  });
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [draftRecovered, setDraftRecovered] = useState(false);
  const [state, setState] =
    useState<"idle" | "saving" | "saved" | "fallback">("idle");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(DRAFT_KEY);
        if (stored) {
          const draft = JSON.parse(stored) as Partial<PropertyDraft>;
          setForm((current) => ({
            ...current,
            ...draft,
            intent: initialIntent || draft.intent || current.intent,
          }));
          setDraftRecovered(true);
        }
      } catch {
        window.localStorage.removeItem(DRAFT_KEY);
      } finally {
        setDraftReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialIntent]);

  useEffect(() => {
    if (!draftReady || state !== "idle") return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(safeDraft(form)));
  }, [draftReady, form, state]);

  function resetForm() {
    window.localStorage.removeItem(DRAFT_KEY);
    setForm({ ...initialForm, intent: initialIntent });
    setStep(0);
    setState("idle");
    setReference("");
    setDraftRecovered(false);
    setMessage("");
  }

  function update<K extends keyof SubmissionForm>(
    name: K,
    value: SubmissionForm[K]
  ) {
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  const nextAllowed = useMemo(() => {
    if (step === 0) return Boolean(form.intent && form.ownerRole);
    if (step === 1) {
      return Boolean(
        form.propertyType &&
          form.locality.trim().length > 1 &&
          form.configuration &&
          /^\d{2,7}(?:\.\d{1,2})?$/.test(form.areaValue)
      );
    }
    if (step === 2) {
      return form.intent === "Sell"
        ? form.expectedPrice.trim().length > 1
        : form.monthlyRent.trim().length > 1;
    }
    return true;
  }, [form, step]);

  function goNext() {
    if (!nextAllowed) {
      setMessage("Complete the highlighted essentials before continuing.");
      return;
    }
    setStep((current) => Math.min(3, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    `Hi Asher Realty, I would like help ${form.intent === "Sell" ? "selling" : "renting out"} my property.

Reference: ${reference || "New owner submission"}
Name: ${form.name}
Phone: ${form.phone}
Property: ${form.configuration} ${form.propertyType}
Project: ${form.projectName || "Not shared"}
Locality: ${form.locality}
Area: ${form.areaValue} sq ft (${form.areaBasis})
${form.intent === "Sell" ? `Expected price: ${form.expectedPrice}` : `Monthly rent: ${form.monthlyRent}`}`
  )}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !form.authorityDeclaration ||
      !form.accuracyDeclaration ||
      !form.contactConsent
    ) {
      setMessage("Please accept the three declarations so we can review the property.");
      return;
    }

    setState("saving");
    setMessage("");
    trackEvent("property_submission_started", {
      listing_intent: form.intent,
      property_type: form.propertyType,
      locality: form.locality,
    });

    try {
      const response = await fetch("/api/property-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json().catch(() => ({}))) as {
        reference?: string;
        error?: string;
      };
      if (response.ok) {
        setReference(result.reference || "");
        window.localStorage.removeItem(DRAFT_KEY);
        setState("saved");
        trackEvent("property_submission_completed", {
          listing_intent: form.intent,
          property_type: form.propertyType,
        });
      } else if (response.status >= 500) {
        setState("fallback");
      } else {
        setState("idle");
        setStep(0);
        setMessage(
          result.error ||
            "We could not accept those details yet. Please review the form and try again."
        );
      }
    } catch {
      setState("fallback");
    }
  }

  if (state === "saved" || state === "fallback") {
    return (
      <div aria-live="polite" className="rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-[0_25px_80px_rgba(7,26,47,.12)] sm:p-10">
        <span className={`mx-auto flex size-16 items-center justify-center rounded-full ${state === "saved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {state === "saved" ? <CheckCircle2 className="size-8" /> : <MessageCircle className="size-8" />}
        </span>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a47b10]">
          Private owner intake
        </p>
        <h2 className="mt-3 text-4xl font-medium text-[#071a2f] sm:text-5xl">
          {state === "saved" ? "Property received for review" : "Continue securely on WhatsApp"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
          {state === "saved"
            ? "An Asher Realty advisor will verify your authority, property facts, expected commercial terms and availability before discussing photos or publication. Nothing is published automatically."
            : "The secure submission service is temporarily unavailable. Send the prepared summary to the Asher owner desk so the verification can begin."}
        </p>
        {state === "saved" && reference && (
          <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#c9a227]/25 bg-[#fff9e8] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7410]">Your private reference</p>
            <p className="mt-2 font-mono text-xl font-extrabold tracking-[0.08em] text-[#071a2f]">{reference}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(reference)}
              className="mt-3 text-xs font-bold text-[#9a7410] underline underline-offset-4"
            >
              Copy reference
            </button>
          </div>
        )}
        {state === "saved" && (
          <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left sm:grid-cols-3">
            {["We review the brief", "An advisor confirms facts", "You approve any next step"].map((item, index) => (
              <div key={item} className="rounded-xl bg-[#f7f8fa] p-4 text-[11px] leading-5 text-slate-600">
                <span className="font-extrabold text-[#a47b10]">0{index + 1}</span>
                <p className="mt-1 font-semibold text-[#071a2f]">{item}</p>
              </div>
            ))}
          </div>
        )}
        <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-slate-500">
          Submission and initial review are free. Nothing is published automatically. Optional paid services are explained before you choose them.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center justify-center rounded-full bg-[#25D366] px-7 text-sm font-bold text-white"
          >
            <MessageCircle className="mr-2 size-5" />
            {state === "saved" ? "Send photos when advised" : "Continue on WhatsApp"}
          </a>
          {state === "saved" && (
            <button type="button" onClick={() => window.print()} className="inline-flex h-13 items-center justify-center rounded-full border border-slate-200 px-7 text-sm font-bold text-[#071a2f]">
              Print / save receipt
            </button>
          )}
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex h-13 items-center justify-center rounded-full border border-slate-200 px-7 text-sm font-bold text-[#071a2f]"
          >
            Submit another property
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white";

  return (
    <form
      onSubmit={submit}
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_90px_rgba(7,26,47,.12)]"
    >
      <div className="border-b border-slate-100 bg-[#f7f8fa] px-5 py-5 sm:px-8">
        <div className="mb-4 flex flex-col justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] text-emerald-900 sm:flex-row sm:items-center">
          <span><strong>Free to submit.</strong> Non-sensitive property details are saved on this device while you complete the form.</span>
          {draftRecovered && (
            <button type="button" onClick={resetForm} className="shrink-0 font-bold underline underline-offset-4">Clear saved details</button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          {steps.map((label, index) => (
            <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                  index <= step
                    ? "bg-[#071a2f] text-[#e4c462]"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`hidden text-[10px] font-bold uppercase tracking-[0.12em] md:block ${
                  index === step ? "text-[#071a2f]" : "text-slate-400"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <span className="ml-auto hidden h-px flex-1 bg-slate-200 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-9">
        {step === 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">
              Start with one choice
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              What would you like Asher Realty to help with?
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                {
                  value: "Sell" as const,
                  icon: Building2,
                  title: "Sell my property",
                  text: "Start with a realistic positioning review, fact check and assisted resale plan.",
                },
                {
                  value: "Rent out" as const,
                  icon: KeyRound,
                  title: "Rent out my property",
                  text: "Share the home, rent expectation and availability for a tenant-search review.",
                },
              ].map(({ value, icon: Icon, title, text }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("intent", value)}
                  className={`rounded-[1.5rem] border p-6 text-left transition ${
                    form.intent === value
                      ? "border-[#c9a227] bg-[#fff9e8] shadow-[0_16px_45px_rgba(201,162,39,.12)]"
                      : "border-slate-200 bg-[#f7f8fa] hover:border-[#c9a227]/50 hover:bg-white"
                  }`}
                >
                  <Icon className="size-7 text-[#a47b10]" />
                  <span className="mt-5 block text-2xl font-semibold text-[#071a2f]">
                    {title}
                  </span>
                  <span className="mt-3 block text-xs leading-6 text-slate-500">
                    {text}
                  </span>
                </button>
              ))}
            </div>
            <label className="mt-6 block">
              <span className="text-sm font-semibold text-[#071a2f]">
                I am submitting as
              </span>
              <select
                value={form.ownerRole}
                onChange={(event) =>
                  update("ownerRole", event.target.value as SubmissionForm["ownerRole"])
                }
                className={inputClass}
              >
                <option>Owner</option>
                <option>Power of attorney holder</option>
                <option>Authorised representative</option>
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">
              Property essentials
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              Tell us enough to understand the home.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Do not share the flat number, title documents or identity documents here.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Property type*</span>
                <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={inputClass}>
                  <option>Apartment</option><option>Villa</option><option>Independent house</option><option>Residential plot</option><option>Commercial property</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Configuration*</span>
                <select value={form.configuration} onChange={(e) => update("configuration", e.target.value)} className={inputClass}>
                  <option value="">Select</option><option>Studio</option><option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4 BHK</option><option>5+ BHK</option><option>Plot / open space</option><option>Commercial unit</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold text-[#071a2f]">Project or building name</span>
                <input value={form.projectName} onChange={(e) => update("projectName", e.target.value)} placeholder="e.g. Sobha Dream Acres" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Locality*</span>
                <input value={form.locality} onChange={(e) => update("locality", e.target.value)} placeholder="e.g. Panathur" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Pincode</span>
                <input inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))} placeholder="560103" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Area*</span>
                <input inputMode="decimal" value={form.areaValue} onChange={(e) => update("areaValue", e.target.value.replace(/[^0-9.]/g, ""))} placeholder="1250" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Area basis*</span>
                <select value={form.areaBasis} onChange={(e) => update("areaBasis", e.target.value)} className={inputClass}>
                  <option>Carpet area</option><option>Built-up area</option><option>Super built-up area</option><option>Plot area</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Bathrooms</span>
                <select value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass}>
                  <option value="">Select</option><option>1</option><option>2</option><option>3</option><option>4+</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Furnishing</span>
                <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)} className={inputClass}>
                  <option value="">Select</option><option>Unfurnished</option><option>Semi-furnished</option><option>Fully furnished</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Floor</span>
                <input value={form.floor} onChange={(e) => update("floor", e.target.value)} placeholder="e.g. 8" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Total floors</span>
                <input value={form.totalFloors} onChange={(e) => update("totalFloors", e.target.value)} placeholder="e.g. 18" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Parking</span>
                <select value={form.parking} onChange={(e) => update("parking", e.target.value)} className={inputClass}>
                  <option value="">Select</option><option>No dedicated parking</option><option>1 car</option><option>2 cars</option><option>3+ cars</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Property age</span>
                <select value={form.propertyAge} onChange={(e) => update("propertyAge", e.target.value)} className={inputClass}>
                  <option value="">Select</option><option>Under construction</option><option>Less than 1 year</option><option>1–5 years</option><option>5–10 years</option><option>More than 10 years</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">
              Commercial expectation
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              What outcome are you expecting?
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {form.intent === "Sell" ? (
                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-[#071a2f]">Expected total price*</span>
                  <input value={form.expectedPrice} onChange={(e) => update("expectedPrice", e.target.value)} placeholder="e.g. ₹1.65 crore" className={inputClass} />
                </label>
              ) : (
                <>
                  <label>
                    <span className="text-sm font-semibold text-[#071a2f]">Expected monthly rent*</span>
                    <input value={form.monthlyRent} onChange={(e) => update("monthlyRent", e.target.value)} placeholder="e.g. ₹45,000" className={inputClass} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-[#071a2f]">Security deposit</span>
                    <input value={form.deposit} onChange={(e) => update("deposit", e.target.value)} placeholder="e.g. ₹2,00,000" className={inputClass} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-[#071a2f]">Monthly maintenance</span>
                    <input value={form.maintenance} onChange={(e) => update("maintenance", e.target.value)} placeholder="Amount and whether included" className={inputClass} />
                  </label>
                </>
              )}
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Available from</span>
                <input type="date" value={form.availableFrom} onChange={(e) => update("availableFrom", e.target.value)} className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Current occupancy</span>
                <select value={form.occupancy} onChange={(e) => update("occupancy", e.target.value)} className={inputClass}>
                  <option value="">Select</option><option>Vacant</option><option>Owner occupied</option><option>Tenant occupied</option><option>Under construction</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold text-[#071a2f]">Anything useful about the home?</span>
                <textarea maxLength={1200} rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Views, sunlight, upgrades, pet policy, move-in timing or other facts an advisor should know…" className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] p-4 text-sm text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white" />
                <span className="mt-1 block text-right text-[10px] text-slate-400">{form.description.length}/1200</span>
              </label>
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs leading-6 text-amber-900">
              We will discuss pricing evidence and marketing strategy after verification. Your expectation is not presented publicly as a confirmed valuation.
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47b10]">
              Private contact and review
            </p>
            <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
              Who should the owner desk contact?
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Full name*</span>
                <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Mobile number*</span>
                <input required type="tel" pattern="[0-9+\-\s]{8,15}" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Email</span>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#071a2f]">Preferred contact</span>
                <select value={form.contactPreference} onChange={(e) => update("contactPreference", e.target.value)} className={inputClass}>
                  <option>Phone or WhatsApp</option><option>Phone call</option><option>WhatsApp</option><option>Email</option>
                </select>
              </label>
            </div>

            <div className="mt-7 rounded-[1.5rem] bg-[#071a2f] p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">Review summary</p>
              <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
                <div><span className="text-white/45">Request</span><p className="mt-1 font-semibold">{form.intent} · {form.ownerRole}</p></div>
                <div><span className="text-white/45">Property</span><p className="mt-1 font-semibold">{form.configuration} {form.propertyType}</p></div>
                <div><span className="text-white/45">Where</span><p className="mt-1 font-semibold">{form.projectName || form.locality}, {form.locality}</p></div>
                <div><span className="text-white/45">Commercial</span><p className="mt-1 font-semibold">{form.intent === "Sell" ? form.expectedPrice : `${form.monthlyRent} monthly rent`}</p></div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["authorityDeclaration", "I confirm I am the owner or am authorised to offer this property for sale or rent."],
                ["accuracyDeclaration", "I confirm the information is accurate to the best of my knowledge and agree that Asher Realty may verify it before any publication."],
                ["contactConsent", "I agree to be contacted about this specific property submission. This does not opt me into unrelated promotional calls."],
              ].map(([name, label]) => (
                <label key={name} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4">
                  <input type="checkbox" checked={form[name as keyof SubmissionForm] as boolean} onChange={(e) => update(name as "authorityDeclaration" | "accuracyDeclaration" | "contactConsent", e.target.checked)} className="mt-0.5 size-4 accent-[#c9a227]" />
                  <span className="text-[11px] leading-5 text-slate-600">{label}</span>
                </label>
              ))}
            </div>
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" />
          </div>
        )}

        {message && (
          <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" aria-live="polite">
            {message}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => { setStep((current) => current - 1); setMessage(""); }} className="inline-flex h-12 items-center rounded-full border border-slate-200 px-5 text-sm font-bold text-[#071a2f]">
              <ArrowLeft className="mr-2 size-4" /> Back
            </button>
          ) : <span />}
          {step < 3 ? (
            <button type="button" onClick={goNext} className="inline-flex h-12 items-center rounded-full bg-[#071a2f] px-6 text-sm font-bold text-white">
              Continue <ArrowRight className="ml-2 size-4 text-[#e4c462]" />
            </button>
          ) : (
            <button disabled={state === "saving"} type="submit" className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] disabled:opacity-60">
              <ShieldCheck className="mr-2 size-4" />
               {state === "saving" ? "Sending for review…" : "Submit FREE for review"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
