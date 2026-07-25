"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type FormData = {
  name: string;
  phone: string;
  budget: string;
  location: string;
};

const initialFormData: FormData = {
  name: "",
  phone: "",
  budget: "",
  location: "",
};

export default function ConsultationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = encodeURIComponent(
      `Hi Asher Realty,

I would like a personalised property consultation.

Name: ${formData.name}
Phone: ${formData.phone}
Budget: ${formData.budget}
Preferred Location: ${formData.location}`
    );

    const whatsappUrl = `https://wa.me/919019697170?text=${message}`;

    setSubmitted(true);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (submitted) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-[#c9a227]/20 bg-white p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#c9a227]/10">
          <CheckCircle2 className="size-8 text-[#c9a227]" />
        </div>

        <h3 className="mt-6 text-3xl font-medium text-[#071a2f]">
          Thank you
        </h3>

        <p className="mt-3 max-w-md leading-7 text-slate-600">
          Your consultation request has been prepared in WhatsApp. Send the
          message to connect with Asher Realty.
        </p>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData(initialFormData);
          }}
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full border border-[#071a2f]/20 px-6 text-sm font-semibold text-[#071a2f] transition hover:bg-[#071a2f] hover:text-white"
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

      <button
        type="submit"
        className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#c9a227] px-8 font-semibold text-[#071a2f] transition hover:bg-[#e4c462]"
      >
        Request Free Consultation
        <ArrowRight className="ml-2 size-4" />
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        By submitting, you agree to be contacted regarding your property
        requirement.
      </p>
    </form>
  );
}