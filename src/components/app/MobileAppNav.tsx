"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, PlusCircle, Search, UserRound } from "lucide-react";

import { OPEN_SEARCH_EVENT } from "@/components/app/UniversalSearch";
import {
  BUYER_WORKSPACE_EVENT,
  readBuyerWorkspace,
  type BuyerWorkspaceSnapshot,
} from "@/lib/buyerWorkspace";

const emptyWorkspace: BuyerWorkspaceSnapshot = {
  favourites: [],
  comparison: [],
  recent: [],
};

function itemClass(active = false) {
  return `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition ${
    active ? "text-[#e4c462]" : "text-white/42 hover:text-white/70"
  }`;
}

function iconClass(active = false) {
  return `relative flex size-8 items-center justify-center rounded-xl transition ${
    active ? "bg-[#c9a227]/13" : ""
  }`;
}

export default function MobileAppNav() {
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

  if (pathname.startsWith("/crm")) return null;

  const postActive = pathname.startsWith("/post-property");
  const savedActive = pathname.startsWith("/my-search");
  const accountActive = pathname.startsWith("/account");

  return (
    <nav
      aria-label="Main mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#041421]/97 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-18px_50px_rgba(0,0,0,.25)] backdrop-blur-2xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-3">
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={itemClass(pathname === "/")}>
          <span className={iconClass(pathname === "/")}><Compass className="size-[19px]" /></span>
          Home
        </Link>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
          className={itemClass()}
          aria-label="Search all Asher Realty options"
        >
          <span className={iconClass()}><Search className="size-[19px]" /></span>
          Search
        </button>

        <Link href="/post-property" aria-current={postActive ? "page" : undefined} className={itemClass(postActive)}>
          <span className={iconClass(postActive)}><PlusCircle className="size-[19px]" /></span>
          Post Free
        </Link>

        <Link href="/my-search" aria-current={savedActive ? "page" : undefined} className={itemClass(savedActive)}>
          <span className={iconClass(savedActive)}>
            <Heart className="size-[19px]" />
            {workspace.favourites.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-[#c9a227] px-1 text-[9px] font-extrabold leading-4 text-[#071a2f] ring-2 ring-[#041421]">
                {workspace.favourites.length > 9 ? "9+" : workspace.favourites.length}
              </span>
            )}
          </span>
          Shortlist
        </Link>

        <Link href="/account" aria-current={accountActive ? "page" : undefined} className={itemClass(accountActive)}>
          <span className={iconClass(accountActive)}><UserRound className="size-[19px]" /></span>
          My Asher
        </Link>
      </div>
    </nav>
  );
}
