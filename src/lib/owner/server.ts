import "server-only";

import { createClient, type User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

import type {
  ListingPhoto,
  OwnerListing,
  OwnerListingInput,
  OwnerProfile,
  OwnerProfileInput,
} from "@/lib/owner/types";
import { createLead, updateLead } from "@/lib/crm/server";

const MEDIA_BUCKET = "property-media";

function env() {
  return {
    url: (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.replace(/\/$/u, ""),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function ownerAccountsConfigured() {
  const { url, anonKey, serviceKey } = env();
  return Boolean(url && anonKey && serviceKey);
}

function adminClient() {
  const { url, serviceKey } = env();
  if (!url || !serviceKey) throw new Error("OWNER_STORAGE_NOT_CONFIGURED");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function authClient() {
  const { url, anonKey } = env();
  if (!url || !anonKey) throw new Error("OWNER_AUTH_NOT_CONFIGURED");
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function bearerToken(request: NextRequest) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+([^\s]+)$/iu);
  return match?.[1] || "";
}

export async function authenticatedOwner(request: NextRequest): Promise<User | null> {
  const token = bearerToken(request);
  if (!token || token.length > 8_192 || !ownerAccountsConfigured()) return null;
  const { data, error } = await authClient().auth.getUser(token);
  if (error || !data.user || !data.user.email_confirmed_at) return null;
  return data.user;
}

export function sameOriginRequest(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return request.method === "GET" || request.method === "HEAD";
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).origin.toLowerCase() === new URL(`${proto}://${host}`).origin.toLowerCase();
  } catch {
    return false;
  }
}

function throwSupabase(error: { message: string; code?: string } | null, context: string) {
  if (!error) return;
  console.error(`Owner storage ${context} failed`, error.code || "", error.message.slice(0, 240));
  throw new Error("OWNER_STORAGE_ERROR");
}

export async function getOwnerProfile(userId: string) {
  const { data, error } = await adminClient().from("owner_profiles").select("*").eq("id", userId).maybeSingle();
  throwSupabase(error, "profile read");
  return (data || null) as OwnerProfile | null;
}

export async function saveOwnerProfile(user: User, input: OwnerProfileInput) {
  const row = {
    id: user.id,
    slug: `owner-${user.id.replaceAll("-", "").slice(0, 16)}`,
    ...input,
    contact_email: user.email || null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await adminClient().from("owner_profiles").upsert(row, { onConflict: "id" }).select("*").single();
  throwSupabase(error, "profile save");
  return data as OwnerProfile;
}

export async function listOwnerListings(ownerId: string) {
  const { data, error } = await adminClient().from("owner_listings").select("*, photos:listing_photos(*)").eq("owner_id", ownerId).order("created_at", { ascending: false });
  throwSupabase(error, "listings read");
  return (data || []) as OwnerListing[];
}

export async function getOwnerListing(ownerId: string, listingId: string) {
  const { data, error } = await adminClient().from("owner_listings").select("*, photos:listing_photos(*)").eq("owner_id", ownerId).eq("id", listingId).maybeSingle();
  throwSupabase(error, "listing read");
  return (data || null) as OwnerListing | null;
}

export async function createOwnerListing(ownerId: string, input: OwnerListingInput) {
  const { data, error } = await adminClient().from("owner_listings").insert({ owner_id: ownerId, owner_role: "Owner", ...input, workflow_status: "draft", status: "draft" }).select("*").single();
  throwSupabase(error, "listing create");
  return data as OwnerListing;
}

export async function updateOwnerListing(ownerId: string, listingId: string, input: OwnerListingInput) {
  const { data, error } = await adminClient().from("owner_listings").update({ ...input, workflow_status: "draft", status: "draft", review_note: null, submitted_at: null, updated_at: new Date().toISOString() }).eq("owner_id", ownerId).eq("id", listingId).in("status", ["draft", "changes_requested"]).select("*").maybeSingle();
  throwSupabase(error, "listing update");
  return (data || null) as OwnerListing | null;
}

export async function archiveOwnerListing(ownerId: string, listingId: string) {
  const { data, error } = await adminClient().from("owner_listings").update({ workflow_status: "withdrawn", status: "archived", updated_at: new Date().toISOString() }).eq("owner_id", ownerId).eq("id", listingId).neq("status", "archived").select("*").maybeSingle();
  throwSupabase(error, "listing archive");
  return (data || null) as OwnerListing | null;
}

export async function submitOwnerListing(ownerId: string, listingId: string) {
  const now = new Date().toISOString();
  const admin = adminClient();
  const { data, error } = await admin.from("owner_listings").update({ workflow_status: "submitted", status: "submitted", submitted_at: now, review_note: null, updated_at: now }).eq("owner_id", ownerId).eq("id", listingId).in("status", ["draft", "changes_requested"]).select("*").maybeSingle();
  throwSupabase(error, "listing submit");
  if (data) {
    const { error: reviewError } = await admin.from("listing_reviews").upsert({ listing_id: listingId, review_status: "pending", public_feedback: "", reviewed_at: null, updated_at: now }, { onConflict: "listing_id" });
    throwSupabase(reviewError, "listing review queue");
  }
  return (data || null) as OwnerListing | null;
}

export async function setOwnerListingPublication(
  ownerId: string,
  listingId: string,
  action: "publish" | "pause"
) {
  const admin = adminClient();
  const { error } = await admin.rpc("set_owner_listing_publication", {
    p_listing_id: listingId,
    p_owner_id: ownerId,
    p_action: action,
  });
  throwSupabase(error, `listing ${action}`);
  return getOwnerListing(ownerId, listingId);
}

export async function getOwnerPublicationReadiness(
  ownerId: string,
  listingId: string
) {
  const admin = adminClient();
  const [{ data: review, error: reviewError }, { data: photos, error: photoError }] =
    await Promise.all([
      admin
        .from("listing_reviews")
        .select("review_status")
        .eq("listing_id", listingId)
        .maybeSingle(),
      admin
        .from("listing_photos")
        .select(
          "id, is_cover, status, review:listing_photo_reviews!inner(review_status)"
        )
        .eq("owner_id", ownerId)
        .eq("listing_id", listingId),
    ]);
  throwSupabase(reviewError, "publication review read");
  throwSupabase(photoError, "publication photos read");

  const approvedPhotos = (photos || []).filter((photo) => {
    const nested = Array.isArray(photo.review) ? photo.review[0] : photo.review;
    return photo.status === "approved" && nested?.review_status === "approved";
  });
  return {
    listingReviewApproved: review?.review_status === "approved",
    approvedPhotoCount: approvedPhotos.length,
    hasApprovedCover: approvedPhotos.some((photo) => photo.is_cover),
  };
}

export async function ensureOwnerListingLead(profile: OwnerProfile, listing: OwnerListing) {
  const admin = adminClient();
  const marker = `[ASHER_OWNER_ACCOUNT_LISTING:${listing.id}]`;
  const { data: existing, error: lookupError } = await admin
    .from("leads")
    .select("id, follow_up_at")
    .eq("source", "owner_property_submission")
    .like("notes", `%${marker}%`)
    .limit(1);
  throwSupabase(lookupError, "owner CRM linkage lookup");
  if (existing?.[0]) {
    if (!existing[0].follow_up_at) {
      await updateLead(existing[0].id, { follow_up_at: new Date().toISOString() });
    }
    return;
  }

  const contactPhone = profile.contact_phone || "";
  const summary = [
    marker,
    "AUTHENTICATED OWNER ACCOUNT SUBMISSION — PENDING MANUAL REVIEW",
    `Owner account: ${profile.id}`,
    `Intent: ${listing.intent}`,
    `Property: ${listing.property_type}; ${listing.configuration}`,
    `Project/building: ${listing.project_name || "Not shared"}`,
    `Locality: ${listing.locality}${listing.pincode ? ` - ${listing.pincode}` : ""}`,
    `Area: ${listing.area_value} sq ft (${listing.area_basis})`,
    listing.intent === "Sell"
      ? `Expected price: ${listing.expected_price}`
      : `Monthly rent: ${listing.monthly_rent}; deposit: ${listing.deposit || "Not shared"}; maintenance: ${listing.maintenance || "Not shared"}`,
    `Preferred Asher contact: ${profile.preferred_contact}`,
    contactPhone
      ? `Owner phone supplied in verified account profile: ${contactPhone}`
      : "No phone supplied; follow up using the verified account email.",
    "Public contact follows the owner's current profile opt-in settings. AI/automated calling consent is NOT verified.",
    "Do not publish contact or property facts until manual review is complete.",
  ].join("\n");

  const lead = await createLead({
    name: profile.display_name,
    phone: contactPhone,
    email: profile.contact_email,
    source: "owner_property_submission",
    project: listing.project_name || `${listing.property_type} in ${listing.locality}`,
    budget: listing.intent === "Sell" ? listing.expected_price : listing.monthly_rent,
    location: `${listing.locality}${listing.pincode ? ` - ${listing.pincode}` : ""}`,
    configuration: listing.configuration,
    purpose: listing.intent === "Sell" ? "Owner resale" : "Owner rental",
    timeline: listing.available_from || "To discuss",
    ai_call_consent: false,
    public_context: summary,
  });
  await updateLead(lead.id, { follow_up_at: new Date().toISOString() });
}

export async function countListingPhotos(ownerId: string, listingId: string) {
  const { count, error } = await adminClient().from("listing_photos").select("id", { count: "exact", head: true }).eq("owner_id", ownerId).eq("listing_id", listingId);
  throwSupabase(error, "photo count");
  return count || 0;
}

export async function uploadListingPhoto(args: {
  ownerId: string;
  listingId: string;
  bytes: Uint8Array;
  mime: string;
  label: string;
  altText: string;
  width: number | null;
  height: number | null;
}) {
  const admin = adminClient();
  const extension = args.mime === "image/webp" ? "webp" : args.mime === "image/png" ? "png" : "jpg";
  const path = `${args.ownerId}/${args.listingId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await admin.storage.from(MEDIA_BUCKET).upload(path, args.bytes, { contentType: args.mime, cacheControl: "3600", upsert: false });
  throwSupabase(uploadError, "photo upload");
  const sortOrder = await countListingPhotos(args.ownerId, args.listingId);
  const { data, error } = await admin.from("listing_photos").insert({
    listing_id: args.listingId,
    owner_id: args.ownerId,
    storage_path: path,
    label: args.label,
    alt_text: args.altText,
    sort_order: sortOrder,
    is_cover: sortOrder === 0,
    status: "pending",
    byte_size: args.bytes.byteLength,
    mime_type: args.mime,
    width: args.width,
    height: args.height,
  }).select("*").single();
  if (error) {
    await admin.storage.from(MEDIA_BUCKET).remove([path]);
    throwSupabase(error, "photo metadata create");
  }
  return data as ListingPhoto;
}

export async function photoPreviewUrls(photos: ListingPhoto[]) {
  if (!photos.length) return photos;
  const { data, error } = await adminClient().storage.from(MEDIA_BUCKET).createSignedUrls(photos.map((photo) => photo.storage_path), 10 * 60);
  throwSupabase(error, "photo preview signing");
  return photos.map((photo, index) => ({ ...photo, preview_url: data?.[index]?.signedUrl || null }));
}

export async function deleteListingPhoto(ownerId: string, listingId: string, photoId: string) {
  const admin = adminClient();
  const { data, error } = await admin.from("listing_photos").select("*").eq("id", photoId).eq("owner_id", ownerId).eq("listing_id", listingId).maybeSingle();
  throwSupabase(error, "photo read for delete");
  if (!data) return false;
  const { error: storageError } = await admin.storage.from(MEDIA_BUCKET).remove([data.storage_path]);
  throwSupabase(storageError, "photo delete");
  const { error: metadataError } = await admin.from("listing_photos").delete().eq("id", photoId).eq("owner_id", ownerId).eq("listing_id", listingId);
  throwSupabase(metadataError, "photo metadata delete");
  return true;
}

export async function updateListingPhoto(
  ownerId: string,
  listingId: string,
  photoId: string,
  input: { label?: string; alt_text?: string; sort_order?: number; is_cover?: boolean }
) {
  const admin = adminClient();
  if (input.is_cover) {
    const { error: clearError } = await admin
      .from("listing_photos")
      .update({ is_cover: false })
      .eq("owner_id", ownerId)
      .eq("listing_id", listingId);
    throwSupabase(clearError, "photo cover reset");
  }
  const { data, error } = await admin
    .from("listing_photos")
    .update(input)
    .eq("id", photoId)
    .eq("owner_id", ownerId)
    .eq("listing_id", listingId)
    .select("*")
    .maybeSingle();
  throwSupabase(error, "photo update");
  return (data || null) as ListingPhoto | null;
}

export async function reorderListingPhotos(ownerId: string, listingId: string, photos: Array<{ id: string; sort_order: number; is_cover: boolean }>) {
  const admin = adminClient();
  const { data: owned, error } = await admin.from("listing_photos").select("id").eq("owner_id", ownerId).eq("listing_id", listingId);
  throwSupabase(error, "photo ownership read");
  const ownedIds = new Set((owned || []).map((photo) => photo.id));
  if (photos.length !== ownedIds.size || photos.some((photo) => !ownedIds.has(photo.id))) return false;
  for (const photo of photos) {
    const { error: updateError } = await admin.from("listing_photos").update({ sort_order: photo.sort_order, is_cover: photo.is_cover }).eq("id", photo.id).eq("owner_id", ownerId).eq("listing_id", listingId);
    throwSupabase(updateError, "photo reorder");
  }
  return true;
}
