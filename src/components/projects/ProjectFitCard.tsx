"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Sparkles, Target } from "lucide-react";

import type { Project } from "@/data/projects";
import {
  BUYER_PROFILE_EVENT,
  defaultBuyerPreferences,
  readBuyerPreferences,
  scoreProject,
  type BuyerPreferences,
} from "@/lib/buyerProfile";

export default function ProjectFitCard({ project }: { project: Project }) {
  const [preferences, setPreferences] =
    useState<BuyerPreferences>(defaultBuyerPreferences);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setPreferences(readBuyerPreferences());
      setReady(true);
    };
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(BUYER_PROFILE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_PROFILE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const fit = scoreProject(project, preferences);

  if (!ready) {
    return <div className="mt-5 h-28 animate-pulse rounded-[1.5rem] bg-slate-200" />;
  }

  if (!preferences.customized) {
    return (
      <div className="mt-5 flex flex-col gap-5 rounded-[1.5rem] border border-[#c9a227]/25 bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#071a2f]">
              See whether this project fits your daily life
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              Add your work hub, budget, move-in plan and top priority. Your
              profile stays on this device.
            </p>
          </div>
        </div>
        <Link
          href="/my-search#buyer-profile"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white"
        >
          Create buyer brief <ArrowRight className="ml-2 size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-emerald-200 bg-emerald-50">
      <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-extrabold text-white shadow-lg shadow-emerald-900/10">
          {fit.score}
        </span>
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
            <Target className="size-4" /> Personal fit score
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {fit.reasons.map((reason) => (
              <span
                key={reason}
                className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-emerald-800"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/my-search#buyer-profile"
          className="inline-flex items-center text-xs font-bold text-emerald-900 hover:text-[#071a2f]"
        >
          <BriefcaseBusiness className="mr-2 size-4" /> Edit my brief
        </Link>
      </div>
      <div className="h-1.5 bg-emerald-100">
        <div
          className="h-full rounded-r-full bg-emerald-500"
          style={{ width: `${fit.score}%` }}
        />
      </div>
    </div>
  );
}
