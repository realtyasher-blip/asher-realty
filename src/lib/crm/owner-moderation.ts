import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { OwnerListingStatus } from "@/lib/owner/types";

const MEDIA_BUCKET = "property-media";
const PREVIEW_SECONDS = 5 * 60;

export type ModerationProfile = {
  id: string;
  display_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  role: string;
  bio: string;
  preferred_contact: string;
  is_public: boolean;
  show_name: boolean;
  show_email: boolean;
  show_phone: boolean;
  contact_mode: string;
};

export type ModerationPhoto = {
  id: string;
  listing_id: string;
  label: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  preview_url: string | null;
};

export type ModerationListingSummary = {
  id: string;
  owner_id: string;
  intent: "Sell" | "Rent out";
  property_type: string;
  project_name: string;
  locality: string;
  configuration: string;
  expected_price: string;
  monthly_rent: string;
  status: OwnerListingStatus;
  review_note: string | null;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  owner_name: string;
  owner_email: string | null;
  photo_count: number;
  approved_photo_count: number;
  has_approved_cover: boolean;
};

export type ModerationListingDetail = ModerationListingSummary & {
  owner_role: string;
  pincode: string;
  bathrooms: string;
  area_value: string;
  area_basis: string;
  furnishing: string;
  floor: string;
  total_floors: string;
  parking: string;
  property_age: string;
  maintenance: string;
  deposit: string;
  available_from: string;
  occupancy: string;
  description: string;
  contact_visibility: string;
  profile: ModerationProfile | null;
  photos: ModerationPhoto[];
};

type ListingRow = Omit<
  ModerationListingDetail,
  | "owner_name"
  | "owner_email"
  | "photo_count"
  | "approved_photo_count"
  | "has_approved_cover"
  | "profile"
  | "photos"
>;

type PhotoRow = Omit<ModerationPhoto, "preview_url"> & {
  owner_id: string;
  storage_path: string;
};

