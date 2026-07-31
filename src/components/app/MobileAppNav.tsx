"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  GitCompareArrows,
  Home,
  Sparkles,
} from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/projects", icon: Building2 },
  { label: "AI Match", href: "/#ai-match", icon: Sparkles, primary: true },
  { label: "Compare", href: "/compare", icon: GitCompareArrows },
  { label: "Visit", href: "/book-site-visit", icon: CalendarCheck },
];

export default function MobileAppNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/crm")) return null;

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#041421]/96 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-18px_50px_rgba(0,0,0,.25)] backdrop-blur-2xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-2">
        {items.map(({ label, href, icon: Icon, primary }) => {
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
                primary
                  ? "-mt-5 text-[#e4c462]"
                  : active
                    ? "text-[#e4c462]"
                    : "text-white/40"
              }`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-xl transition ${
                  primary
                    ? "size-12 rounded-full border-4 border-[#041421] bg-[#c9a227] text-[#071a2f] shadow-[0_10px_30px_rgba(201,162,39,.28)]"
                    : active
                      ? "bg-[#c9a227]/12"
                      : ""
                }`}
              >
                <Icon className={primary ? "size-5" : "size-[19px]"} />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
