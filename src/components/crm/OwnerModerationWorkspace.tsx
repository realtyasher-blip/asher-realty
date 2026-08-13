"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  LogOut,
  Pause,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import type {
  ModerationListingDetail,
  ModerationListingSummary,
  ModerationPhoto,
  StaffListingAction,
} from "@/lib/crm/owner-moderation";

const statusLabels: Record<string, string> = {
  submitted: "Awaiting review",
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved — owner may publish",
  published: "Live",
  paused: "Paused",
  rejected: "Rejected",
};

const statusStyles: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700",
  in_review: "bg-violet-50 text-violet-700",
  changes_requested: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-700",
  published: "bg-cyan-50 text-cyan-800",
  paused: "bg-slate-100 text-slate-700",
  rejected: "bg-rose-50 text-rose-700",
};

const filters = [
  { value: "all", label: "All" },
  { value: "waiting", label: "Needs review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Live" },
  { value: "attention", label: "Needs attention" },
];

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function commercial(listing: ModerationListingSummary) {
  return listing.intent === "Sell"
    ? listing.expected_price || "Price not shared"
    : listing.monthly_rent || "Rent not shared";
}

function photoStatus(photo: ModerationPhoto) {
  if (photo.status === "approved") return "Approved";
  if (photo.status === "rejected") return "Rejected";
  return "Pending";
}

type Props = {
  initialListings: ModerationListingSummary[];
  initialDetail: ModerationListingDetail | null;
  initialError?: string;
};

