import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiError, jsonBody, ownerRequest } from "@/app/api/account/_shared";
import { createOwnerListing, getOwnerProfile, listOwnerListings } from "@/lib/owner/server";
import { parseOwnerListing } from "@/lib/owner/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await ownerRequest(request);
  if (auth.response || !auth.user) return auth.response;
  try {
    return NextResponse.json({ ok: true, listings: await listOwnerListings(auth.user.id) });
  } catch {
    return apiError("Unable to load your properties.", 503);
  }
}

export async function POST(request: NextRequest) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const input = parseOwnerListing(await jsonBody(request));
  if (!input) return apiError("Please review the essential property details.", 400);
  try {
    if (!(await getOwnerProfile(auth.user.id))) return apiError("Complete your owner profile first.", 409);
    const listing = await createOwnerListing(auth.user.id, input);
    return NextResponse.json({ ok: true, listing }, { status: 201 });
  } catch {
    return apiError("Unable to create this property draft.", 503);
  }
}
