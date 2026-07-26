import { NextRequest, NextResponse } from "next/server";

import { createLead, databaseConfigured } from "@/lib/crm/server";
import { parseLeadInput } from "@/lib/crm/validation";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(request: NextRequest) {
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const existing = attempts.get(address);
  if (!existing || existing.resetAt < now) {
    attempts.set(address, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  existing.count += 1;
  return existing.count > 8;
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please call or use WhatsApp." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const input = parseLeadInput(payload);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Please check the required details." },
      { status: 400 }
    );
  }

  if (!databaseConfigured()) {
    return NextResponse.json(
      { ok: false, fallback: "whatsapp", error: "Secure storage is being connected." },
      { status: 503 }
    );
  }

  try {
    const lead = await createLead(input);
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, fallback: "whatsapp", error: "Please continue on WhatsApp." },
      { status: 503 }
    );
  }
}

