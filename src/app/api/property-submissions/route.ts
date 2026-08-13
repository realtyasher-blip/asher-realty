import { NextRequest, NextResponse } from "next/server";

import {
  createPropertySubmissionLead,
  databaseConfigured,
} from "@/lib/crm/server";
import { parsePropertySubmission } from "@/lib/listings/validation";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(request: NextRequest) {
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(address);
  if (!current || current.resetAt < now) {
    attempts.set(address, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please call or use WhatsApp." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const input = parsePropertySubmission(payload);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Please review the required property and declaration fields." },
      { status: 400 }
    );
  }

  if (!databaseConfigured()) {
    return NextResponse.json(
      { ok: false, fallback: "whatsapp", error: "Secure storage is unavailable." },
      { status: 503 }
    );
  }

  try {
    const lead = await createPropertySubmissionLead(input);
    return NextResponse.json({ ok: true, reference: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, fallback: "whatsapp", error: "Please continue on WhatsApp." },
      { status: 503 }
    );
  }
}
