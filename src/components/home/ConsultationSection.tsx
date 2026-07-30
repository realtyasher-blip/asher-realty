import Image from "next/image";
import {
  BadgeCheck,
  CalendarCheck,
  MessageCircle,
  Phone,
} from "lucide-react";

import ConsultationForm from "@/components/forms/ConsultationForm";

const points = [
  {
    icon: BadgeCheck,
    text: "Personalised project shortlist",
  },
  {
    icon: CalendarCheck,
    text: "Guided site-visit coordination",
  },
  {
    icon: MessageCircle,
    text: "Direct WhatsApp support",
  },
];

export default function ConsultationSection() {
  return (
    <section
      id="contact"
      className="content-auto-section overflow-hidden bg-[#f7f8fa] py-24 sm:py-28"
    >
      <div className="container-shell">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#071a2f] shadow-[0_30px_100px_rgba(7,26,47,0.18)] lg:grid-cols-2">
          <div
            className="relative min-h-[520px]"
          >
            <Image
              src="/images/consultant.jpg"
              alt="Asher Realty property consultation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071a2f] via-[#071a2f]/45 to-transparent" />

            <div className="absolute right-0 bottom-0 left-0 p-7 text-white sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e4c462]">
                Property Consultation
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-medium leading-tight sm:text-5xl">
                Let&apos;s find the right property for you.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/70">
                Share your budget, preferred location and property goals. We
                will help you identify and compare suitable Bengaluru projects.
              </p>

              <div className="mt-7 space-y-4">
                {points.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[#c9a227]/15">
                      <Icon className="size-4 text-[#e4c462]" />
                    </div>

                    <span className="text-sm text-white/80">{text}</span>
                  </div>
                ))}
              </div>

              <a
                href="tel:+919019697170"
                className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-white transition hover:text-[#e4c462]"
              >
                <Phone className="size-5 text-[#e4c462]" />
                Call 9019697170
              </a>
            </div>
          </div>

          <div
            className="flex items-center bg-white p-6 sm:p-10 lg:p-12"
          >
            <div className="w-full">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                Free Consultation
              </p>

              <h3 className="mt-4 text-4xl font-medium text-[#071a2f]">
                Tell us what you are looking for
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Complete the form and continue the conversation directly on
                WhatsApp.
              </p>

              <div className="mt-8">
                <ConsultationForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
