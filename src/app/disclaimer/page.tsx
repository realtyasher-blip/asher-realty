import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform Disclaimer",
  description: "Important scope, verification and service disclosures for Asher Realty property information and owner submissions.",
};

const sections = [
  {
    title: "Independent information and coordination platform",
    text: "Asher Realty provides property information, advisory and coordination support. It is not the developer, government authority, lender, legal adviser or title insurer. The exact role of Asher Realty and any applicable fee should be confirmed before a transaction or paid service begins.",
  },
  {
    title: "Project, rental and resale information",
    text: "Prices, configurations, floor plans, specifications, possession dates, availability, offers, rent, deposit and maintenance can change. Builder-provided and owner-submitted information must be reconfirmed with the responsible party before relying on it.",
  },
  {
    title: "Owner property submissions",
    text: "Submitting a property is a request for review, not an instant public advertisement, guaranteed tenant or guaranteed sale. A declaration by a submitter does not itself establish ownership, authority, marketability or clear title. Asher may request clarification, decline or remove an option, or keep it private until review is complete.",
  },
  {
    title: "Valuation and market context",
    text: "Any price range, rent estimate, yield, trend, comparison or AI-generated explanation is indicative decision support based on available information. It is not a certified valuation, investment guarantee or prediction of future appreciation.",
  },
  {
    title: "Documents, RERA and legal checks",
    text: "Buyers, tenants and owners should independently verify identity, authority, title, approvals, RERA registration where applicable, sanctioned plans, EC, Khata or e-Khata, tax status, OC/CC, UDS, loan obligations, society requirements and contractual terms with the relevant authority and qualified professional.",
  },
  {
    title: "Images, video and trademarks",
    text: "Visuals may include official marketing material, artistic impressions, owner-supplied media or representative imagery. Final condition may differ. Developer names, project names, logos and trademarks belong to their respective owners and are shown for identification and information only.",
  },
  {
    title: "Specialist and partner services",
    text: "Loan approval, legal opinion, inspection, registration, agreement, photography, interiors, moving and other specialist work is performed by the relevant provider under their own eligibility, scope, fee and terms. Asher Realty does not issue government records, approve loans or provide a legal title guarantee.",
  },
];

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#eef2f3] py-12 sm:py-20">
      <article className="container-shell">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(7,26,47,.08)] sm:p-12">
          <Link href="/" className="text-sm font-semibold text-[#9a7410] transition hover:text-[#071a2f]">← Back to Asher Realty</Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-[#a47b10]">Platform scope</p>
          <h1 className="mt-4 text-5xl font-medium text-[#071a2f] sm:text-6xl">Disclaimer</h1>
          <p className="mt-5 text-sm text-slate-500">Last updated: 13 August 2026</p>
          <div className="mt-10 space-y-9 leading-8 text-slate-600">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold text-[#071a2f]">{section.title}</h2>
                <p className="mt-3">{section.text}</p>
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
