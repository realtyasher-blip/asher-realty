import { NextRequest, NextResponse } from "next/server";

import {
  crmSessionCookie,
  listLeads,
  verifySessionToken,
} from "@/lib/crm/server";
import { startControlledTestCall } from "@/lib/crm/voice";

export const runtime = "nodejs";

const errorMessages: Record<string, { status: number; message: string }> = {
  VOICE_NOT_READY: { status: 409, message: "Complete every voice activation check first." },
  CONSENT_REQUIRED: { status: 403, message: "This lead does not have verified calling permission." },
  OUTSIDE_CALLING_HOURS: { status: 409, message: "Test calls are allowed only from 10 AM to 7 PM IST." },
  ATTEMPT_LIMIT_REACHED: { status: 409, message: "The two-attempt safety limit has been reached for this lead." },
  ANOTHER_TEST_CALL_ACTIVE: { status: 409, message: "Another controlled test call is currently active." },
  INVALID_PHONE: { status: 400, message: "The selected lead does not have a valid Indian mobile number." },
};

export async function POST(request: NextRequest) {
  const token = request.cookies.get(crmSessionCookie.name)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.leadId !== "string") {
    return NextResponse.json({ ok: false, error: "Choose one lead for the controlled test." }, { status: 400 });
  }
  if (body.acknowledgement !== "START_SINGLE_CONSENTED_TEST_CALL") {
    return NextResponse.json({ ok: false, error: "Confirm the single-call safety acknowledgement." }, { status: 400 });
  }

  try {
    const lead = (await listLeads()).find((item) => item.id === body.leadId);
    if (!lead) return NextResponse.json({ ok: false, error: "Lead not found." }, { status: 404 });
    const result = await startControlledTestCall(lead);
    const updatedLead = (await listLeads()).find((item) => item.id === lead.id);
    return NextResponse.json({ ok: true, result, lead: updatedLead || lead });
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    const known = errorMessages[code];
    if (known) return NextResponse.json({ ok: false, error: known.message }, { status: known.status });
    console.error("Controlled Exotel test call failed", code);
    return NextResponse.json(
      { ok: false, error: "The telephony provider could not start the controlled test call." },
      { status: 502 }
    );
  }
}