function settings() {
  return {
    url: (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/u, ""),
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function ownerModerationConfigured() {
  const { url, serviceKey } = settings();
  return Boolean(url && serviceKey);
}

function adminClient() {
  const { url, serviceKey } = settings();
  if (!url || !serviceKey) throw new Error("OWNER_MODERATION_NOT_CONFIGURED");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function databaseError(
  error: { message: string; code?: string } | null,
  context: string
) {
  if (!error) return;
  console.error(
    `Owner moderation ${context} failed`,
    error.code || "",
    error.message.slice(0, 240)
  );
  throw new Error("OWNER_MODERATION_STORAGE_ERROR");
}

function summaries(
  listings: ListingRow[],
  profiles: ModerationProfile[],
  photos: PhotoRow[]
) {
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const photosByListing = new Map<string, PhotoRow[]>();
  for (const photo of photos) {
    const existing = photosByListing.get(photo.listing_id) || [];
    existing.push(photo);
    photosByListing.set(photo.listing_id, existing);
  }

  return listings.map((listing): ModerationListingSummary => {
    const profile = profileById.get(listing.owner_id);
    const listingPhotos = photosByListing.get(listing.id) || [];
    const approved = listingPhotos.filter((photo) => photo.status === "approved");
    return {
      id: listing.id,
      owner_id: listing.owner_id,
      intent: listing.intent,
      property_type: listing.property_type,
      project_name: listing.project_name,
      locality: listing.locality,
      configuration: listing.configuration,
      expected_price: listing.expected_price,
      monthly_rent: listing.monthly_rent,
      status: listing.status,
      review_note: listing.review_note,
      submitted_at: listing.submitted_at,
      published_at: listing.published_at,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
      owner_name: profile?.display_name || "Owner account",
      owner_email: profile?.contact_email || null,
      photo_count: listingPhotos.length,
      approved_photo_count: approved.length,
      has_approved_cover: approved.some((photo) => photo.is_cover),
    };
  });
}

export async function listOwnerModerationQueue() {
  const admin = adminClient();
  const { data: listingData, error: listingError } = await admin
    .from("owner_listings")
    .select("*")
    .neq("status", "draft")
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(250);
  databaseError(listingError, "queue read");

  const listings = (listingData || []) as ListingRow[];
  if (!listings.length) return [];

  const ownerIds = [...new Set(listings.map((listing) => listing.owner_id))];
  const listingIds = listings.map((listing) => listing.id);
  const [{ data: profileData, error: profileError }, { data: photoData, error: photoError }] =
    await Promise.all([
      admin.from("owner_profiles").select("*").in("id", ownerIds),
      admin
        .from("listing_photos")
        .select("id, listing_id, owner_id, storage_path, label, alt_text, sort_order, is_cover, status, rejection_reason, created_at")
        .in("listing_id", listingIds),
    ]);
  databaseError(profileError, "queue profiles read");
  databaseError(photoError, "queue photos read");

  return summaries(
    listings,
    (profileData || []) as ModerationProfile[],
    (photoData || []) as PhotoRow[]
  );
}

export async function getOwnerModerationListing(listingId: string) {
  const admin = adminClient();
  const { data: listingData, error: listingError } = await admin
    .from("owner_listings")
    .select("*")
    .eq("id", listingId)
    .maybeSingle();
  databaseError(listingError, "listing read");
  if (!listingData) return null;

  const listing = listingData as ListingRow;
  const [{ data: profileData, error: profileError }, { data: photoData, error: photoError }] =
    await Promise.all([
      admin.from("owner_profiles").select("*").eq("id", listing.owner_id).maybeSingle(),
      admin
        .from("listing_photos")
        .select("id, listing_id, owner_id, storage_path, label, alt_text, sort_order, is_cover, status, rejection_reason, created_at")
        .eq("listing_id", listing.id)
        .order("sort_order", { ascending: true }),
    ]);
  databaseError(profileError, "profile read");
  databaseError(photoError, "photos read");

  const profile = (profileData || null) as ModerationProfile | null;
  const photos = (photoData || []) as PhotoRow[];
  const [summary] = summaries(listing ? [listing] : [], profile ? [profile] : [], photos);
  if (!summary) return null;

  const { data: signedData, error: signedError } = photos.length
    ? await admin.storage
        .from(MEDIA_BUCKET)
        .createSignedUrls(
          photos.map((photo) => photo.storage_path),
          PREVIEW_SECONDS
        )
    : { data: [], error: null };
  databaseError(signedError, "photo preview signing");

  const signedPhotos = photos.map((photo, index): ModerationPhoto => ({
    id: photo.id,
    listing_id: photo.listing_id,
    label: photo.label,
    alt_text: photo.alt_text,
    sort_order: photo.sort_order,
    is_cover: photo.is_cover,
    status: photo.status,
    rejection_reason: photo.rejection_reason,
    created_at: photo.created_at,
    preview_url: signedData?.[index]?.signedUrl || null,
  }));

  return {
    ...listing,
    ...summary,
    profile,
    photos: signedPhotos,
  } satisfies ModerationListingDetail;
}

const listingTransitions: Record<
  Exclude<
    OwnerListingStatus,
    "draft" | "submitted" | "published" | "paused" | "archived"
  >,
  OwnerListingStatus[]
> = {
  in_review: ["submitted", "in_review"],
  changes_requested: ["submitted", "in_review", "approved", "published", "paused"],
  approved: ["submitted", "in_review"],
  rejected: ["submitted", "in_review", "approved", "paused"],
};

export type StaffListingAction = keyof typeof listingTransitions;

export async function moderateOwnerListing(
  listingId: string,
  action: StaffListingAction,
  note: string
) {
  const admin = adminClient();
  const { data: current, error: currentError } = await admin
    .from("owner_listings")
    .select("id, status")
    .eq("id", listingId)
    .maybeSingle();
  databaseError(currentError, "listing transition read");
  if (!current) throw new Error("LISTING_NOT_FOUND");

  const allowedFrom = listingTransitions[action];
  if (!allowedFrom.includes(current.status as OwnerListingStatus)) {
    throw new Error("INVALID_LISTING_TRANSITION");
  }

  const feedback = note.trim().slice(0, 1_200);
  if ((action === "changes_requested" || action === "rejected") && feedback.length < 8) {
    throw new Error("REVIEW_NOTE_REQUIRED");
  }

  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("owner_listings")
    .update({
      status: action,
      review_note:
        action === "changes_requested" || action === "rejected" ? feedback : null,
      updated_at: now,
    })
    .eq("id", listingId)
    .eq("status", current.status)
    .select("id")
    .maybeSingle();
  databaseError(error, "listing transition");
  if (!data) throw new Error("LISTING_CHANGED_RELOAD");
  return getOwnerModerationListing(listingId);
}

export async function moderateOwnerPhoto(args: {
  listingId: string;
  photoId: string;
  status: "approved" | "rejected";
  reason: string;
  makeCover: boolean;
}) {
  const admin = adminClient();
  const [
    { data: photo, error: photoError },
    { data: listing, error: listingError },
  ] = await Promise.all([
    admin
      .from("listing_photos")
      .select("id, listing_id")
      .eq("id", args.photoId)
      .eq("listing_id", args.listingId)
      .maybeSingle(),
    admin
      .from("owner_listings")
      .select("id, status")
      .eq("id", args.listingId)
      .maybeSingle(),
  ]);
  databaseError(photoError, "photo transition read");
  databaseError(listingError, "photo listing read");
  if (!photo) throw new Error("PHOTO_NOT_FOUND");
  if (
    !listing ||
    !["submitted", "in_review", "approved", "published", "paused"].includes(
      listing.status
    )
  ) {
    throw new Error("PHOTO_REVIEW_UNAVAILABLE");
  }

  const reason = args.reason.trim().slice(0, 500);
  if (args.status === "rejected" && reason.length < 8) {
    throw new Error("PHOTO_REJECTION_REASON_REQUIRED");
  }

  if (args.makeCover) {
    if (args.status !== "approved") throw new Error("COVER_MUST_BE_APPROVED");
    const { error: clearError } = await admin
      .from("listing_photos")
      .update({ is_cover: false })
      .eq("listing_id", args.listingId);
    databaseError(clearError, "photo cover reset");
  }

  const update: {
    status: "approved" | "rejected";
    rejection_reason: string | null;
    updated_at: string;
    is_cover?: boolean;
  } = {
    status: args.status,
    rejection_reason: args.status === "rejected" ? reason : null,
    updated_at: new Date().toISOString(),
  };
  if (args.status === "rejected") update.is_cover = false;
  if (args.makeCover) update.is_cover = true;

  const { data, error } = await admin
    .from("listing_photos")
    .update(update)
    .eq("id", args.photoId)
    .eq("listing_id", args.listingId)
    .select("id")
    .maybeSingle();
  databaseError(error, "photo transition");
  if (!data) throw new Error("PHOTO_CHANGED_RELOAD");
  return getOwnerModerationListing(args.listingId);
}
