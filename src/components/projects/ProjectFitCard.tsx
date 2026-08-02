"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleAlert,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import type { Project } from "@/data/projects";
import {
  BUYER_PROFILE_EVENT,
  defaultBuyerPreferences,
  readBuyerPreferences,
  scoreProject,
  type BuyerPreferences,
} from "@/lib/buyerProfile";
import {
  projectDataConfidence,
  projectDecisionCaution,
  projectFitBand,
  projectSourceLabel,
} from "@/lib/decisionEngine";

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
          href="/home-match"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white"
        >
          Create buyer brief <ArrowRight className="ml-2 size-4" />
        </Link>
      </div>
    );
  }

  const confidence = projectDataConfidence(project);

  return (
    <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-emerald-200 bg-emerald-50">
      <div className="grid gap-5 p-5 lg:grid-cols-[.9fr_1.1fr_auto] lg:items-center">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">
            <Target className="size-4" /> Personal decision snapshot
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-950">
            {projectFitBand(fit.score)}
          </p>
          <p className="mt-2 flex items-center gap-2 text-[9px] font-semibold text-emerald-800/65">
            <ShieldCheck className="size-3.5" /> {confidence.label} data · {projectSourceLabel(project)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-emerald-700">Why it may fit</p>
            <p className="mt-2 text-[11px] font-semibold leading-5 text-emerald-950/70">{fit.reasons.slice(0, 3).join(" · ")}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-amber-700"><CircleAlert className="size-3.5" /> What to verify</p>
            <p className="mt-2 text-[11px] leading-5 text-amber-950/65">{projectDecisionCaution(project)}</p>
          </div>
        </div>

        <Link
          href="/home-match"
          className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-300 bg-white px-5 text-xs font-bold text-emerald-900 transition hover:border-[#c9a227]"
        >
          <BriefcaseBusiness className="mr-2 size-4" /> Edit my brief
        </Link>
      </div>
    </div>
  );
}
