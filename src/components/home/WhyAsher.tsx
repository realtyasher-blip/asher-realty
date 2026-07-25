"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarCheck,
  Handshake,
  Home,
  Landmark,
  Scale,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Verified Projects",
    description:
      "We focus on established developers and carefully selected residential projects.",
  },
  {
    icon: Scale,
    title: "Transparent Guidance",
    description:
      "Clear comparisons, honest information and practical advice without unnecessary pressure.",
  },
  {
    icon: Home,
    title: "Personalised Shortlisting",
    description:
      "Project recommendations based on your budget, location, lifestyle and investment goals.",
  },
  {
    icon: CalendarCheck,
    title: "Guided Site Visits",
    description:
      "We help coordinate project visits and support you throughout the property evaluation process.",
  },
  {
    icon: Landmark,
    title: "Home Loan Assistance",
    description:
      "Support with understanding financing options and connecting with suitable lending partners.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support",
    description:
      "Assistance from initial discovery and comparisons through booking and documentation coordination.",
  },
];

export default function WhyAsher() {
  return (
    <section
      id="about"
      className="overflow-hidden bg-[#071a2f] py-24 text-white sm:py-28"
    >
      <div className="container-shell">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e4c462]">
              Why Asher Realty
            </p>

            <h2 className="mt-5 text-5xl font-medium leading-tight sm:text-6xl">
              Better decisions begin with better guidance.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
              Buying a property involves more than choosing a floor plan. We
              help you understand locations, compare projects and evaluate the
              options that best match your requirements.
            </p>

            <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="font-[var(--font-heading)] text-3xl text-[#e4c462]">
                Find Better. Invest Smarter.
              </p>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Our goal is to make the Bengaluru property journey clearer,
                simpler and more informed.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.07,
                }}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/40 hover:bg-white/10"
              >
                <div className="flex size-12 items-center justify-center rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10">
                  <Icon className="size-5 text-[#e4c462]" />
                </div>

                <h3 className="mt-6 text-2xl font-medium">{title}</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}