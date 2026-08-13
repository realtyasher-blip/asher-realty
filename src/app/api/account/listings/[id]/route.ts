import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiError, jsonBody, ownerRequest, validUuid } from "@/app/api/account/_shared";
import { archiveOwnerListing, getOwnerListing, updateOwnerListing } from "@/lib/owner/server";
import { ownerMayEditStatus, parseOwnerListing } from "@/lib/owner/validation";

export const runtime = "nodejs";

type ListingContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: ListingContext) {
  const auth = await ownerRequest(request);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  if (!validUuid(id)) return apiError("Property was not found.", 404);
  try {
    const listing = await getOwnerListing(auth.user.id, id);
    return listing ? NextResponse.json({ ok: true, listing }) : apiError("Property was not found.", 404);
  } catch {
    return apiError("Unable to load this property.", 503);
  }
}

export async function PATCH(request: NextRequest, context: ListingContext) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  const input = parseOwnerListing(await jsonBody(request));
  if (!validUuid(id) || !input) return apiError("Please review the property details.", 400);
  try {
    const current = await getOwnerListing(auth.user.id, id);
    if (!current) return apiError("Property was not found.", 404);
    if (!ownerMayEditStatus(current.status)) return apiError("This property is locked while Asher Realty reviews it.", 409);
    const listing = await updateOwnerListing(auth.user.id, id, input);
    return listing ? NextResponse.json({ ok: true, listing }) : apiError("Property could not be updated.", 409);
  } catch {
    return apiError("Unable to save this property.", 503);
  }
}

export async function DELETE(request: NextRequest, context: ListingContext) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const { id } = await context.params;
  if (!validUuid(id)) return apiError("Property was not found.", 404);
  try {
    const listing = await archiveOwnerListing(auth.user.id, id);
    return listing ? NextResponse.json({ ok: true, listing }) : apiError("Property was not found.", 404);
  } catch {
    return apiError("Unable to archive this property.", 503);
  }
}
