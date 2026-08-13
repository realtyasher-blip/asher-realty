import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  getPublicProfile,
  listPublicListingsByOwner,
  type PublicOwnerListing,
} from "@/lib/owner/public";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

function clean(value: string | null | undefined) {
  return value?.trim() || "";
}

function formatMoney(value: string) {
  const raw = clean(value).replace(/[₹,\s]/gu, "");
  const amount = Number(raw);
  if (!raw || !Number.isFinite(amount)) return clean(value);
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} Lakh`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

function listingTitle(listing: PublicOwnerListing) {
  const configuration = clean(listing.configuration);
  const type = clean(listing.property_type) || "Property";
  return `${configuration ? `${configuration} ` : ""}${type}`;
}

function listingPrice(listing: PublicOwnerListing) {
  return listing.intent === "Rent out"
    ? formatMoney(listing.monthly_rent) || "Rent on request"
    : formatMoney(listing.expected_price) || "Price on request";
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [profile, listings] = await Promise.all([
    getPublicProfile(slug),
    listPublicListingsByOwner(slug),
  ]);
  if (!profile || listings.length === 0) {
    return {
      title: "Profile not available | Asher Realty",
      robots: { index: false, follow: false },
    };
  }

  const name = clean(profile.display_name) || "Property owner";
  return {
    title: `${name} | Public property profile`,
    description: `See live, reviewed-for-publication Bengaluru properties shared by ${name} through Asher Realty.`,
    alternates: { canonical: `/profiles/${profile.slug}` },
  };
}

function PublicListingCard({ listing }: { listing: PublicOwnerListing }) {
  const photo =
    listing.photos.find((item) => item.is_cover) || listing.photos[0] || null;
  const title = listingTitle(listing);

  return (
    <article className="group overflow-hidden rounded-[1.65rem] border border-slate-200 bg-white shadow-[0_16px_55px_rgba(7,26,47,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,26,47,.11)]">
      <Link href={`/listings/${listing.id}`} className="block" aria-label={`View ${title} in ${listing.locality}`}>
        <div className="relative h-60 overflow-hidden bg-[linear-gradient(145deg,#14334d,#071a2f)]">
          {photo ? (
            <>
              {/* Approved private media is exposed through a short-lived signed URL. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={clean(photo.alt_text) || `${title} in ${listing.locality}`}
                className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-[1.035]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041421]/72 via-transparent to-transparent" />
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[#e4c462]">
              <Building2 className="size-12" />
            </span>
          )}
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            <span className="rounded-full border border-white/18 bg-[#041421]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
              {listing.intent === "Rent out" ? "For rent" : "For resale"}
            </span>
            <span className="rounded-full border border-emerald-300/25 bg-emerald-900/65 px-3 py-1.5 text-[9px] font-bold text-emerald-100 backdrop-blur">
              <BadgeCheck className="mr-1 inline size-3" /> Live after review
            </span>
          </div>
          <p className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#041421]/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {listingPrice(listing)}
            {listing.intent === "Rent out" && clean(listing.monthly_rent) ? " / month" : ""}
          </p>
        </div>
        <div className="p-6">
          <p className="flex items-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#a47b10]">
            <MapPin className="mr-1.5 size-3.5" />
            {clean(listing.locality) || "Bengaluru"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[#071a2f]">{title}</h2>
          {clean(listing.project_name) ? (
            <p className="mt-2 truncate text-xs text-slate-500">{listing.project_name}</p>
          ) : null}
          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
            {clean(listing.area_value) ? (
              <div>
                <dt className="sr-only">Area</dt>
                <dd>{listing.area_value} sq ft</dd>
              </div>
            ) : null}
            {clean(listing.furnishing) ? (
              <div>
                <dt className="sr-only">Furnishing</dt>
                <dd>{listing.furnishing}</dd>
              </div>
            ) : null}
            {clean(listing.parking) ? (
              <div>
                <dt className="sr-only">Parking</dt>
                <dd>{listing.parking}</dd>
              </div>
            ) : null}
          </dl>
          <span className="mt-5 inline-flex items-center text-xs font-bold text-[#a47b10]">
            View reviewed listing
            <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default async function PublicOwnerProfilePage({
  params,
}: ProfilePageProps) {
  const { slug } = await params;
  const [profile, listings] = await Promise.all([
    getPublicProfile(slug),
    listPublicListingsByOwner(slug),
  ]);

  // A profile becomes discoverable only when it is explicitly public and has
  // at least one independently approved, live property.
  if (!profile || listings.length === 0) notFound();

  const displayName = clean(profile.display_name) || "Property owner";
  const hasSharedContact = Boolean(
    clean(profile.contact_email) || clean(profile.contact_phone)
  );
  const asherMessage = encodeURIComponent(
    `Hi Asher Realty, I would like help evaluating a property from the public profile ${displayName}. Profile reference: ${profile.slug}.`
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f3f5f6]">
        <section className="relative overflow-hidden bg-[#041421] pb-16 pt-32 text-white sm:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(201,162,39,.2),transparent_34%)]" />
          <div className="container-shell relative">
            <Link
              href="/resale"
              className="inline-flex items-center text-xs font-bold text-white/58 transition hover:text-[#f0d477]"
            >
              <ArrowLeft className="mr-2 size-4" />
              Browse public properties
            </Link>

            <div className="mt-10 grid gap-9 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <span className="flex size-24 items-center justify-center rounded-[2rem] border border-[#c9a227]/25 bg-[#c9a227]/10 text-[#e4c462] shadow-[0_20px_60px_rgba(0,0,0,.22)] sm:size-28">
                <UserRound className="size-11" />
              </span>
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/12 bg-white/[.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/65">
                    Public owner profile
                  </span>
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-100">
                    <BadgeCheck className="mr-1.5 inline size-3.5" />
                    Has live reviewed listings
                  </span>
                </div>
                <h1 className="mt-5 text-4xl font-medium sm:text-6xl">{displayName}</h1>
                {clean(profile.bio) ? (
                  <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-white/62">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62">
                    This owner has chosen to publish property information through Asher Realty&apos;s moderated listing flow.
                  </p>
                )}
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[.06] p-5 backdrop-blur lg:min-w-48 lg:text-right">
                <p className="text-3xl font-semibold text-[#e4c462]">{listings.length}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
                  Live {listings.length === 1 ? "property" : "properties"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-18">
          <div className="container-shell grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-start">
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                    Public inventory
                  </p>
                  <h2 className="mt-2 text-4xl font-semibold text-[#071a2f]">
                    Reviewed live properties
                  </h2>
                  <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">
                    Drafts, paused homes and properties awaiting review never appear on this page.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  <ShieldCheck className="mr-2 size-4 text-emerald-700" />
                  Safe public view
                </span>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {listings.map((listing) => (
                  <PublicListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28">
              <div className="rounded-[1.7rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_70px_rgba(7,26,47,.18)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                  Compare with confidence
                </p>
                <h2 className="mt-3 text-3xl font-semibold">
                  Let Asher coordinate the next step
                </h2>
                <p className="mt-4 text-xs leading-6 text-white/58">
                  We can reconfirm current terms, compare alternatives and organise a practical visit plan without exposing your private documents.
                </p>
                <a
                  href={`https://wa.me/919019697170?text=${asherMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Ask Asher to help
                </a>
                <a
                  href="tel:+919019697170"
                  className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/12 text-xs font-bold text-white transition hover:border-[#c9a227]/45 hover:text-[#f0d477]"
                >
                  <Phone className="mr-2 size-4 text-[#e4c462]" />
                  Call +91 90196 97170
                </a>
              </div>

              {hasSharedContact ? (
                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                    Public contact preference
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[#071a2f]">
                    {displayName}
                  </p>
                  <div className="mt-5 space-y-2">
                    {clean(profile.contact_email) ? (
                      <a
                        href={`mailto:${profile.contact_email}`}
                        className="flex min-h-11 items-center rounded-xl bg-[#f6f8f9] px-4 text-xs font-semibold text-[#071a2f] transition hover:bg-[#eef1f2]"
                      >
                        <Mail className="mr-3 size-4 text-[#a47b10]" />
                        {profile.contact_email}
                      </a>
                    ) : null}
                    {clean(profile.contact_phone) ? (
                      <a
                        href={`tel:${profile.contact_phone}`}
                        className="flex min-h-11 items-center rounded-xl bg-[#f6f8f9] px-4 text-xs font-semibold text-[#071a2f] transition hover:bg-[#eef1f2]"
                      >
                        <Phone className="mr-3 size-4 text-[#a47b10]" />
                        {profile.contact_phone}
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-4 text-[10px] leading-5 text-slate-400">
                    This person opted to make these details public. Confirm identity and authority before sharing records or making payments.
                  </p>
                </div>
              ) : (
                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6">
                  <p className="flex items-center text-xs font-bold text-[#071a2f]">
                    <ShieldCheck className="mr-2 size-4 text-emerald-700" />
                    Contact stays private
                  </p>
                  <p className="mt-3 text-[11px] leading-6 text-slate-500">
                    The owner chose Asher-managed enquiries. Use the Asher contact options above.
                  </p>
                </div>
              )}

              <Link
                href="/safety"
                className="flex min-h-12 items-center rounded-2xl border border-slate-200 bg-white px-5 text-xs font-bold text-[#071a2f] transition hover:border-[#c9a227]/40"
              >
                Read property safety guidance
                <ExternalLink className="ml-auto size-4 text-[#a47b10]" />
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
