import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiError, ownerRequest } from "@/app/api/account/_shared";
import { getOwnerProfile, listOwnerListings, photoPreviewUrls } from "@/lib/owner/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await ownerRequest(request);
  if (auth.response || !auth.user) return auth.response;
  try {
    const [profile, listings] = await Promise.all([
      getOwnerProfile(auth.user.id),
      listOwnerListings(auth.user.id),
    ]);
    const withPhotos = await Promise.all(
      listings.map(async (listing) => ({
        ...listing,
        photos: await photoPreviewUrls(listing.photos || []),
      }))
    );
    return NextResponse.json({
      ok: true,
      user: { id: auth.user.id, email: auth.user.email || null },
      profile,
      listings: withPhotos,
    });
  } catch {
    return apiError("Unable to load your owner workspace.", 503);
  }
}
