"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Mehta",
    profile: "Apartment Buyer",
    location: "Whitefield",
    quote:
      "Asher Realty helped us compare multiple projects without pressure. The guidance was clear, practical and genuinely useful.",
  },
  {
    name: "Priya Nair",
    profile: "First-Time Homebuyer",
    location: "Sarjapur Road",
    quote:
      "We received a shortlist based on our actual budget instead of random recommendations. It saved us a great deal of time.",
  },
  {
    name: "Arjun Rao",
    profile: "Property Investor",
    location: "North Bengaluru",
    quote:
      "The location comparison and investment perspective helped me evaluate the projects more confidently.",
  },
];

export default function Testimonials() {
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
            Client Experiences
          </p>

          <h2 className="mt-4 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
            Trusted guidance for important decisions
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Our approach is centred on clear information, thoughtful comparison
            and personalised property recommendations.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              className="group relative rounded-[1.75rem] border border-slate-200 bg-[#f7f8fa] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/35 hover:bg-white hover:shadow-[0_20px_60px_rgba(7,26,47,0.10)] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="size-4 fill-[#c9a227] text-[#c9a227]"
                    />
                  ))}
                </div>

                <Quote className="size-9 text-[#c9a227]/25" />
              </div>

              <blockquote className="mt-7 text-lg leading-8 text-[#071a2f]">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="font-semibold text-[#071a2f]">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {testimonial.profile} · {testimonial.location}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-7 text-center text-xs leading-5 text-slate-400">
          Replace these sample testimonials with verified client feedback before
          publishing the website.
        </p>
      </div>
    </section>
  );
}