export default function OwnerModerationWorkspace({
  initialListings,
  initialDetail,
  initialError = "",
}: Props) {
  const [listings, setListings] = useState(initialListings);
  const [selectedId, setSelectedId] = useState(initialListings[0]?.id || "");
  const [detail, setDetail] = useState<ModerationListingDetail | null>(initialDetail);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [reviewNote, setReviewNote] = useState("");
  const [photoNotes, setPhotoNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(initialError);
  const [message, setMessage] = useState("");

  const visibleListings = useMemo(() => {
    const term = query.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesQuery =
        !term ||
        [
          listing.project_name,
          listing.locality,
          listing.owner_name,
          listing.owner_email,
          listing.configuration,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesFilter =
        filter === "all" ||
        (filter === "waiting" &&
          ["submitted", "in_review"].includes(listing.status)) ||
        (filter === "approved" && listing.status === "approved") ||
        (filter === "published" && listing.status === "published") ||
        (filter === "attention" &&
          ["changes_requested", "paused", "rejected"].includes(listing.status));
      return matchesQuery && matchesFilter;
    });
  }, [filter, listings, query]);

  const stats = useMemo(
    () => ({
      waiting: listings.filter((listing) =>
        ["submitted", "in_review"].includes(listing.status)
      ).length,
      photos: listings.reduce(
        (count, listing) =>
          count + Math.max(listing.photo_count - listing.approved_photo_count, 0),
        0
      ),
      approved: listings.filter((listing) => listing.status === "approved").length,
      live: listings.filter((listing) => listing.status === "published").length,
    }),
    [listings]
  );

  async function loadQueue(keepId = selectedId) {
    const response = await fetch("/api/crm/owner-listings", { cache: "no-store" });
    if (response.status === 401) {
      window.location.assign("/crm");
      return;
    }
    const data = (await response.json()) as {
      listings?: ModerationListingSummary[];
      error?: string;
    };
    if (!response.ok) throw new Error(data.error || "Unable to load owner listings.");
    const next = data.listings || [];
    setListings(next);
    setSelectedId(
      next.some((listing) => listing.id === keepId) ? keepId : next[0]?.id || ""
    );
  }

  async function loadDetail(listingId: string) {
    if (!listingId) {
      setDetail(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/crm/owner-listings?id=${encodeURIComponent(listingId)}`,
        { cache: "no-store" }
      );
      if (response.status === 401) {
        window.location.assign("/crm");
        return;
      }
      const data = (await response.json()) as {
        listing?: ModerationListingDetail;
        error?: string;
      };
      if (!response.ok || !data.listing) {
        throw new Error(data.error || "Unable to load this listing.");
      }
      setDetail(data.listing);
      setReviewNote(data.listing.review_note || "");
      setPhotoNotes(
        Object.fromEntries(
          data.listing.photos.map((photo) => [photo.id, photo.rejection_reason || ""])
        )
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load this listing."
      );
    } finally {
      setLoading(false);
    }
  }

  async function save(body: Record<string, unknown>, success: string) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/crm/owner-listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 401) {
        window.location.assign("/crm");
        return;
      }
      const data = (await response.json()) as {
        listing?: ModerationListingDetail;
        error?: string;
      };
      if (!response.ok || !data.listing) {
        throw new Error(data.error || "Unable to save this review.");
      }
      setDetail(data.listing);
      setReviewNote(data.listing.review_note || "");
      setMessage(success);
      await loadQueue(data.listing.id);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save this review."
      );
    } finally {
      setSaving(false);
    }
  }

  async function listingAction(action: StaffListingAction) {
    if (!detail) return;
    await save(
      {
        kind: "listing",
        listingId: detail.id,
        action,
        note: reviewNote,
      },
      action === "approved"
        ? "Listing approved. The owner can publish after the media checks pass."
        : action === "changes_requested" && detail.status === "published"
          ? "Live listing removed and returned to the owner with your changes."
          : "Listing review updated."
    );
  }

  async function photoAction(
    photo: ModerationPhoto,
    status: "approved" | "rejected",
    makeCover = false
  ) {
    if (!detail) return;
    await save(
      {
        kind: "photo",
        listingId: detail.id,
        photoId: photo.id,
        status,
        reason: photoNotes[photo.id] || "",
        makeCover,
      },
      status === "approved"
        ? makeCover
          ? "Photo approved and selected as the cover."
          : "Photo approved."
        : "Photo rejected with owner-facing guidance."
    );
  }

  async function logout() {
    await fetch("/api/crm/logout", { method: "POST" });
    window.location.assign("/crm");
  }

  const canStartReview = detail?.status === "submitted";
  const canDecide = detail && ["submitted", "in_review"].includes(detail.status);
  const canRequestChanges =
    detail &&
    ["submitted", "in_review", "approved", "paused"].includes(detail.status);
  const canReject =
    detail && ["submitted", "in_review", "approved", "paused"].includes(detail.status);
  const canPause = detail?.status === "published";

  return (
    <main className="min-h-screen bg-[#f3f5f7] text-[#071a2f]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-5 py-5 sm:px-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <a
              href="/crm"
              aria-label="Back to sales cockpit"
              className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 transition hover:border-[#c9a227]"
            >
              <ArrowLeft className="size-4" />
            </a>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b08a16]">
                Asher Realty operations
              </p>
              <h1 className="mt-1 text-3xl font-medium">Owner listing review</h1>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                Private staff workspace. Every listing and photo needs an explicit decision.
                Owners control final publication after approval.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                void loadQueue();
                void loadDetail(selectedId);
              }}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-xs font-bold transition hover:border-[#c9a227]"
            >
              <RefreshCw className="mr-2 size-4" /> Refresh
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex size-11 items-center justify-center rounded-full border border-slate-200 transition hover:border-rose-300"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8">
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Clock3, label: "Needs listing review", value: stats.waiting },
            { icon: Camera, label: "Photos awaiting decision", value: stats.photos },
            { icon: CheckCircle2, label: "Owner can publish", value: stats.approved },
            { icon: Eye, label: "Currently live", value: stats.live },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
                  {label}
                </span>
                <Icon className="size-5 text-[#b08a16]" />
              </div>
              <p className="mt-4 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid min-h-[720px] gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search project, owner or area"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7f8fa] pl-11 pr-4 text-sm outline-none focus:border-[#c9a227]"
                />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-bold transition ${
                      filter === item.value
                        ? "bg-[#071a2f] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[720px] overflow-y-auto p-3">
              {!visibleListings.length && (
                <div className="rounded-2xl bg-[#f7f8fa] p-8 text-center">
                  <FileCheck2 className="mx-auto size-7 text-[#b08a16]" />
                  <p className="mt-3 text-sm font-semibold">No listings in this view</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    New owner submissions will appear here automatically.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {visibleListings.map((listing) => (
                  <button
                    key={listing.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(listing.id);
                      setMessage("");
                      void loadDetail(listing.id);
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedId === listing.id
                        ? "border-[#c9a227] bg-[#fffaf0] shadow-sm"
                        : "border-transparent bg-[#f7f8fa] hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {listing.project_name || `${listing.property_type} in ${listing.locality}`}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {listing.configuration} · {listing.locality}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[.08em] ${
                          statusStyles[listing.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabels[listing.status] || listing.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 text-[11px] text-slate-500">
                      <span className="truncate pr-3">{listing.owner_name}</span>
                      <span className="shrink-0">
                        {listing.approved_photo_count}/{listing.photo_count} photos approved
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            {loading && !detail ? (
              <div className="flex min-h-[680px] items-center justify-center">
                <RefreshCw className="size-6 animate-spin text-[#b08a16]" />
              </div>
            ) : !detail ? (
              <div className="flex min-h-[680px] flex-col items-center justify-center p-8 text-center">
                <ShieldCheck className="size-10 text-[#b08a16]" />
                <h2 className="mt-4 text-2xl font-medium">Select an owner listing</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Review its facts, private owner profile and short-lived media previews.
                </p>
              </div>
            ) : (
              <div>
                <div className="border-b border-slate-100 p-5 sm:p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] ${
                            statusStyles[detail.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {statusLabels[detail.status] || detail.status}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">
                          {detail.intent}
                        </span>
                      </div>
                      <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
                        {detail.project_name || `${detail.property_type} in ${detail.locality}`}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        {detail.configuration} · {detail.property_type} · {detail.locality}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#071a2f] px-5 py-4 text-white lg:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#e4c462]">
                        Commercial expectation
                      </p>
                      <p className="mt-1 font-semibold">{commercial(detail)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-7 p-5 sm:p-7 2xl:grid-cols-[minmax(0,1fr)_330px]">
                  <div className="min-w-0 space-y-8">
                    <section>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b08a16]">
                            Private media review
                          </p>
                          <h3 className="mt-1 text-2xl font-medium">
                            Approve every usable photo
                          </h3>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {detail.approved_photo_count}/{detail.photo_count} approved
                        </span>
                      </div>
                      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                        These previews expire in five minutes and come from a private bucket. Do not
                        download or share owner media outside the verification process.
                      </div>
                      {!detail.photos.length ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                          No photos uploaded yet. The listing cannot go live.
                        </div>
                      ) : (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {detail.photos.map((photo) => (
                            <article
                              key={photo.id}
                              className="overflow-hidden rounded-2xl border border-slate-200"
                            >
                              <div
                                role="img"
                                aria-label={photo.alt_text || photo.label || "Private property photo"}
                                className="relative aspect-[4/3] bg-slate-100 bg-cover bg-center"
                                style={
                                  photo.preview_url
                                    ? { backgroundImage: `url(${JSON.stringify(photo.preview_url).slice(1, -1)})` }
                                    : undefined
                                }
                              >
                                {!photo.preview_url && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Camera className="size-7 text-slate-400" />
                                  </div>
                                )}
                                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.08em] shadow-sm ${
                                      photo.status === "approved"
                                        ? "bg-emerald-600 text-white"
                                        : photo.status === "rejected"
                                          ? "bg-rose-600 text-white"
                                          : "bg-white text-slate-700"
                                    }`}
                                  >
                                    {photoStatus(photo)}
                                  </span>
                                  {photo.is_cover && (
                                    <span className="rounded-full bg-[#071a2f] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.08em] text-white">
                                      Cover
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <p className="text-sm font-bold">
                                  {photo.label || `Property photo ${photo.sort_order + 1}`}
                                </p>
                                <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
                                  {photo.alt_text || "No owner caption supplied."}
                                </p>
                                <textarea
                                  value={photoNotes[photo.id] || ""}
                                  onChange={(event) =>
                                    setPhotoNotes((current) => ({
                                      ...current,
                                      [photo.id]: event.target.value,
                                    }))
                                  }
                                  placeholder="Reason required when rejecting"
                                  rows={2}
                                  maxLength={500}
                                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-[#f7f8fa] p-3 text-xs outline-none focus:border-[#c9a227]"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => void photoAction(photo, "approved")}
                                    className="inline-flex h-9 items-center rounded-full bg-emerald-700 px-4 text-[11px] font-bold text-white disabled:opacity-50"
                                  >
                                    <CheckCircle2 className="mr-1.5 size-3.5" /> Approve
                                  </button>
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => void photoAction(photo, "approved", true)}
                                    className="inline-flex h-9 items-center rounded-full border border-emerald-200 px-4 text-[11px] font-bold text-emerald-800 disabled:opacity-50"
                                  >
                                    Approve + cover
                                  </button>
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => void photoAction(photo, "rejected")}
                                    className="inline-flex h-9 items-center rounded-full border border-rose-200 px-4 text-[11px] font-bold text-rose-700 disabled:opacity-50"
                                  >
                                    <XCircle className="mr-1.5 size-3.5" /> Reject
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>

                    <section>
                      <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b08a16]">
                        Property facts
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          ["Area", `${detail.area_value} sq ft · ${detail.area_basis}`],
                          ["Bathrooms", detail.bathrooms || "Not shared"],
                          ["Floor", detail.floor ? `${detail.floor} of ${detail.total_floors || "?"}` : "Not shared"],
                          ["Furnishing", detail.furnishing || "Not shared"],
                          ["Parking", detail.parking || "Not shared"],
                          ["Property age", detail.property_age || "Not shared"],
                          ["Occupancy", detail.occupancy || "Not shared"],
                          ["Available from", detail.available_from || "To discuss"],
                          ["Pincode", detail.pincode || "Not shared"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl bg-[#f7f8fa] p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                              {label}
                            </p>
                            <p className="mt-1 text-sm font-semibold">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded-2xl bg-[#f7f8fa] p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                          Owner description
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {detail.description || "No description supplied."}
                        </p>
                      </div>
                    </section>
                  </div>

                  <aside className="space-y-5">
                    <section className="rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#071a2f] text-[#e4c462]">
                          <UserRound className="size-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                            Private staff view
                          </p>
                          <p className="font-bold">{detail.profile?.display_name || detail.owner_name}</p>
                        </div>
                      </div>
                      <dl className="mt-5 space-y-3 text-xs">
                        <div>
                          <dt className="text-slate-400">Verified account email</dt>
                          <dd className="mt-1 break-all font-semibold">
                            {detail.profile?.contact_email || "Not available"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Contact phone</dt>
                          <dd className="mt-1 font-semibold">
                            {detail.profile?.contact_phone || "Not supplied"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Submitted as</dt>
                          <dd className="mt-1 font-semibold">{detail.owner_role}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Preferred contact</dt>
                          <dd className="mt-1 font-semibold">
                            {detail.profile?.preferred_contact || "Not shared"}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-5 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-500">
                        Public contact is opt-in only. Current mode: {detail.profile?.contact_mode || "Asher managed"}.
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 p-5">
                      <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b08a16]">
                        Review decision
                      </p>
                      <textarea
                        value={reviewNote}
                        onChange={(event) => setReviewNote(event.target.value)}
                        placeholder="Explain exactly what the owner should change. Required for changes or rejection."
                        rows={5}
                        maxLength={1200}
                        className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-[#f7f8fa] p-3 text-xs leading-5 outline-none focus:border-[#c9a227]"
                      />
                      <p className="mt-2 text-[10px] leading-4 text-slate-400">
                        This note is shown to the owner. Never include internal-only remarks.
                      </p>
                      <div className="mt-4 space-y-2">
                        {canStartReview && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void listingAction("in_review")}
                            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#071a2f] text-xs font-bold text-white disabled:opacity-50"
                          >
                            <Clock3 className="mr-2 size-4" /> Start review
                          </button>
                        )}
                        {canDecide && (
                          <>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => void listingAction("approved")}
                              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white disabled:opacity-50"
                            >
                              <CheckCircle2 className="mr-2 size-4" /> Approve listing facts
                            </button>
                          </>
                        )}
                        {canRequestChanges && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void listingAction("changes_requested")}
                            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 disabled:opacity-50"
                          >
                            Request owner changes
                          </button>
                        )}
                        {canReject && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void listingAction("rejected")}
                            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-rose-200 text-xs font-bold text-rose-700 disabled:opacity-50"
                          >
                            <XCircle className="mr-2 size-4" /> Reject listing
                          </button>
                        )}
                        {canPause && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void listingAction("changes_requested")}
                            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-rose-700 text-xs font-bold text-white disabled:opacity-50"
                          >
                            <Pause className="mr-2 size-4" /> Pause &amp; request changes
                          </button>
                        )}
                      </div>
                    </section>

                    <section className="rounded-2xl bg-[#071a2f] p-5 text-white">
                      <div className="flex items-center gap-2 text-[#e4c462]">
                        <ShieldCheck className="size-4" />
                        <p className="text-[10px] font-bold uppercase tracking-[.14em]">
                          Publication gate
                        </p>
                      </div>
                      <ul className="mt-4 space-y-3 text-xs leading-5 text-white/70">
                        <li>Listing facts explicitly approved by staff</li>
                        <li>At least three photos explicitly approved</li>
                        <li>One approved photo selected as cover</li>
                        <li>Owner makes the final publish decision</li>
                      </ul>
                      <div className="mt-4 border-t border-white/10 pt-4 text-[11px] text-white/50">
                        Submitted {formatDate(detail.submitted_at)}
                      </div>
                    </section>
                  </aside>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
