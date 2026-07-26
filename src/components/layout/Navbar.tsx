"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/brand/BrandLogo";

const navigation = [
  { label: "Projects", href: "/projects" },
  { label: "Locations", href: "/locations" },
  { label: "AI Match", href: "/#ai-match" },
  { label: "Compare", href: "/compare" },
  { label: "Market", href: "/#market" },
  { label: "Tools", href: "/tools" },
];

const whatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20am%20looking%20for%20a%20property%20in%20Bengaluru.";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071a2f]/90 text-white backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-white/80 transition hover:text-[#e4c462]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+919019697170"
            className="flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <Phone className="size-4 text-[#e4c462]" />
            9019697170
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "rounded-full bg-[#c9a227] px-6 text-[#071a2f] hover:bg-[#e4c462]"
            )}
          >
            Book Consultation
          </a>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-6" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="border-white/10 bg-[#071a2f] text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-white">
                  Asher Realty
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-10 flex flex-col gap-6 px-1">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg text-white/80 transition hover:text-[#e4c462]"
                  >
                    {item.label}
                  </Link>
                ))}

                <a
                  href="tel:+919019697170"
                  className="mt-2 flex items-center gap-3 text-white/80 transition hover:text-white"
                >
                  <Phone className="size-5 text-[#e4c462]" />
                  9019697170
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "mt-4 w-full rounded-full bg-[#c9a227] text-[#071a2f] hover:bg-[#e4c462]"
                  )}
                >
                  Chat on WhatsApp
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
