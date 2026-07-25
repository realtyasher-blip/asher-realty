import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "Locations", href: "#locations" },
  { label: "Why Asher", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const locations = [
  "Whitefield",
  "Sarjapur Road",
  "Hebbal",
  "North Bengaluru",
  "Electronic City",
  "Devanahalli",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#041221] text-white">
      <div className="container-shell py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              Premium property advisory for apartments, villas and investment
              opportunities across Bengaluru.
            </p>

            <p className="mt-5 font-[var(--font-heading)] text-xl text-[#e4c462]">
              Find Better. Invest Smarter.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <div className="mt-6 flex flex-col gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-white/55 transition hover:text-[#e4c462]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Key Locations</h3>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {locations.map((location) => (
                <a
                  key={location}
                  href={`https://wa.me/919019697170?text=${encodeURIComponent(
                    `Hi Asher Realty, please share suitable properties around ${location}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/55 transition hover:text-[#e4c462]"
                >
                  {location}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact</h3>

            <div className="mt-6 space-y-5">
              <a
                href="tel:+919019697170"
                className="flex items-start gap-3 text-sm text-white/60 transition hover:text-white"
              >
                <Phone className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                +91 90196 97170
              </a>

              <a
                href="https://wa.me/919019697170"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-white/60 transition hover:text-white"
              >
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                Chat on WhatsApp
              </a>

              <a
                href="mailto:info@asherrealty.in"
                className="flex items-start gap-3 text-sm text-white/60 transition hover:text-white"
              >
                <Mail className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                info@asherrealty.in
              </a>

              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 size-5 shrink-0 text-[#e4c462]" />
                Bengaluru, Karnataka
              </div>

              <a
                href="#"
                aria-label="Asher Realty on Instagram"
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-4 text-sm text-white/60 transition hover:border-[#c9a227]/40 hover:text-[#e4c462]"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-5 text-xs leading-6 text-white/40 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
  <p>© {year} Asher Realty. All rights reserved.</p>

  <Link
    href="/privacy-policy"
    className="transition hover:text-[#e4c462]"
  >
    Privacy Policy
  </Link>

  <Link
    href="/disclaimer"
    className="transition hover:text-[#e4c462]"
  >
    Disclaimer
  </Link>
</div>

            <p className="max-w-3xl">
              Project information, prices, specifications and availability are
              subject to change and must be independently verified with the
              respective developer. Images and trademarks belong to their
              respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
