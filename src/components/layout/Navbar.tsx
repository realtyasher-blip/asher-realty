"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Menu, MessageCircle, Search } from "lucide-react";

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
  { label: "Home Match", href: "/home-match" },
  { label: "Buy", href: "/projects" },
  { label: "Areas", href: "/locations" },
  { label: "TrueCost", href: "/true-cost" },
  { label: "Buyer Benefits", href: "/buyer-advantage" },
  { label: "Saved Homes", href: "/my-search" },
];

const advisorUrl = `https://wa.me/919019697170?text=${encodeURIComponent(
  "Hi Asher Realty, I would like help finding the right home in Bengaluru."
)}`;

export default function Navbar() {
  const pathname = usePathname();

  function openSearch() {
    window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
  }

  return (
    <header className="fixed inset-x-0 top-3 z-50 text-white">
      <div className="container-shell">
        <div className="flex h-[4.35rem] items-center justify-between rounded-[1.35rem] border border-white/10 bg-[#041421]/92 px-3 shadow-[0_16px_50px_rgba(0,0,0,.2)] backdrop-blur-2xl sm:px-4">
          <Link href="/" aria-label="Asher Realty home" className="flex items-center">
            <BrandLogo className="h-11 w-[164px] sm:w-[184px]" />
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
                    "rounded-full px-4 py-2 text-[11px] font-semibold transition",
                    active
                      ? "bg-white/[0.11] text-[#f0d477]"
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
              aria-label="Search projects and areas"
              className="flex size-11 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#c9a227]/40 hover:text-white"
            >
              <Search className="size-4" />
            </button>
            <Link
              href="/crm"
              aria-label="Open Asher Realty staff CRM"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-4 text-[11px] font-semibold text-white/65 transition hover:border-[#c9a227]/40 hover:bg-white/[0.06] hover:text-[#f0d477]"
            >
              <Lock className="mr-2 size-3.5 text-[#e4c462]" />
              CRM Login
            </Link>
            <a
              href={advisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-label="Navbar advisor chat"
              className={cn(
                buttonVariants(),
                "shine-button h-11 rounded-full bg-[#c9a227] px-5 text-xs text-[#071a2f] hover:bg-[#e4c462]"
              )}
            >
              <MessageCircle className="mr-2 size-4" />
              Talk to an advisor
            </a>
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
                    Where would you like to go?
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-9 flex flex-col gap-2 px-1">
                  <button
                    type="button"
                    onClick={openSearch}
                    className="mb-3 flex h-12 w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-left text-sm font-semibold text-white/75 transition hover:border-[#c9a227]/40 hover:text-white"
                  >
                    <Search className="size-5 text-[#e4c462]" />
                    Search projects or areas
                  </button>
                  {navigation.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl px-4 py-3 text-lg text-white/75 transition hover:bg-white/[0.06] hover:text-[#e4c462]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <Link
                    href="/crm"
                    className="mt-3 flex h-12 w-full items-center gap-3 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 text-sm font-semibold text-[#f0d477] transition hover:bg-[#c9a227]/15"
                  >
                    <Lock className="size-5" />
                    Staff CRM Login
                  </Link>

                  <a
                    href={advisorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-label="Mobile menu advisor chat"
                    className={cn(
                      buttonVariants(),
                      "mt-5 w-full rounded-full bg-[#c9a227] text-[#071a2f] hover:bg-[#e4c462]"
                    )}
                  >
                    <MessageCircle className="mr-2 size-4" />
                    Talk to an advisor
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
