"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, GitCompareArrows, Heart, X } from "lucide-react";

import { projectSlug, projects } from "@/data/projects";
import {
  BUYER_WORKSPACE_EVENT,
  COMPARISON_KEY,
  readBuyerWorkspace,
  type BuyerWorkspaceSnapshot,
  writeBuyerWorkspaceList,
} from "@/lib/buyerWorkspace";

const emptyWorkspace: BuyerWorkspaceSnapshot = {
  favourites: [],
  comparison: [],
  recent: [],
};

export default function BuyerWorkspaceDock() {
  const pathname = usePathname();
  const [workspace, setWorkspace] =
    useState<BuyerWorkspaceSnapshot>(emptyWorkspace);

  useEffect(() => {
    const syncWorkspace = () => setWorkspace(readBuyerWorkspace());
    const timer = window.setTimeout(syncWorkspace, 0);

    window.addEventListener(BUYER_WORKSPACE_EVENT, syncWorkspace);
    window.addEventListener("storage", syncWorkspace);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BUYER_WORKSPACE_EVENT, syncWorkspace);
      window.removeEventListener("storage", syncWorkspace);
    };
  }, []);

  const comparisonNames = useMemo(
    () =>
      workspace.comparison
        .map(
          (slug) =>
            projects.find((project) => projectSlug(project.name) === slug)?.name
        )
        .filter((name): name is string => Boolean(name)),
    [workspace.comparison]
  );

  if (
    pathname.startsWith("/crm") ||
    (!workspace.favourites.length && !workspace.comparison.length)
  ) {
    return null;
  }

  const compareHref = workspace.comparison.length
    ? `/compare?projects=${workspace.comparison.join(",")}`
    : "/compare";

  return (
    <aside
      aria-label="Buyer workspace"
      className="fixed bottom-5 left-1/2 z-[65] hidden w-[min(760px,calc(100%-2rem))] -translate-x-1/2 items-center gap-3 rounded-[1.35rem] border border-white/10 bg-[#041421]/95 p-2.5 text-white shadow-[0_24px_70px_rgba(0,0,0,.35)] backdrop-blur-2xl lg:flex"
    >
      <Link
        href="/my-search"
        className="flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white/[0.07]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/12 text-rose-300">
          <Heart className="size-4 fill-current" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
            Saved homes
          </span>
          <span className="block truncate text-sm font-semibold">
            {workspace.favourites.length} shortlisted
          </span>
        </span>
      </Link>

      <div className="h-9 w-px bg-white/10" />

      <Link
        href={compareHref}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white/[0.07]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/15 text-[#e4c462]">
          <GitCompareArrows className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
            Comparison
          </span>
          <span className="block truncate text-sm font-semibold">
            {comparisonNames.length
              ? comparisonNames.join(" vs ")
              : "Choose two projects"}
          </span>
        </span>
      </Link>

      {workspace.comparison.length > 0 && (
        <button
          type="button"
          onClick={() => writeBuyerWorkspaceList(COMPARISON_KEY, [])}
          aria-label="Clear comparison"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/35 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      )}

      <Link
        href={compareHref}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
      >
        {workspace.comparison.length >= 2 ? "Compare now" : "Add one more"}
        <ArrowRight className="ml-2 size-4" />
      </Link>
    </aside>
  );
}
