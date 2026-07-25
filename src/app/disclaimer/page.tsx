import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | Asher Realty",
  description:
    "Important information regarding property prices, specifications, availability and project details displayed by Asher Realty.",
};

export default function DisclaimerPage() {
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
            Disclaimer
          </h1>

          <p className="mt-5 text-sm text-slate-500">
            Last updated: July 2026
          </p>

          <div className="mt-10 space-y-9 leading-8 text-slate-600">
            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                General information
              </h2>

              <p className="mt-3">
                Information displayed on this website is provided for general
                reference and property discovery purposes. It should not be
                treated as a legal, financial or investment recommendation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Prices and availability
              </h2>

              <p className="mt-3">
                Property prices, floor plans, offers, configurations,
                specifications, possession timelines and availability are
                subject to change without prior notice. Buyers should verify all
                information directly with the relevant developer before making
                a decision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Images and visual material
              </h2>

              <p className="mt-3">
                Project images, illustrations and visual representations may be
                indicative. Final construction, landscaping, amenities and
                specifications may differ from visual material.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Developer trademarks
              </h2>

              <p className="mt-3">
                Developer names, project names, logos and trademarks belong to
                their respective owners. They are displayed only for project
                identification and informational purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">
                Buyer verification
              </h2>

              <p className="mt-3">
                Prospective buyers should independently verify project
                approvals, title documents, RERA registration, legal status,
                construction progress, payment schedules and contractual terms
                before booking or purchasing any property.
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}