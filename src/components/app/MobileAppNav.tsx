"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Compass, Heart, Search } from "lucide-react";

import {
  BUYER_WORKSPACE_EVENT,
  readBuyerWorkspace,
  type BuyerWorkspaceSnapshot,
} from "@/lib/buyerWorkspace";

const items = [
  { label: "Discover", href: "/", icon: Compass },
  { label: "Search", href: "/projects", icon: Search },
  { label: "Saved", href: "/my-search", icon: Heart },
  { label: "Visits", href: "/book-site-visit", icon: CalendarCheck },
];

const emptyWorkspace: BuyerWorkspaceSnapshot = {
  favourites: [],
  comparison: [],
  recent: [],
};

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

  return (
    <nav
      aria-label="Main mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#041421]/97 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-18px_50px_rgba(0,0,0,.25)] backdrop-blur-2xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 px-3">
        {items.map(({ label, href, icon: Icon }) => {
          const badge = label === "Saved" ? workspace.favourites.length : 0;
          const active =
            label === "Discover"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition ${
                active ? "text-[#e4c462]" : "text-white/42"
              }`}
            >
              <span
                className={`relative flex size-8 items-center justify-center rounded-xl transition ${
                  active ? "bg-[#c9a227]/13" : ""
                }`}
              >
                <Icon className="size-[19px]" />
                {badge > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-[#c9a227] px-1 text-[9px] font-extrabold leading-4 text-[#071a2f] ring-2 ring-[#041421]">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
