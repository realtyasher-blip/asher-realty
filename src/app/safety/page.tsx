import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  EyeOff,
  FileWarning,
  Fingerprint,
  LockKeyhole,
  MessageCircle,
  Phone,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Property Safety, Privacy & Fraud Prevention | Asher Realty",
  description:
    "Protect yourself during Bengaluru property enquiries: avoid payment fraud, report incorrect information, keep Aadhaar and PAN out of public forms, and request data correction or deletion.",
};

const beforePaying = [
  {
    icon: UserRoundCheck,
    title: "Confirm who you are dealing with",
    text: "Independently confirm the identity, role and authority of the owner, representative, developer or service provider.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Do not pay from a chat message alone",
    text: "Verify the recipient name, bank details, written commercial terms and purpose of payment through an independently confirmed channel.",
  },
  {
    icon: FileWarning,
    title: "Check the exact property and document scope",
    text: "Match the unit, phase, address, area basis, price, availability and documents to the transaction you are considering.",
  },
  {
    icon: ShieldCheck,
    title: "Use an appropriate professional",
    text: "Seek independent legal, lending, inspection or tax advice when the decision requires that specialist judgement.",
  },
] as const;

const warningSigns = [
  "Pressure to transfer a token immediately to preserve a special price",
  "A payment account whose name does not match the confirmed recipient",
  "Requests to continue only on a new number or private messaging account",
  "Refusal to show the property, authority evidence or written commercial terms",
  "Photos, price or availability that conflict across messages or sources",
  "A demand for Aadhaar, PAN, OTP, card details or banking passwords in a public form",
];

