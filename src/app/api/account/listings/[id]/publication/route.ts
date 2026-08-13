import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  apiError,
  jsonBody,
  ownerRequest,
  validUuid,
} from "@/app/api/account/_shared";
import {
  getOwnerListing,
  getOwnerPublicationReadiness,
  photoPreviewUrls,
  setOwnerListingPublication,
} from "@/lib/owner/server";

export const runtime = "nodejs";

type PublicationContext = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  context: PublicationContext
) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;

  const { id } = await context.params;
  const body = await jsonBody(request, 2_048);
  const action =
    body && typeof body === "object" && "action" in body
      ? (body as { action?: unknown }).action
      : null;
  if (!validUuid(id)) return apiError("Property was not found.", 404);
  if (action !== "publish" && action !== "pause") {
    return apiError("Choose a valid property action.", 400);
  }

  try {
    const current = await getOwnerListing(auth.user.id, id);
    if (!current) return apiError("Property was not found.", 404);

    if (action === "pause") {
      if (current.status !== "published") {
        return apiError("Only a live property can be paused.", 409);
      }
    } else {
      if (current.status !== "approved" && current.status !== "paused") {
        return apiError("This property is not ready to publish.", 409);
      }
      const readiness = await getOwnerPublicationReadiness(auth.user.id, id);
      if (!readiness.listingReviewApproved) {
        return apiError("Asher approval is required before publication.", 409);
      }
      if (readiness.approvedPhotoCount < 3) {
        return apiError(
          `Publication needs at least 3 approved photos. ${readiness.approvedPhotoCount} are approved now.`,
          409
        );
      }
      if (!readiness.hasApprovedCover) {
        return apiError("Choose a cover photo and wait for its approval before publishing.", 409);
      }
    }

    const listing = await setOwnerListingPublication(
      auth.user.id,
      id,
      action
    );
    if (!listing) return apiError("Property status could not be updated.", 409);
    const photos = await photoPreviewUrls(listing.photos || []);
    return NextResponse.json({ ok: true, listing: { ...listing, photos } });
  } catch {
    return apiError(
      action === "publish"
        ? "Unable to publish this property. Refresh and confirm its approvals."
        : "Unable to pause this property.",
      503
    );
  }
}
