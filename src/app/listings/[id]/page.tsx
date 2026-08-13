import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  ExternalLink,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ShareListingButton from "@/components/public/ShareListingButton";
import {
  getPublicListing,
  type PublicOwnerListing,
} from "@/lib/owner/public";

export const dynamic = "force-dynamic";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

const asherPhone = "+91 90196 97170";

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

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function listingTitle(listing: PublicOwnerListing) {
  const configuration = clean(listing.configuration);
  const type = clean(listing.property_type) || "Property";
  const locality = clean(listing.locality) || "Bengaluru";
  return `${configuration ? `${configuration} ` : ""}${type} in ${locality}`;
}

function primaryPrice(listing: PublicOwnerListing) {
  return listing.intent === "Rent out"
    ? formatMoney(listing.monthly_rent) || "Rent on request"
    : formatMoney(listing.expected_price) || "Price on request";
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getPublicListing(id);
  if (!listing) {
    return {
      title: "Property not available | Asher Realty",
      robots: { index: false, follow: false },
    };
  }

  const title = listingTitle(listing);
  const description = `${title}. ${listing.intent === "Rent out" ? "Rental" : "Resale"} details reviewed for publication by Asher Realty. Ask for current availability and a guided visit.`;

  return {
    title: `${title} | Asher Realty`,
    description,
    alternates: { canonical: `/listings/${listing.id}` },
    openGraph: {
      title: `${title} | Asher Realty`,
      description,
      type: "website",
    },
  };
}

