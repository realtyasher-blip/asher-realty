import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { normalizeProviderStatus, updateProviderStatus } from "@/lib/crm/voice";

export const runtime = "nodejs";

function safeMatch(supplied: string, expected: string) {
  if (!supplied || !expected || supplied.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

function field(form: FormData, ...names: string[]) {
  for (const name of names) {
    const value = form.get(name);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export async function POST(request: NextRequest) {
  const supplied = request.nextUrl.searchParams.get("token") || "";
  const expected = process.env.VOICE_WEBHOOK_SECRET?.trim() || "";
  if (!safeMatch(supplied, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ ok: false }, { status: 400 });
  const custom = field(form, "CustomField", "customfield", "custom_field");
  const [customLeadId, customProviderCallId] = custom.split(":");
  const leadId = request.nextUrl.searchParams.get("leadId") || customLeadId;
  const providerCallId =
    request.nextUrl.searchParams.get("providerCallId") || customProviderCallId;
  if (!leadId || !providerCallId) {
    return NextResponse.json({ received: true, matched: false });
  }
  const updated = await updateProviderStatus({
    leadId,
    providerCallId,
    status: normalizeProviderStatus(field(form, "Status", "status")),
    callSid: field(form, "CallSid", "callsid"),
    recordingUrl: field(form, "RecordingUrl", "recordingurl"),
  });
  return NextResponse.json({ received: true, matched: Boolean(updated) });
}
