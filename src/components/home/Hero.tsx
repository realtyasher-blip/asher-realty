"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: Building2,
    value: "Premium",
    label: "Residential Projects",
  },
  {
    icon: MapPin,
    value: "Bengaluru",
    label: "Focused Expertise",
  },
  {
    icon: CalendarCheck,
    value: "Free",
    label: "Guided Site Visits",
  },
  {
    icon: ShieldCheck,
    value: "Trusted",
    label: "Buyer Assistance",
  },
];

const whatsappUrl =
  "https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20am%20looking%20for%20a%20property%20in%20Bengaluru.";

export default function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#071a2f] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7,26,47,0.98) 0%, rgba(7,26,47,0.82) 45%, rgba(7,26,47,0.35) 100%), url('/images/hero-property.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.18),transparent_36%)]" />

      <div className="container-shell relative flex min-h-screen items-center pt-28 pb-16">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-[#e4c462]"
          >
            Premium Bengaluru Real Estate Advisory
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl text-6xl leading-[0.95] font-medium tracking-tight sm:text-7xl lg:text-8xl"
          >
            Find Better.
            <span className="mt-2 block text-[#e4c462]">
              Invest Smarter.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg"
          >
            Explore premium apartments, villas and investment opportunities
            across Bengaluru with personalised guidance, project comparisons
            and site-visit assistance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#projects"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-full bg-[#c9a227] px-8 text-[#071a2f] hover:bg-[#e4c462]"
              )}
            >
              Explore Projects
              <ArrowRight className="ml-2 size-4" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  size: "lg",
                  variant: "outline",
                }),
                "h-14 rounded-full border-white/30 bg-white/5 px-8 text-white backdrop-blur hover:bg-white hover:text-[#071a2f]"
              )}
            >
              Chat on WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-14 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4"
          >
            {highlights.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
              >
                <Icon className="mb-4 size-5 text-[#e4c462]" />

                <p className="font-semibold text-white">{value}</p>

                <p className="mt-1 text-xs leading-5 text-white/55">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#c9a227]/60 to-transparent" />
    </section>
  );
}