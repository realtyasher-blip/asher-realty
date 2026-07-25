import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Asher Realty",
  description:
    "Read how Asher Realty collects, uses and protects information shared through the website.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] py-20">
      <article className="container-shell">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-12">
          <Link
            href="/"
            className="text-sm font-semibold text-[#c9a227] transition hover:text-[#071a2f]"
          >
            ← Back to Asher Realty
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            Legal
          </p>

          <h1 className="mt-4 text-5xl font-medium text-[#071a2f]">
            Privacy Policy
          </h1>

          <p className="mt-5 text-sm text-slate-500">
            Last updated: July 2026
          </p>

          <div className="mt-10 space-y-9 leading-8 text-slate-600">
            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Information we collect
              </h2>

              <p className="mt-3">
                We may collect information that you voluntarily provide,
                including your name, telephone number, preferred location,
                property budget and other details related to your property
                requirement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                How we use your information
              </h2>

              <p className="mt-3">
                Information submitted through this website may be used to
                respond to enquiries, recommend relevant properties, coordinate
                site visits and provide property-related assistance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                WhatsApp and third-party services
              </h2>

              <p className="mt-3">
                Some enquiry forms redirect users to WhatsApp. Information
                shared through WhatsApp is also subject to WhatsApp&apos;s own
                privacy terms and policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Information sharing
              </h2>

              <p className="mt-3">
                We do not sell personal information. Information may be shared
                with relevant developers, project representatives or service
                partners when necessary to respond to a property enquiry or
                coordinate requested services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Data security
              </h2>

              <p className="mt-3">
                Reasonable measures are taken to protect information submitted
                through the website. However, no internet-based system can
                guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Contact
              </h2>

              <p className="mt-3">
                For privacy-related questions, contact Asher Realty at{" "}
                <a
                  href="mailto:info@asherrealty.in"
                  className="font-semibold text-[#071a2f] underline"
                >
                  info@asherrealty.in
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+919019697170"
                  className="font-semibold text-[#071a2f] underline"
                >
                  +91 90196 97170
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}