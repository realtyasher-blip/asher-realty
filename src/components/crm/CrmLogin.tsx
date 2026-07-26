"use client";

import { FormEvent, useState } from "react";
import { KeyRound, LockKeyhole } from "lucide-react";

export default function CrmLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json()) as { error?: string };
    if (response.ok) {
      window.location.reload();
      return;
    }
    setError(data.error || "Unable to sign in.");
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071a2f] p-6">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-white p-8 shadow-2xl">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#c9a227]/12">
          <LockKeyhole className="size-6 text-[#b08a16]" />
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#b08a16]">
          Asher Realty operations
        </p>
        <h1 className="mt-3 text-4xl font-medium text-[#071a2f]">CRM sign in</h1>

        {!configured ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            The protected CRM is installed but not connected. Add the Supabase
            database and four server environment variables in Vercel to activate it.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7">
            <label className="text-sm font-semibold text-[#071a2f]">
              Admin password
              <div className="relative mt-2">
                <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  required
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-11 pr-4 text-sm outline-none focus:border-[#c9a227]"
                />
              </div>
            </label>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              disabled={loading}
              className="mt-6 h-13 w-full rounded-full bg-[#071a2f] text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Open CRM"}
            </button>
          </form>
        )}
        <p className="mt-6 text-xs leading-6 text-slate-400">
          This page is private, excluded from search indexing and protected by a
          signed, HTTP-only session cookie.
        </p>
      </div>
    </main>
  );
}

