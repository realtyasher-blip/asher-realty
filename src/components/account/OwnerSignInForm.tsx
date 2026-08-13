"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, Mail } from "lucide-react";

import { createClient as createBrowserClient } from "@/lib/supabase/client";

export default function OwnerSignInForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const supabase = createBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/account`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setState("sent");
    } catch (error) {
      setState("idle");
      const detail = error instanceof Error ? error.message : "";
      setMessage(
        /configure|environment|supabase/i.test(detail)
          ? "Secure account access is being configured. You can still use the free private property form today."
          : "We could not send the secure link. Check the email address and try again."
      );
    }
  }

  if (state === "sent") {
    return (
      <div
        aria-live="polite"
        className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-7 text-center sm:p-9"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="mt-5 text-3xl font-medium text-[#071a2f]">
          Check your email
        </h2>
        <p className="mt-3 text-sm leading-7 text-emerald-950/65">
          We sent a secure sign-in link to <strong>{email}</strong>. Open it in
          this browser to enter My Asher.
        </p>
        <p className="mt-4 text-xs leading-6 text-emerald-950/55">
          The link may take a minute to arrive. Check Spam or Promotions if you
          do not see it.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-xs font-bold text-emerald-800 underline underline-offset-4"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="owner-email" className="text-sm font-bold text-[#071a2f]">
          Email address
        </label>
        <div className="relative mt-2">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            id="owner-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage("");
            }}
            placeholder="you@example.com"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-[#f7f8fa] pl-12 pr-4 text-sm text-[#071a2f] outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:bg-white"
          />
        </div>
      </div>

      {message && (
        <div
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900"
        >
          {message}{" "}
          <Link href="/post-property" className="font-bold underline underline-offset-4">
            Open private property form
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#c9a227] px-7 text-sm font-extrabold text-[#071a2f] transition hover:bg-[#e4c462] disabled:cursor-wait disabled:opacity-60"
      >
        <KeyRound className="mr-2 size-5" />
        {state === "sending" ? "Sending secure link..." : "Send secure sign-in link"}
        {state === "idle" && <ArrowRight className="ml-2 size-4" />}
      </button>

      <p className="text-center text-[11px] leading-5 text-slate-500">
        No password to remember. Signing in does not publish your profile or
        property. By continuing, you agree to our{" "}
        <Link href="/privacy-policy" className="font-semibold underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
