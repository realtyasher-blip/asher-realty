"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search, Sparkles } from "lucide-react";

import { OPEN_SEARCH_EVENT } from "@/components/app/UniversalSearch";
import BrandLogo from "@/components/brand/BrandLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Projects", href: "/projects" },
  { label: "AI Match", href: "/decision-lab" },
  { label: "Areas", href: "/locations" },
  { label: "Market Data", href: "/intelligence" },
  { label: "Buyer Guides", href: "/guides" },
  { label: "Compare", href: "/compare" },
];

export default function Navbar() {
  const pathname = usePathname();

  function openSearch() {
    window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
  }

  return (
    <header className="fixed inset-x-0 top-3 z-50 text-white">
      <div className="container-shell">
        <div className="flex h-[4.35rem] items-center justify-between rounded-[1.35rem] border border-white/10 bg-[#041421]/88 px-3 shadow-[0_16px_50px_rgba(0,0,0,.2)] backdrop-blur-2xl sm:px-4">
          <Link href="/" className="group flex items-center gap-3">
            <BrandLogo className="h-11 w-[168px] sm:w-[186px]" />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.045] p-1 xl:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[11px] font-semibold transition",
                    active
                      ? "bg-white/[0.1] text-[#f0d477]"
                      : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search projects, locations, guides and tools"
              className="flex h-11 items-center gap-2 rounded-full border border-white/10 px-3.5 text-xs font-semibold text-white/60 transition hover:border-[#c9a227]/40 hover:text-white"
            >
              <Search className="size-4 text-[#e4c462]" />
              Search
              <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/35">
                ⌘K
              </kbd>
            </button>
            <a
              href="tel:+919019697170"
              aria-label="Call Asher Realty"
              className="flex size-11 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-[#c9a227]/45 hover:text-[#e4c462]"
            >
              <Phone className="size-4" />
            </a>

            <Link
              href="/decision-lab"
              data-analytics-label="Navbar Decision Lab"
              className={cn(
                buttonVariants(),
                "shine-button h-11 rounded-full bg-[#c9a227] px-5 text-xs text-[#071a2f] hover:bg-[#e4c462]"
              )}
            >
              <Sparkles className="mr-2 size-4" />
              Get AI shortlist
            </Link>
          </div>

          <div className="xl:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-white/10 text-white hover:bg-white/10 hover:text-white"
                    aria-label="Open navigation menu"
                  />
                }
              >
                <Menu className="size-6" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="border-white/10 bg-[#041421] text-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-white">
                    Asher Realty
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-10 flex flex-col gap-6 px-1">
                  <button
                    type="button"
                    onClick={openSearch}
                    className="flex h-12 w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-left text-sm font-semibold text-white/75 transition hover:border-[#c9a227]/40 hover:text-white"
                  >
                    <Search className="size-5 text-[#e4c462]" />
                    Search the entire platform
                  </button>
                  {navigation.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-lg text-white/75 transition hover:text-[#e4c462]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <a
                    href="tel:+919019697170"
                    className="mt-2 flex items-center gap-3 text-white/75 transition hover:text-white"
                  >
                    <Phone className="size-5 text-[#e4c462]" />
                    +91 90196 97170
                  </a>

                  <Link
                    href="/decision-lab"
                    data-analytics-label="Mobile menu Decision Lab"
                    className={cn(
                      buttonVariants(),
                      "mt-4 w-full rounded-full bg-[#c9a227] text-[#071a2f] hover:bg-[#e4c462]"
                    )}
                  >
                    <Sparkles className="mr-2 size-4" />
                    Get my AI shortlist
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
