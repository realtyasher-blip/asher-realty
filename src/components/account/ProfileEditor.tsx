"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  MailCheck,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  ownerRoles,
  type OwnerContactMode,
  type OwnerProfile,
  type OwnerProfileInput,
} from "@/lib/owner/types";

type Props = {
  email: string;
  profile: OwnerProfile | null;
  onSave: (input: OwnerProfileInput) => Promise<void>;
  onCancel?: () => void;
};

const contactOptions: Array<{
  value: OwnerContactMode;
  title: string;
  text: string;
  recommended?: boolean;
}> = [
  {
    value: "asher_managed",
    title: "Asher manages enquiries",
    text: "Your direct contact details remain private. Buyers contact the Asher desk first.",
    recommended: true,
  },
  {
    value: "name_only",
    title: "Show my name only",
    text: "Buyers see your public name; email and phone remain hidden.",
  },
  {
    value: "name_email",
    title: "Show name + verified email",
    text: "Buyers may email the verified address used for this account.",
  },
  {
    value: "name_phone",
    title: "Show name + profile phone",
    text: "Buyers may call or WhatsApp the number you enter. Asher does not OTP-verify this number yet.",
  },
];

function initialProfile(profile: OwnerProfile | null): OwnerProfileInput {
  return {
    display_name: profile?.display_name || "",
    contact_phone: profile?.contact_phone || "",
    role: profile?.role || "Owner",
    bio: profile?.bio || "",
    preferred_contact: profile?.preferred_contact || "Phone or WhatsApp",
    is_public: profile?.is_public || false,
    show_name: profile?.show_name || false,
    show_email: profile?.show_email || false,
    show_phone: profile?.show_phone || false,
    contact_mode: profile?.contact_mode || "asher_managed",
  };
}

function publicName(name: string) {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  if (!parts.length) return "Your public name";
  return parts.length === 1 ? parts[0] : `${parts[0]} ${parts.at(-1)?.[0] || ""}.`;
}

