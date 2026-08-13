import "server-only";

import { createClient } from "@supabase/supabase-js";

const MEDIA_BUCKET = "property-media";
const SIGNED_MEDIA_SECONDS = 10 * 60;

export type PublicOwnerProfile = {
  slug: string;
  display_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  bio: string;
  created_at: string;
};

export type PublicListingPhoto = {
  id: string;
  listing_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
  width: number | null;
  height: number | null;
  mime_type: string | null;
};

export type PublicOwnerListing = {
  id: string;
  intent: "Sell" | "Rent out";
  property_type: string;
  project_name: string;
  locality: string;
  pincode: string;
  configuration: string;
  bathrooms: string;
  area_value: string;
  area_basis: string;
  furnishing: string;
  floor: string;
  total_floors: string;
  parking: string;
  property_age: string;
  expected_price: string;
  monthly_rent: string;
  maintenance: string;
  deposit: string;
  available_from: string;
  occupancy: string;
  description: string;
  owner_slug: string | null;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  approved_at: string | null;
  submitted_at: string | null;
  photos: PublicListingPhoto[];
};

type SafeListingRow = Omit<PublicOwnerListing, "photos">;

type SafeMediaRow = Omit<PublicListingPhoto, "url"> & {
  storage_path: string;
};

function publicDataClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.replace(/\/$/u, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("PUBLIC_OWNER_DATA_NOT_CONFIGURED");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function publicOwnerDataConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function storageFailure(context: string, error: { message: string; code?: string } | null) {
  if (!error) return;
  console.error(`Public owner ${context} failed`, error.code || "", error.message.slice(0, 240));
  throw new Error("PUBLIC_OWNER_DATA_ERROR");
}

async function signedPhotosForListings(listingIds: string[]) {
  if (!listingIds.length) return new Map<string, PublicListingPhoto[]>();
  const client = publicDataClient();
  const { data, error } = await client
    .from("public_approved_listing_media_server")
    .select("id, listing_id, storage_path, alt_text, sort_order, is_cover, width, height, mime_type")
    .in("listing_id", listingIds)
    .order("sort_order", { ascending: true });
  storageFailure("approved media read", error);
  const media = (data || []) as SafeMediaRow[];
  if (!media.length) return new Map<string, PublicListingPhoto[]>();

  const { data: signed, error: signError } = await client.storage
    .from(MEDIA_BUCKET)
    .createSignedUrls(media.map((photo) => photo.storage_path), SIGNED_MEDIA_SECONDS);
  storageFailure("approved media signing", signError);

  const grouped = new Map<string, PublicListingPhoto[]>();
  media.forEach((photo, index) => {
    const url = signed?.[index]?.signedUrl;
    if (!url) return;
    const { storage_path: _privatePath, ...safePhoto } = photo;
    void _privatePath;
    const current = grouped.get(photo.listing_id) || [];
    current.push({ ...safePhoto, url });
    grouped.set(photo.listing_id, current);
  });
  return grouped;
}

async function hydrateListings(rows: SafeListingRow[]) {
  const photos = await signedPhotosForListings(rows.map((row) => row.id));
  return rows.map((row) => ({ ...row, photos: photos.get(row.id) || [] }));
}

export async function getPublicListing(id: string): Promise<PublicOwnerListing | null> {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/iu.test(id)) return null;
  if (!publicOwnerDataConfigured()) return null;
  const { data, error } = await publicDataClient()
    .from("public_approved_owner_listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  storageFailure("approved listing read", error);
  if (!data) return null;
  const [listing] = await hydrateListings([data as SafeListingRow]);
  return listing || null;
}

export async function getPublicProfile(slug: string): Promise<PublicOwnerProfile | null> {
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/u.test(slug)) return null;
  if (!publicOwnerDataConfigured()) return null;
  const { data, error } = await publicDataClient()
    .from("public_owner_profiles")
    .select("slug, display_name, contact_email, contact_phone, bio, created_at")
    .eq("slug", slug)
    .maybeSingle();
  storageFailure("profile read", error);
  return (data || null) as PublicOwnerProfile | null;
}

export async function listPublicListingsByOwner(slug: string): Promise<PublicOwnerListing[]> {
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/u.test(slug)) return [];
  if (!publicOwnerDataConfigured()) return [];
  const { data, error } = await publicDataClient()
    .from("public_approved_owner_listings")
    .select("*")
    .eq("owner_slug", slug)
    .order("approved_at", { ascending: false })
    .limit(100);
  storageFailure("owner listings read", error);
  return hydrateListings((data || []) as SafeListingRow[]);
}
