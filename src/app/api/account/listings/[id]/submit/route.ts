import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiError, ownerRequest, validUuid } from "@/app/api/account/_shared";
import {
  ensureOwnerListingLead,
  getOwnerListing,
  getOwnerProfile,
  submitOwnerListing,
} from "@/lib/owner/server";
import { listingReadyForSubmission, ownerMayEditStatus } from "@/lib/owner/validation";

export const runtime = "nodejs";

type SubmitContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: SubmitContext) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  if (!validUuid(id)) return apiError("Property was not found.", 404);
  try {
    const [profile, current] = await Promise.all([
      getOwnerProfile(auth.user.id),
      getOwnerListing(auth.user.id, id),
    ]);
    if (!profile) return apiError("Complete your owner profile first.", 409);
    if (!current) return apiError("Property was not found.", 404);
    if (!ownerMayEditStatus(current.status)) return apiError("This property cannot be submitted in its current status.", 409);
    if (!listingReadyForSubmission(current)) return apiError("Add a project name, commercial expectation and useful description before submitting.", 400);
    // Link the authenticated owner to the CRM first. The stable listing marker
    // makes this operation idempotent, so a retry cannot create a second lead.
    await ensureOwnerListingLead(
      { ...profile, contact_email: auth.user.email || null },
      current
    );
    const listing = await submitOwnerListing(auth.user.id, id);
    return listing ? NextResponse.json({ ok: true, listing }) : apiError("Property could not be submitted.", 409);
  } catch {
    return apiError("Unable to submit this property for review.", 503);
  }
}