export default function ProfileEditor({ email, profile, onSave, onCancel }: Props) {
  const [form, setForm] = useState<OwnerProfileInput>(() => initialProfile(profile));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const previewName = useMemo(
    () => publicName(form.display_name),
    [form.display_name]
  );

  function chooseMode(mode: OwnerContactMode) {
    setForm((current) => ({
      ...current,
      contact_mode: mode,
      is_public: mode !== "asher_managed",
      show_name: mode !== "asher_managed",
      show_email: mode === "name_email",
      show_phone: mode === "name_phone",
    }));
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.display_name.trim().length < 2) {
      setMessage("Enter the name you want Asher Realty to use for this account.");
      return;
    }
    if (
      form.contact_phone &&
      !/^[0-9+\-\s()]{8,18}$/u.test(form.contact_phone.trim())
    ) {
      setMessage("Enter a valid mobile number or leave it blank.");
      return;
    }
    if (form.contact_mode === "name_phone" && !form.contact_phone) {
      setMessage("Add a phone number before choosing direct phone contact.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await onSave({
        ...form,
        display_name: form.display_name.trim(),
        contact_phone: form.contact_phone?.trim() || null,
        bio: form.bio.trim(),
      });
      setMessage("Profile saved. Your privacy choice is now up to date.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not save the profile. Try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 text-sm text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white";

  return (
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(7,26,47,.05)] sm:p-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7410]">
          Your private profile
        </p>
        <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
          Tell us who is offering the property.
        </h2>
        <p className="mt-3 text-xs leading-6 text-slate-500">
          This information helps with review. Nothing becomes public until you
          choose a public contact mode and an approved property goes live.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label>
            <span className="text-sm font-bold text-[#071a2f]">Full name*</span>
            <input
              required
              maxLength={80}
              autoComplete="name"
              value={form.display_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  display_name: event.target.value,
                }))
              }
              placeholder="Your full name"
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm font-bold text-[#071a2f]">I am the</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as OwnerProfileInput["role"],
                }))
              }
              className={inputClass}
            >
              {ownerRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-bold text-[#071a2f]">
              Verified account email
            </span>
            <span className="relative block">
              <MailCheck className="absolute left-4 top-[1.35rem] size-4 text-emerald-600" />
              <input
                readOnly
                value={email}
                className={`${inputClass} pl-11 text-slate-500`}
              />
            </span>
          </label>

          <label>
            <span className="text-sm font-bold text-[#071a2f]">
              Mobile number
            </span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.contact_phone || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contact_phone: event.target.value,
                }))
              }
              placeholder="+91 98765 43210"
              className={inputClass}
            />
            <span className="mt-2 block text-[10px] leading-5 text-slate-400">
              This number is private by default and is not OTP-verified. It appears publicly only if you choose the phone-sharing option.
            </span>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-bold text-[#071a2f]">
              Preferred contact from the Asher team
            </span>
            <select
              value={form.preferred_contact}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  preferred_contact:
                    event.target.value as OwnerProfileInput["preferred_contact"],
                }))
              }
              className={inputClass}
            >
              <option>Phone or WhatsApp</option>
              <option>Phone call</option>
              <option>WhatsApp</option>
              <option>Email</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-bold text-[#071a2f]">
              Short introduction <span className="font-normal text-slate-400">(optional)</span>
            </span>
            <textarea
              rows={4}
              maxLength={300}
              value={form.bio}
              onChange={(event) =>
                setForm((current) => ({ ...current, bio: event.target.value }))
              }
              placeholder="For example: Owner of this Bengaluru home, available for guided visits with prior notice."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] p-4 text-sm leading-6 text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white"
            />
            <span className="mt-1 block text-right text-[10px] text-slate-400">
              {form.bio.length}/300
            </span>
          </label>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#9a7410]">
                Privacy choice
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#071a2f]">
                Choose what buyers may see.
              </h2>
            </div>
          </div>

          <fieldset className="mt-6 space-y-3">
            <legend className="sr-only">Public contact mode</legend>
            {contactOptions.map((option) => {
              const selected = form.contact_mode === option.value;
              return (
                <label
                  key={option.value}
                  className={`block cursor-pointer rounded-2xl border p-4 transition ${
                    selected
                      ? "border-[#c9a227] bg-[#fff9e8]"
                      : "border-slate-200 bg-[#f8f9fa] hover:border-[#c9a227]/45"
                  }`}
                >
                  <input
                    type="radio"
                    name="contact-mode"
                    value={option.value}
                    checked={selected}
                    onChange={() => chooseMode(option.value)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="flex items-center gap-2 text-sm font-bold text-[#071a2f]">
                        {option.title}
                        {option.recommended && (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] uppercase tracking-[.12em] text-emerald-800">
                            Recommended
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                        {option.text}
                      </span>
                    </span>
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#c9a227] bg-[#c9a227] text-[#071a2f]"
                          : "border-slate-300 text-transparent"
                      }`}
                    >
                      <Check className="size-4" />
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] bg-[#071a2f] text-white">
          <div className="border-b border-white/10 p-5">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#e4c462]">
              <Eye className="size-4" /> Buyer preview
            </p>
          </div>
          <div className="p-6">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#c9a227]/15 text-[#e4c462]">
              <UserRound className="size-5" />
            </span>
            {form.contact_mode === "asher_managed" ? (
              <>
                <h3 className="mt-4 text-2xl font-semibold">Owner contact protected</h3>
                <p className="mt-2 text-xs leading-6 text-white/52">
                  Buyers see “Ask Asher about this home.” Your name, email and
                  phone remain private.
                </p>
                <span className="mt-5 inline-flex items-center rounded-full bg-[#c9a227] px-4 py-2 text-[11px] font-bold text-[#071a2f]">
                  <MessageCircle className="mr-2 size-4" /> Ask Asher about this home
                </span>
              </>
            ) : (
              <>
                <h3 className="mt-4 text-2xl font-semibold">{previewName}</h3>
                <p className="mt-1 text-[11px] text-white/42">{form.role}</p>
                <div className="mt-5 space-y-2 text-xs text-white/65">
                  {form.show_email && (
                    <p className="flex items-center gap-2">
                      <MailCheck className="size-4 text-[#e4c462]" /> {email}
                    </p>
                  )}
                  {form.show_phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="size-4 text-[#e4c462]" />
                      {form.contact_phone || "Add a phone number"}
                    </p>
                  )}
                  {!form.show_email && !form.show_phone && (
                    <p className="flex items-center gap-2">
                      <EyeOff className="size-4 text-[#e4c462]" /> Direct contact hidden
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {message && (
          <p
            aria-live="polite"
            className={`rounded-2xl border p-4 text-xs leading-6 ${
              message.startsWith("Profile saved")
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {message}
          </p>
        )}

        <div className="sticky bottom-20 flex gap-3 rounded-[1.35rem] border border-slate-200 bg-white/95 p-3 shadow-[0_16px_50px_rgba(7,26,47,.12)] backdrop-blur-xl lg:bottom-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-12 flex-1 rounded-full border border-slate-200 px-5 text-xs font-bold text-[#071a2f]"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="h-12 flex-1 rounded-full bg-[#c9a227] px-5 text-xs font-extrabold text-[#071a2f] transition hover:bg-[#e4c462] disabled:opacity-60"
          >
            {saving ? "Saving profile..." : "Save profile & privacy"}
          </button>
        </div>
      </section>
    </form>
  );
}
