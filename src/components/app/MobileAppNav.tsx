"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  GitCompareArrows,
  Home,
  SearchCheck,
} from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/projects", icon: Building2 },
  { label: "My Search", href: "/my-search", icon: SearchCheck },
  { label: "Compare", href: "/compare", icon: GitCompareArrows },
  { label: "Visit", href: "/book-site-visit", icon: CalendarCheck },
];

export default function MobileAppNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/crm")) return null;

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_35px_rgba(7,26,47,.12)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-2">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            label === "Home"
              ? pathname === "/"
              : label === "Explore"
                ? pathname === "/projects"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition ${
                active ? "text-[#a77d08]" : "text-slate-400"
              }`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-xl transition ${
                  active ? "bg-[#c9a227]/12" : ""
                }`}
              >
                <Icon
                  className="size-[19px]"
                />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
