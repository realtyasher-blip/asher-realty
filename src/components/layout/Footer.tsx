import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import BrandLogo from "@/components/brand/BrandLogo";

const exploreLinks = [
  { label: "Buy New Projects", href: "/projects" },
  { label: "Find a Rental", href: "/rent" },
  { label: "Find a Resale Home", href: "/resale" },
  { label: "Bengaluru Areas", href: "/locations" },
  { label: "Builders", href: "/builders" },
  { label: "Property Guides", href: "/guides" },
];

const supportLinks = [
  { label: "My Asher Account", href: "/account" },
  { label: "Manage My Properties", href: "/account" },
  { label: "Post Property FREE", href: "/post-property" },
  { label: "Owner Readiness Checklist", href: "/owner-checklist" },
  { label: "How We Review", href: "/how-we-verify" },
  { label: "End-to-End Services", href: "/services" },
  { label: "AI Home Match", href: "/home-match" },
  { label: "Total Cost Calculator", href: "/true-cost" },
  { label: "RERA Watch", href: "/rera-watch" },
  { label: "Compare Properties", href: "/compare" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#041221] pb-20 text-white lg:pb-0">
      <div className="container-shell py-16">
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[1.2fr_.85fr_.95fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <BrandLogo />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              End-to-end Bengaluru property support for buying, renting,
              selling and renting out—with one clear point of coordination.
            </p>
            <p className="mt-5 font-[var(--font-heading)] text-xl text-[#e4c462]">
              Find Better. Invest Smarter.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Explore Property</h2>
            <nav className="mt-6 flex flex-col gap-4" aria-label="Explore property">
              {exploreLinks.map((link) => (
                <Link key={link.label} href={link.href} className="w-fit text-sm text-white/55 transition hover:text-[#e4c462]">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Owners &amp; Support</h2>
            <nav className="mt-6 flex flex-col gap-4" aria-label="Owner and support services">
              {supportLinks.map((link) => (
                <Link key={link.label} href={link.href} className="w-fit text-sm text-white/55 transition hover:text-[#e4c462]">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Speak to Asher</h2>
            <div className="mt-6 space-y-5">
              <a href="tel:+919019697170" className="flex items-start gap-3 text-sm text-white/60 transition hover:text-white">
                <Phone className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                +91 90196 97170
              </a>
              <a href="https://wa.me/919019697170" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-white/60 transition hover:text-white">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                Chat on WhatsApp
              </a>
              <a href="mailto:info@asherrealty.in" className="flex items-start gap-3 text-sm text-white/60 transition hover:text-white">
                <Mail className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                info@asherrealty.in
              </a>
              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                Bengaluru, Karnataka
              </div>
              <Link href="/crm" className="inline-flex h-10 items-center rounded-full border border-white/10 px-4 text-xs text-white/45 transition hover:border-[#c9a227]/40 hover:text-[#e4c462]">
                Staff CRM login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-5 text-xs leading-6 text-white/40 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p>© {year} Asher Realty. All rights reserved.</p>
              <Link href="/privacy-policy" className="transition hover:text-[#e4c462]">Privacy Policy</Link>
              <Link href="/disclaimer" className="transition hover:text-[#e4c462]">Disclaimer</Link>
              <Link href="/safety" className="transition hover:text-[#e4c462]">Safety</Link>
            </div>
            <p className="max-w-3xl">
              Asher Realty provides independent property information, advisory
              and coordination support. Project and owner-submitted information,
              pricing, availability and documents require independent verification.
              Specialist services are delivered by the relevant provider under
              separately disclosed terms.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
