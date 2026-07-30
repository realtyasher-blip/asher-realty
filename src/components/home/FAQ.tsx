"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Does Asher Realty charge buyers a consultation fee?",
    answer:
      "Initial property consultation and project shortlisting are provided without a consultation charge. Any applicable commercial terms will be communicated transparently before proceeding.",
  },
  {
    question: "Can you arrange property site visits?",
    answer:
      "Yes. We can help coordinate site visits based on project availability, your preferred date and the developer's scheduling process.",
  },
  {
    question: "Which areas of Bengaluru do you cover?",
    answer:
      "We currently focus on key residential corridors including Whitefield, Sarjapur Road, Hebbal, North Bengaluru, Electronic City and Devanahalli.",
  },
  {
    question: "Can you help compare different projects?",
    answer:
      "Yes. We can help you compare pricing, location, configuration, amenities, developer reputation, possession timelines and suitability for self-use or investment.",
  },
  {
    question: "Do you provide home-loan assistance?",
    answer:
      "We can assist by explaining financing considerations and connecting buyers with suitable lending representatives. Final loan approval remains subject to the lender's eligibility and documentation process.",
  },
  {
    question: "How do I receive a personalised shortlist?",
    answer:
      "Share your budget, preferred location, property type and expected purchase timeline through the consultation form or WhatsApp. We will then recommend relevant options.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="content-auto-section overflow-hidden bg-[#f7f8fa] py-24 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
              Helpful answers before you begin
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
              Learn more about our consultation, project comparison and
              property-search process.
            </p>

            <a
              href="https://wa.me/919019697170?text=Hi%20Asher%20Realty%2C%20I%20have%20a%20question%20about%20buying%20a%20property%20in%20Bengaluru."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-13 items-center justify-center rounded-full bg-[#071a2f] px-7 text-sm font-semibold text-white transition hover:bg-[#c9a227] hover:text-[#071a2f]"
            >
              <MessageCircle className="mr-2 size-4" />
              Ask on WhatsApp
            </a>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 p-6 text-left sm:p-7"
                  >
                    <span className="text-lg font-semibold text-[#071a2f]">
                      {faq.question}
                    </span>

                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f7f8fa]">
                      <ChevronDown
                        className={`size-5 text-[#c9a227] transition duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-slate-100 px-6 py-6 leading-7 text-slate-600 sm:px-7">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