export default function SafetyPage() {
  const reportMessage = `Hi Asher Realty, I would like to report potentially incorrect or unsafe property information.

Page or project:
Detail I believe is incorrect:
How I noticed it:

I understand I should not send Aadhaar, PAN, OTPs, banking passwords or sensitive title documents in this chat.`;
  const deletionMessage = `Hi Asher Realty, I would like to request access, correction or deletion of personal information I previously submitted.

My name:
Mobile number used:
Request type: Access / Correction / Deletion
Submission or enquiry context:

Please tell me what identity confirmation is needed. I will not send Aadhaar or PAN in this initial message.`;

  return (
    <>
      <Navbar />
      <main className="bg-[#eef2f3] pt-20">
        <section className="relative overflow-hidden bg-[#041421] py-16 text-white sm:py-24">
          <div className="premium-grid absolute inset-0 opacity-25" />
          <div className="absolute -right-36 top-0 size-[32rem] rounded-full bg-rose-500/10 blur-3xl" />
          <div className="container-shell relative grid gap-10 lg:grid-cols-[1fr_.68fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4c462]">
                <ShieldCheck className="size-4" /> Property safety centre
              </p>
              <h1 className="mt-5 max-w-4xl text-6xl font-medium leading-[.96] sm:text-7xl">
                Pause. Confirm. Then proceed.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-white/62 sm:text-base">
                Protect your identity, money and property information at every
                stage. No project page, owner submission or message should be the
                sole basis for paying money or signing a transaction document.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-rose-300/20 bg-rose-400/10 p-6">
              <AlertTriangle className="size-7 text-rose-300" />
              <h2 className="mt-4 text-2xl font-semibold">Never share in a public form</h2>
              <p className="mt-3 text-xs leading-6 text-white/60">
                Aadhaar, PAN, OTPs, card details, UPI PINs, banking passwords,
                unredacted title deeds, Khata, tax receipts or loan statements.
                Asher Realty&apos;s public property form does not request document
                uploads.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="container-shell">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7410]">
                Before a payment or commitment
              </p>
              <h2 className="mt-4 text-5xl font-medium text-[#071a2f]">
                Four checks worth slowing down for.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {beforePaying.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(7,26,47,.05)]"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold text-[#071a2f]">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-slate-500">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.8fr]">
              <article className="rounded-[1.7rem] border border-slate-200 bg-white p-6 sm:p-8">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-rose-700">
                  <EyeOff className="size-4" /> Common warning signs
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {warningSigns.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-2xl bg-[#f8f9fa] p-4 text-xs leading-6 text-slate-600"
                    >
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[1.7rem] bg-[#071a2f] p-6 text-white sm:p-8">
                <MessageCircle className="size-7 text-[#e4c462]" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#e4c462]">
                  Report incorrect or suspicious information
                </p>
                <h2 className="mt-3 text-3xl font-medium">Tell the Asher team.</h2>
                <p className="mt-4 text-xs leading-6 text-white/58">
                  Include the page or project and the detail you believe is wrong.
                  Do not include Aadhaar, PAN, OTPs, banking credentials or
                  sensitive title documents in the initial report.
                </p>
                <a
                  href={`https://wa.me/919019697170?text=${encodeURIComponent(reportMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 items-center rounded-full bg-[#c9a227] px-6 text-xs font-bold text-[#071a2f]"
                >
                  <MessageCircle className="mr-2 size-4" /> Report on WhatsApp
                </a>
                <a
                  href="tel:+919019697170"
                  className="mt-3 flex w-fit items-center text-xs font-bold text-white/65 transition hover:text-white"
                >
                  <Phone className="mr-2 size-4 text-[#e4c462]" /> +91 90196 97170
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="container-shell grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.7rem] border border-slate-200 bg-[#f8f9fa] p-7 sm:p-9">
              <LockKeyhole className="size-7 text-[#9a7410]" />
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#9a7410]">
                Privacy by purpose
              </p>
              <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
                Share only what the current step needs.
              </h2>
              <p className="mt-4 text-xs leading-7 text-slate-600">
                Public forms collect contact and property requirements so Asher
                Realty can respond to that request. Sensitive ownership or identity
                records should be requested only later through an agreed private
                process, with the reason and recipient made clear.
              </p>
              <Link
                href="/privacy-policy"
                className="mt-6 inline-flex items-center text-xs font-bold text-[#8d690b]"
              >
                Read the privacy policy <ArrowRight className="ml-2 size-4" />
              </Link>
            </article>

            <article className="rounded-[1.7rem] border border-slate-200 bg-[#f8f9fa] p-7 sm:p-9">
              <Trash2 className="size-7 text-[#9a7410]" />
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#9a7410]">
                Access, correction or deletion
              </p>
              <h2 className="mt-3 text-4xl font-medium text-[#071a2f]">
                Ask us to review your personal data.
              </h2>
              <p className="mt-4 text-xs leading-7 text-slate-600">
                Send your name, the mobile number used and whether you want access,
                correction or deletion. We may need proportionate identity
                confirmation before acting, but do not send Aadhaar or PAN in the
                initial request.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/919019697170?text=${encodeURIComponent(deletionMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-full bg-[#071a2f] px-5 text-xs font-bold text-white"
                >
                  <MessageCircle className="mr-2 size-4 text-[#e4c462]" /> WhatsApp request
                </a>
                <a
                  href="mailto:info@asherrealty.in?subject=Personal%20data%20request"
                  className="inline-flex h-11 items-center rounded-full border border-[#071a2f]/15 bg-white px-5 text-xs font-bold text-[#071a2f]"
                >
                  Email request
                </a>
              </div>
            </article>

            <div className="lg:col-span-2 rounded-[1.7rem] border border-amber-200 bg-amber-50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <Fingerprint className="mt-0.5 size-6 shrink-0 text-amber-700" />
                <div>
                  <h2 className="text-2xl font-semibold text-[#071a2f]">
                    If you already shared something sensitive
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-amber-950/70">
                    Contact the receiving organisation immediately and ask what was
                    retained or forwarded. If financial credentials or an OTP were
                    exposed, contact your bank or payment provider through its
                    official channel. Preserve relevant messages and report suspected
                    fraud to the appropriate official authority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
