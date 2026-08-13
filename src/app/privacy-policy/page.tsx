import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Asher Realty handles buyer, tenant, owner and property information shared through the platform.",
};

const sections = [
  {
    title: "Information you choose to share",
    text: "We may collect your name, phone number, email, preferred locations, budget, property requirement, visit preferences and conversation notes. If you submit a property, we may also collect its locality, project or building, configuration, area basis, commercial expectation, availability and your declared relationship to the property.",
  },
  {
    title: "Why we use it",
    text: "We use this information to respond to your request, create a suitable shortlist, coordinate property or service enquiries, arrange visits, review an owner submission, maintain follow-up records and improve the platform. A property enquiry does not automatically opt you into unrelated promotional communication.",
  },
  {
    title: "Owner submissions and publication",
    text: "A property submitted through the public form is private intake. It is not automatically published. Exact unit details, owner contact information, identity information, internal review notes and documents are not placed on a public listing. Public facts are considered only after a manual review and a clear discussion with the submitter.",
  },
  {
    title: "Photos and documents",
    text: "Signed-in owners may upload property photos to private storage for review. We use them to prepare and review a listing; they are not public until the property and media are approved. Images may be resized and metadata such as device location removed. Never upload Aadhaar, PAN, title deeds, agreements, bank statements, contact screenshots or photos you do not have permission to use.",
  },
  {
    title: "Client accounts and contact visibility",
    text: "A My Asher account stores your profile, property drafts, photos and review status. Your account email is used for secure sign-in. Public name, email and phone visibility are separate choices, are off by default and can be changed later. Asher-managed enquiries remain the recommended default.",
  },
  {
    title: "Sharing with service providers",
    text: "We do not sell personal information. Relevant information may be shared with a developer representative, owner, authorised representative, lender, lawyer, inspector or other service provider only when needed for the service you requested. Their own terms and privacy practices may apply, and their role should be made clear before you proceed.",
  },
  {
    title: "WhatsApp, analytics and external services",
    text: "Some actions open WhatsApp or another third-party service. Information sent there is also governed by that provider's terms. We may use privacy-conscious traffic and interaction analytics to understand which pages and journeys are useful; these tools should not be treated as a substitute for information you deliberately submit.",
  },
  {
    title: "Retention, correction and deletion",
    text: "We retain enquiry and submission records only for legitimate follow-up, service, safety, legal and operational needs. You may ask us to correct inaccurate information, stop non-essential communication, withdraw an unpublished owner submission or request deletion where retention is not legally required.",
  },
  {
    title: "Security and children",
    text: "Reasonable safeguards are used, but no internet service can guarantee complete security. This platform is intended for adults making property decisions and is not designed to knowingly collect personal information from children.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#eef2f3] py-12 sm:py-20">
      <article className="container-shell">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(7,26,47,.08)] sm:p-12">
          <Link href="/" className="text-sm font-semibold text-[#9a7410] transition hover:text-[#071a2f]">
            ← Back to Asher Realty
          </Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-[#a47b10]">Privacy &amp; data use</p>
          <h1 className="mt-4 text-5xl font-medium text-[#071a2f] sm:text-6xl">Privacy Policy</h1>
          <p className="mt-5 text-sm text-slate-500">Last updated: 13 August 2026</p>
          <p className="mt-8 rounded-2xl bg-[#f7f8fa] p-5 text-sm leading-7 text-slate-600">
            This notice applies to buyers, tenants, owners, landlords and other visitors using Asher Realty&apos;s website, forms, WhatsApp journeys and property-support services.
          </p>

          <div className="mt-10 space-y-9 leading-8 text-slate-600">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold text-[#071a2f]">{section.title}</h2>
                <p className="mt-3">{section.text}</p>
              </section>
            ))}

            <section>
              <h2 className="text-2xl font-semibold text-[#071a2f]">Contact and privacy requests</h2>
              <p className="mt-3">
                To ask a privacy question, correct information, withdraw an unpublished property submission or request deletion, email{" "}
                <a href="mailto:info@asherrealty.in" className="font-semibold text-[#071a2f] underline">info@asherrealty.in</a>{" "}
                or call <a href="tel:+919019697170" className="font-semibold text-[#071a2f] underline">+91 90196 97170</a>.
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
