"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Share, X } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "asher-app-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function PwaRegistration() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerWorker = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      };
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(registerWorker, { timeout: 4000 });
      } else {
        globalThis.setTimeout(registerWorker, 2500);
      }
    }

    if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
      window.setTimeout(() => setShow(true), 2200);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) {
      window.setTimeout(() => {
        setIosHelp(true);
        setShow(true);
      }, 2200);
    }

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setShow(false);
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setShow(false);
    setPrompt(null);
  }

  if (!show) return null;

  return (
    <aside className="fixed bottom-[5.4rem] left-3 right-3 z-[80] mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#071a2f] p-4 text-white shadow-[0_24px_70px_rgba(7,26,47,.35)] lg:bottom-6 lg:left-auto lg:right-6">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss app installation"
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/10 text-white/65 transition hover:text-white"
      >
        <X className="size-4" />
      </button>

      <div className="flex gap-3 pr-8">
        <Image
          src="/brand/app-icon-192.png"
          alt=""
          width={52}
          height={52}
          className="size-13 rounded-xl"
        />
        <div>
          <p className="text-sm font-bold">Install the Asher Realty app</p>
          <p className="mt-1 text-xs leading-5 text-white/60">
            Faster property search, saved homes and site-visit access from your
            home screen.
          </p>
        </div>
      </div>

      {iosHelp ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/8 px-4 py-3 text-xs text-white/75">
          <Share className="size-4 shrink-0 text-[#e4c462]" />
          Tap Share, then choose “Add to Home Screen”.
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void install()}
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#c9a227] text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
        >
          <Download className="mr-2 size-4" />
          Install App
        </button>
      )}
    </aside>
  );
}
