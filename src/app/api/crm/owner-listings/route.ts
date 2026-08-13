import { NextRequest, NextResponse } from "next/server";

import {
  getOwnerModerationListing,
  listOwnerModerationQueue,
  moderateOwnerListing,
  moderateOwnerPhoto,
  type StaffListingAction,
} from "@/lib/crm/owner-moderation";
import {
  crmSessionCookie,
  verifySessionToken,
} from "@/lib/crm/server";
import { sameOriginRequest } from "@/lib/owner/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const listingActions: StaffListingAction[] = [
  "in_review",
  "changes_requested",
  "approved",
  "rejected",
];

function authorised(request: NextRequest) {
  return verifySessionToken(request.cookies.get(crmSessionCookie.name)?.value);
}

function safeId(value: unknown) {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(
      value
    )
    ? value
    : "";
}

function responseForError(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  const messages: Record<string, { message: string; status: number }> = {
    LISTING_NOT_FOUND: { message: "This listing could not be found.", status: 404 },
    PHOTO_NOT_FOUND: { message: "This photo could not be found.", status: 404 },
    PHOTO_REVIEW_UNAVAILABLE: {
      message: "Photo review is paused while the owner is editing this listing.",
      status: 409,
    },
    INVALID_LISTING_TRANSITION: {
      message: "That review action is no longer available. Refresh and try again.",
      status: 409,
    },
    LISTING_CHANGED_RELOAD: {
      message: "The listing changed in another session. Refresh before continuing.",
      status: 409,
    },
    PHOTO_CHANGED_RELOAD: {
      message: "The photo changed in another session. Refresh before continuing.",
      status: 409,
    },
    REVIEW_NOTE_REQUIRED: {
      message: "Add a clear note of at least 8 characters for the owner.",
      status: 400,
    },
    PHOTO_REJECTION_REASON_REQUIRED: {
      message: "Add a clear photo rejection reason of at least 8 characters.",
      status: 400,
    },
    COVER_MUST_BE_APPROVED: {
      message: "Only an approved photo can be selected as the cover.",
      status: 400,
    },
  };
  const known = messages[code];
  return NextResponse.json(
    { ok: false, error: known?.message || "Unable to save this moderation decision." },
    { status: known?.status || 503 }
  );
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const listingId = safeId(request.nextUrl.searchParams.get("id"));
    if (request.nextUrl.searchParams.has("id") && !listingId) {
      return NextResponse.json(
        { ok: false, error: "Invalid listing reference." },
        { status: 400 }
      );
    }
    if (listingId) {
      const listing = await getOwnerModerationListing(listingId);
      if (!listing) {
        return NextResponse.json(
          { ok: false, error: "This listing could not be found." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { ok: true, listing },
        { headers: { "Cache-Control": "private, no-store, max-age=0" } }
      );
    }

    return NextResponse.json(
      { ok: true, listings: await listOwnerModerationQueue() },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } }
    );
  } catch (error) {
    return responseForError(error);
  }
}

export async function PATCH(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!sameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "This request could not be verified." },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const listingId = safeId(body?.listingId);
  if (!body || !listingId || (body.kind !== "listing" && body.kind !== "photo")) {
    return NextResponse.json(
      { ok: false, error: "Invalid moderation update." },
      { status: 400 }
    );
  }

  try {
    if (body.kind === "listing") {
      const action =
        typeof body.action === "string" &&
        listingActions.includes(body.action as StaffListingAction)
          ? (body.action as StaffListingAction)
          : null;
      if (!action) {
        return NextResponse.json(
          { ok: false, error: "Invalid listing review action." },
          { status: 400 }
        );
      }
      const listing = await moderateOwnerListing(
        listingId,
        action,
        typeof body.note === "string" ? body.note : ""
      );
      return NextResponse.json(
        { ok: true, listing },
        { headers: { "Cache-Control": "private, no-store, max-age=0" } }
      );
    }

    const photoId = safeId(body.photoId);
    const status =
      body.status === "approved" || body.status === "rejected"
        ? body.status
        : null;
    if (!photoId || !status) {
      return NextResponse.json(
        { ok: false, error: "Invalid photo review action." },
        { status: 400 }
      );
    }
    const listing = await moderateOwnerPhoto({
      listingId,
      photoId,
      status,
      reason: typeof body.reason === "string" ? body.reason : "",
      makeCover: body.makeCover === true,
    });
    return NextResponse.json(
      { ok: true, listing },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } }
    );
  } catch (error) {
    return responseForError(error);
  }
}
