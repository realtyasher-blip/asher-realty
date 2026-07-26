"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Heart, Share2 } from "lucide-react";

const FAVOURITES_KEY = "asher-favourite-projects";
const RECENT_KEY = "asher-recent-projects";

export default function ProjectActions({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const favourites: string[] = JSON.parse(
          localStorage.getItem(FAVOURITES_KEY) || "[]"
        );
        setSaved(favourites.includes(slug));
        const recent: string[] = JSON.parse(
          localStorage.getItem(RECENT_KEY) || "[]"
        );
        const nextRecent = [slug, ...recent.filter((item) => item !== slug)].slice(
          0,
          6
        );
        localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
      } catch {
        // Storage can be unavailable in privacy-restricted browsers.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [slug]);

  function toggleSaved() {
    try {
      const favourites: string[] = JSON.parse(
        localStorage.getItem(FAVOURITES_KEY) || "[]"
      );
      const next = favourites.includes(slug)
        ? favourites.filter((item) => item !== slug)
        : [...favourites, slug];
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next));
      setSaved(next.includes(slug));
    } catch {
      setSaved((current) => !current);
    }
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
