import { NextRequest, NextResponse } from "next/server";

import { leadStatuses, type LeadStatus } from "@/lib/crm/types";
import {
  crmSessionCookie,
  listLeads,
  updateLead,
  verifySessionToken,
} from "@/lib/crm/server";

export const runtime = "nodejs";

function authorised(request: NextRequest) {
  return verifySessionToken(request.cookies.get(crmSessionCookie.name)?.value);
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, leads: await listLeads() });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to load leads." }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid update." }, { status: 400 });
  }

  const status =
    typeof body.status === "string" && leadStatuses.includes(body.status as LeadStatus)
      ? (body.status as LeadStatus)
      : undefined;
  const notes =
    typeof body.notes === "string" ? body.notes.trim().slice(0, 3000) : undefined;
  const followUp =
    body.follow_up_at === null
      ? null
      : typeof body.follow_up_at === "string"
        ? body.follow_up_at.slice(0, 30)
        : undefined;

  try {
    const lead = await updateLead(body.id, {
      status,
      notes,
      follow_up_at: followUp,
    });
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to save changes." }, { status: 503 });
  }
}

