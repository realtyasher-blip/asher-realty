"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, GitCompareArrows, Heart, Share2 } from "lucide-react";

import {
  COMPARISON_KEY,
  FAVOURITES_KEY,
  RECENT_KEY,
  readBuyerWorkspace,
  toggleBuyerWorkspaceItem,
  writeBuyerWorkspaceList,
} from "@/lib/buyerWorkspace";

export default function ProjectActions({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const workspace = readBuyerWorkspace();
      setSaved(workspace.favourites.includes(slug));
      setCompared(workspace.comparison.includes(slug));
      const nextRecent = [
        slug,
        ...workspace.recent.filter((item) => item !== slug),
      ].slice(0, 6);
      writeBuyerWorkspaceList(RECENT_KEY, nextRecent);
    });
    return () => window.clearTimeout(timer);
  }, [slug]);

  function toggleSaved() {
    const next = toggleBuyerWorkspaceItem(FAVOURITES_KEY, slug);
    setSaved(next.includes(slug));
  }

  function toggleCompared() {
    const next = toggleBuyerWorkspaceItem(COMPARISON_KEY, slug, {
      maxItems: 2,
    });
    setCompared(next.includes(slug));
  }

  async function shareProject() {
    const shareData = {
      title: `${name} | Asher Realty`,
      text: `View ${name} on Asher Realty`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // A cancelled native share sheet needs no visible error.
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={toggleCompared}
        aria-pressed={compared}
        className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold backdrop-blur transition ${
          compared
            ? "border-[#c9a227]/60 bg-[#c9a227] text-[#071a2f]"
            : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#071a2f]"
        }`}
      >
        <GitCompareArrows className="mr-2 size-4" />
        {compared ? "Added to compare" : "Compare"}
      </button>
      <button
        type="button"
        onClick={toggleSaved}
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#071a2f]"
      >
        <Heart className={`mr-2 size-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
        {saved ? "Saved" : "Save project"}
      </button>
      <button
        type="button"
        onClick={shareProject}
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#071a2f]"
      >
        {copied ? (
          <CheckCircle2 className="mr-2 size-4 text-emerald-400" />
        ) : (
          <Share2 className="mr-2 size-4" />
        )}
        {copied ? "Link copied" : "Share"}
      </button>
    </div>
  );
}