function PhotoGallery({ listing }: { listing: PublicOwnerListing }) {
  const photos = [...listing.photos].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    return a.sort_order - b.sort_order;
  });

  if (!photos.length) {
    return (
      <div className="flex min-h-[25rem] items-center justify-center bg-[radial-gradient(circle_at_40%_20%,rgba(201,162,39,.25),transparent_38%),linear-gradient(145deg,#102b43,#061421)] p-8 text-center sm:min-h-[34rem]">
        <div className="max-w-sm">
          <span className="mx-auto flex size-20 items-center justify-center rounded-[1.6rem] border border-white/12 bg-white/[.06] text-[#e4c462]">
            <Building2 className="size-9" />
          </span>
          <p className="mt-6 text-xl font-semibold text-white">
            Approved photos are being prepared
          </p>
          <p className="mt-3 text-sm leading-7 text-white/55">
            Ask Asher Realty for the latest media and a viewing plan before you
            travel.
          </p>
        </div>
      </div>
    );
  }

  const visible = photos.slice(0, 5);
  return (
    <div
      className={`grid min-h-[25rem] gap-1 bg-[#061421] sm:min-h-[34rem] ${
        visible.length === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {visible.map((photo, index) => (
        <figure
          key={photo.id}
          className={`relative overflow-hidden ${
            index === 0 && visible.length > 1 ? "row-span-2" : ""
          } ${visible.length > 3 && index > 2 ? "hidden sm:block" : ""}`}
        >
          {/* Private media is exposed only through a short-lived signed URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={clean(photo.alt_text) || `${listingTitle(listing)} photo ${index + 1}`}
            className="absolute inset-0 size-full object-cover transition duration-700 hover:scale-[1.025]"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {index === visible.length - 1 && photos.length > visible.length ? (
            <figcaption className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-[#041421]/65 to-transparent p-5">
              <span className="rounded-full border border-white/20 bg-[#041421]/75 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                +{photos.length - visible.length} more reviewed photos
              </span>
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

export default async function PublicListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getPublicListing(id);
  if (!listing) notFound();

  const title = listingTitle(listing);
  const price = primaryPrice(listing);
  const asherMessage = encodeURIComponent(
    `Hi Asher Realty, I would like current availability, the complete cost or rent details, and a visit plan for ${title}. Listing reference: ${listing.id}.`
  );
  const asherWhatsapp = `https://wa.me/919019697170?text=${asherMessage}`;
  const directName =
    clean(listing.contact_name) !== "Property contact via Asher"
      ? clean(listing.contact_name)
      : "";
  const hasDirectContact = Boolean(
    directName || clean(listing.contact_email) || clean(listing.contact_phone)
  );
  const reviewDate = formatDate(clean(listing.approved_at));

  const facts = [
    {
      label: "Configuration",
      value: clean(listing.configuration),
      icon: BedDouble,
    },
    {
      label: "Area",
      value:
        clean(listing.area_value) && clean(listing.area_basis)
          ? `${listing.area_value} sq ft · ${listing.area_basis}`
          : clean(listing.area_value)
            ? `${listing.area_value} sq ft`
            : "",
      icon: Ruler,
    },
    { label: "Bathrooms", value: clean(listing.bathrooms), icon: Bath },
    { label: "Parking", value: clean(listing.parking), icon: Car },
    { label: "Furnishing", value: clean(listing.furnishing), icon: Sparkles },
    {
      label: "Floor",
      value: clean(listing.floor)
        ? `${listing.floor}${clean(listing.total_floors) ? ` of ${listing.total_floors}` : ""}`
        : "",
      icon: Building2,
    },
    { label: "Property age", value: clean(listing.property_age), icon: Clock3 },
    {
      label: "Available from",
      value: formatDate(clean(listing.available_from)),
      icon: CalendarDays,
    },
  ].filter((fact) => fact.value);

  const commercial = [
    listing.intent === "Rent out"
      ? { label: "Monthly rent", value: formatMoney(listing.monthly_rent) }
      : { label: "Expected price", value: formatMoney(listing.expected_price) },
    { label: "Maintenance", value: formatMoney(listing.maintenance) },
    { label: "Security deposit", value: formatMoney(listing.deposit) },
    { label: "Occupancy", value: clean(listing.occupancy) },
  ].filter((item) => item.value);

  return (
    <>
      <Navbar />
      <main className="bg-[#f3f5f6]">
        <section className="relative overflow-hidden bg-[#041421] pb-12 pt-28 text-white sm:pb-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(201,162,39,.18),transparent_32%)]" />
          <div className="container-shell relative">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <Link
                href={listing.intent === "Rent out" ? "/rent" : "/resale"}
                className="inline-flex items-center text-xs font-bold text-white/58 transition hover:text-[#f0d477]"
              >
                <ArrowLeft className="mr-2 size-4" />
                Browse {listing.intent === "Rent out" ? "rentals" : "resale homes"}
              </Link>
              <ShareListingButton title={title} />
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,.32)]">
              <PhotoGallery listing={listing} />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100">
                    <BadgeCheck className="mr-1.5 inline size-3.5" />
                    Approved for publication
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/[.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                    Owner submitted
                  </span>
                  <span className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f0d477]">
                    {listing.intent === "Rent out" ? "For rent" : "For resale"}
                  </span>
                </div>
                <p className="mt-7 flex items-center text-sm font-semibold text-[#f0d477]">
                  <MapPin className="mr-2 size-4" />
                  {clean(listing.locality) || "Bengaluru"}
                </p>
                <h1 className="mt-3 max-w-4xl text-4xl font-medium leading-[1.06] sm:text-6xl">
                  {title}
                </h1>
                {clean(listing.project_name) ? (
                  <p className="mt-4 text-base text-white/58">
                    {listing.project_name}
                  </p>
                ) : null}
              </div>
              <div className="lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                  {listing.intent === "Rent out" ? "Monthly rent" : "Owner expectation"}
                </p>
                <p className="mt-2 text-4xl font-semibold text-[#e4c462]">{price}</p>
                <p className="mt-2 text-[11px] text-white/42">
                  Confirm current terms before deciding
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-16">
          <div className="container-shell grid gap-7 xl:grid-cols-[1fr_23rem] xl:items-start">
            <div className="space-y-7">
              {facts.length ? (
                <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(7,26,47,.06)] sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                        At a glance
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold text-[#071a2f]">
                        Home details
                      </h2>
                    </div>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fff8e4] text-[#a47b10]">
                      <Building2 className="size-5" />
                    </span>
                  </div>
                  <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {facts.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="rounded-2xl bg-[#f6f8f9] p-5">
                        <dt className="flex items-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          <Icon className="mr-2 size-4 text-[#a47b10]" />
                          {label}
                        </dt>
                        <dd className="mt-3 text-sm font-semibold text-[#071a2f]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ) : null}

              {clean(listing.description) ? (
                <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(7,26,47,.06)] sm:p-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                    Owner description
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#071a2f]">
                    About this property
                  </h2>
                  <p className="mt-6 whitespace-pre-line text-sm leading-8 text-slate-600">
                    {listing.description}
                  </p>
                </article>
              ) : null}

              {commercial.length ? (
                <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
                      <IndianRupee className="size-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                        Commercial terms
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-[#071a2f]">
                        What the owner has shared
                      </h2>
                    </div>
                  </div>
                  <dl className="mt-6 divide-y divide-slate-100">
                    {commercial.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
                        <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
                        <dd className="text-right text-sm font-semibold text-[#071a2f]">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ) : null}

              <article className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Publication review
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#071a2f]">
                      Clear about what this badge means
                    </h2>
                    <ul className="mt-5 space-y-3 text-xs leading-6 text-slate-600">
                      <li className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                        This listing passed Asher Realty&apos;s publication review{reviewDate ? ` on ${reviewDate}` : ""}.
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                        Only photos separately approved for this live listing are shown here.
                      </li>
                      <li className="flex gap-3">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                        Price, availability, ownership authority and property records still require current, independent confirmation before any payment.
                      </li>
                    </ul>
                    <Link
                      href="/how-we-verify"
                      className="mt-6 inline-flex items-center text-xs font-bold text-emerald-800 underline decoration-emerald-300 underline-offset-4"
                    >
                      Understand the review process
                      <ExternalLink className="ml-2 size-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28">
              <div className="rounded-[1.8rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_75px_rgba(7,26,47,.2)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
                  Your Asher property desk
                </p>
                <h2 className="mt-3 text-3xl font-semibold">
                  Get the facts before the visit
                </h2>
                <p className="mt-4 text-xs leading-6 text-white/58">
                  Ask us to reconfirm availability, commercial terms, owner coordination and a convenient viewing slot.
                </p>
                <a
                  href={asherWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#c9a227] px-5 text-xs font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Ask Asher about this home
                </a>
                <a
                  href="tel:+919019697170"
                  className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/12 text-xs font-bold text-white transition hover:border-[#c9a227]/45 hover:text-[#f0d477]"
                >
                  <Phone className="mr-2 size-4 text-[#e4c462]" />
                  Call {asherPhone}
                </a>
                <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.05] p-4 text-[11px] leading-5 text-white/46">
                  <ShieldCheck className="mr-2 inline size-4 text-[#e4c462]" />
                  Do not transfer money or share identity documents based only on a message or call.
                </div>
              </div>

              {hasDirectContact ? (
                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b10]">
                    Owner chose to share
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-[#f3f5f6] text-[#071a2f]">
                      <UserRound className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#071a2f]">
                        {directName || "Direct property contact"}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Public contact preference
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    {clean(listing.contact_email) ? (
                      <a
                        href={`mailto:${listing.contact_email}`}
                        className="flex min-h-11 items-center rounded-xl bg-[#f6f8f9] px-4 text-xs font-semibold text-[#071a2f] transition hover:bg-[#eef1f2]"
                      >
                        <Mail className="mr-3 size-4 text-[#a47b10]" />
                        {listing.contact_email}
                      </a>
                    ) : null}
                    {clean(listing.contact_phone) ? (
                      <a
                        href={`tel:${listing.contact_phone}`}
                        className="flex min-h-11 items-center rounded-xl bg-[#f6f8f9] px-4 text-xs font-semibold text-[#071a2f] transition hover:bg-[#eef1f2]"
                      >
                        <Phone className="mr-3 size-4 text-[#a47b10]" />
                        {listing.contact_phone}
                      </a>
                    ) : null}
                    {listing.owner_slug ? (
                      <Link
                        href={`/profiles/${listing.owner_slug}`}
                        className="flex min-h-11 items-center rounded-xl px-4 text-xs font-bold text-[#a47b10] transition hover:bg-[#fff9e8]"
                      >
                        View public owner profile
                        <ExternalLink className="ml-auto size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                  <p className="mt-4 text-[10px] leading-5 text-slate-400">
                    This contact was intentionally made public. Independently confirm identity and authority before sharing documents or making payments.
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
