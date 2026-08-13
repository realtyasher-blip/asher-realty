import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiError, ownerRequest, validUuid } from "@/app/api/account/_shared";
import { deleteListingPhoto, getOwnerListing } from "@/lib/owner/server";
import { ownerMayEditStatus } from "@/lib/owner/validation";

export const runtime = "nodejs";

type PhotoContext = { params: Promise<{ id: string; photoId: string }> };

export async function DELETE(request: NextRequest, context: PhotoContext) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const { id, photoId } = await context.params;
  if (!validUuid(id) || !validUuid(photoId)) return apiError("Photo was not found.", 404);
  try {
    const listing = await getOwnerListing(auth.user.id, id);
    if (!listing) return apiError("Property was not found.", 404);
    if (!ownerMayEditStatus(listing.status)) return apiError("Photos are locked while this property is under review.", 409);
    const deleted = await deleteListingPhoto(auth.user.id, id, photoId);
    return deleted ? NextResponse.json({ ok: true }) : apiError("Photo was not found.", 404);
  } catch {
    return apiError("Unable to delete this photo.", 503);
  }
}
