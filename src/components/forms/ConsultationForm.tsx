"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type FormData = {
  name: string;
  phone: string;
  budget: string;
  location: string;
  configuration: string;
  purpose: string;
  timeline: string;
  ai_call_consent: boolean;
};

const initialFormData: FormData = {
  name: "",
  phone: "",
  budget: "",
  location: "",
  configuration: "",
  purpose: "",
  timeline: "",
  ai_call_consent: false,
};

export default function ConsultationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submission, setSubmission] = useState<"idle" | "saving" | "saved" | "fallback">("idle");
  const whatsappUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
    `Hi Asher Realty,

I would like a personalised property consultation.

Name: ${formData.name}
Phone: ${formData.phone}
Budget: ${formData.budget}
Preferred Location: ${formData.location}
Preferred Configuration: ${formData.configuration}
Buying For: ${formData.purpose}
Purchase Timeline: ${formData.timeline}`
  )}`;

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    trackEvent("generate_lead", {
      form_name: "property_consultation",
      budget_band: formData.budget,
      preferred_location: formData.location,
      configuration: formData.configuration,
      buying_purpose: formData.purpose,
      purchase_timeline: formData.timeline,
    });
    setSubmission("saving");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "property_consultation",
        }),
      });
      setSubmission(response.ok ? "saved" : "fallback");
    } catch {
      setSubmission("fallback");
    }
  }

  function handleConsent(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((current) => ({
      ...current,
      ai_call_consent: event.target.checked,
    }));
  }

  if (submission === "saved" || submission === "fallback") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-[#c9a227]/20 bg-white p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#c9a227]/10">
          <CheckCircle2 className="size-8 text-[#c9a227]" />
        </div>

        <h3 className="mt-6 text-3xl font-medium text-[#071a2f]">
          {submission === "saved" ? "Enquiry received" : "Continue on WhatsApp"}
        </h3>

        <p className="mt-3 max-w-md leading-7 text-slate-600">
          {submission === "saved"
            ? "Your requirement is securely recorded. An Asher Realty advisor will contact you to verify suitable projects."
            : "Secure CRM storage is being connected. Send the prepared message to reach Asher Realty immediately."}
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-label="Consultation confirmation WhatsApp"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-bold text-white"
        >
          <MessageCircle className="mr-2 size-4" />
          Continue on WhatsApp
        </a>

        <button
          type="button"
          onClick={() => {
            setSubmission("idle");
            setFormData(initialFormData);
          }}
          className="mt-4 inline-flex h-12 items-center justify-center rounded-full border border-[#071a2f]/20 px-6 text-sm font-semibold text-[#071a2f] transition hover:bg-[#071a2f] hover:text-white"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(7,26,47,0.10)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="text-sm font-semibold text-[#071a2f]"
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="configuration" className="text-sm font-semibold text-[#071a2f]">
            Configuration
          </label>
          <select
            id="configuration"
            name="configuration"
            value={formData.configuration}
            onChange={handleChange}
            required
            className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition focus:border-[#c9a227] focus:bg-white"
          >
            <option value="">Select home size</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK or larger">4 BHK or larger</option>
          </select>
        </div>

        <div>
          <label htmlFor="purpose" className="text-sm font-semibold text-[#071a2f]">
            Buying For
          </label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition focus:border-[#c9a227] focus:bg-white"
          >
            <option value="">Select purpose</option>
            <option value="Self-use">Self-use</option>
            <option value="Investment">Investment</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="timeline" className="text-sm font-semibold text-[#071a2f]">
            Purchase Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            required
            className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition focus:border-[#c9a227] focus:bg-white"
          >
            <option value="">Select timeline</option>
            <option value="Within 3 months">Within 3 months</option>
            <option value="3–6 months">3–6 months</option>
            <option value="6–12 months">6–12 months</option>
            <option value="Exploring">Just exploring</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="text-sm font-semibold text-[#071a2f]"
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter mobile number"
            pattern="[0-9+\-\s]{8,15}"
            className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="budget"
            className="text-sm font-semibold text-[#071a2f]"
          >
            Budget
          </label>

          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition focus:border-[#c9a227] focus:bg-white"
          >
            <option value="">Select budget</option>
            <option value="₹50 lakh – ₹1 crore">
              ₹50 lakh – ₹1 crore
            </option>
            <option value="₹1 crore – ₹2 crore">
              ₹1 crore – ₹2 crore
            </option>
            <option value="₹2 crore – ₹3 crore">
              ₹2 crore – ₹3 crore
            </option>
            <option value="₹3 crore and above">
              ₹3 crore and above
            </option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="location"
            className="text-sm font-semibold text-[#071a2f]"
          >
            Preferred Location
          </label>

          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition focus:border-[#c9a227] focus:bg-white"
          >
            <option value="">Select location</option>
            <option value="Whitefield">Whitefield</option>
            <option value="Sarjapur Road">Sarjapur Road</option>
            <option value="North Bengaluru">North Bengaluru</option>
            <option value="Hebbal">Hebbal</option>
            <option value="Electronic City">Electronic City</option>
            <option value="Devanahalli">Devanahalli</option>
            <option value="Open to recommendations">
              Open to recommendations
            </option>
          </select>
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4 text-left">
        <input
          type="checkbox"
          checked={formData.ai_call_consent}
          onChange={handleConsent}
          className="mt-0.5 size-4 accent-[#c9a227]"
        />
        <span className="text-[11px] leading-5 text-slate-500">
          I agree to receive a property-assistance call from Asher Realty,
          including from its clearly identified virtual assistant. This is
          optional and I can withdraw permission at any time.
        </span>
      </label>

      <button
        disabled={submission === "saving"}
        type="submit"
        className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#c9a227] px-8 font-semibold text-[#071a2f] transition hover:bg-[#e4c462] disabled:opacity-60"
      >
        {submission === "saving" ? "Securing your enquiry…" : "Request Free Consultation"}
        <ArrowRight className="ml-2 size-4" />
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        By submitting, you agree to be contacted regarding this enquiry. AI
        calling is used only when the optional permission above is selected.
      </p>
    </form>
  );
}
