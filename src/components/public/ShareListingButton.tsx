"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareListingButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `See this reviewed Bengaluru property on Asher Realty: ${title}`,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2_000);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-live="polite"
      className="inline-flex h-12 items-center justify-center rounded-full border border-white/18 bg-white/[.08] px-5 text-xs font-bold text-white backdrop-blur transition hover:border-[#c9a227]/55 hover:text-[#f0d477]"
    >
      {copied ? (
        <Check className="mr-2 size-4 text-emerald-300" />
      ) : (
        <Share2 className="mr-2 size-4 text-[#e4c462]" />
      )}
      {copied ? "Link copied" : "Share property"}
    </button>
  );
}
