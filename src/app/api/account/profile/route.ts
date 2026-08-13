import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiError, jsonBody, ownerRequest } from "@/app/api/account/_shared";
import { saveOwnerProfile } from "@/lib/owner/server";
import { parseOwnerProfile } from "@/lib/owner/validation";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const auth = await ownerRequest(request, true);
  if (auth.response || !auth.user) return auth.response;
  const input = parseOwnerProfile(await jsonBody(request));
  if (!input) return apiError("Please review your name, contact and privacy choices.", 400);
  if (input.show_email && !auth.user.email_confirmed_at) return apiError("Verify your account email before sharing it.", 400);
  try {
    const profile = await saveOwnerProfile(auth.user, input);
    return NextResponse.json({ ok: true, profile });
  } catch {
    return apiError("Unable to save your profile.", 503);
  }
}
