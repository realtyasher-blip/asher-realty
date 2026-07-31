import { NextRequest, NextResponse } from "next/server";

import { mergeCallingProfile, parseCallingProfile } from "@/lib/crm/calling";
import {
  crmSessionCookie,
  listLeads,
  updateLead,
  verifySessionToken,
} from "@/lib/crm/server";
import { transferOpenAICall } from "@/lib/crm/voice";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(crmSessionCookie.name)?.value;
  if (!verifySessionToken(token)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.leadId !== "string") {
    return NextResponse.json({ ok: false, error: "Choose an active call first." }, { status: 400 });
  }

  try {
    const lead = (await listLeads()).find((item) => item.id === body.leadId);
    if (!lead) return NextResponse.json({ ok: false, error: "Lead not found." }, { status: 404 });
    const profile = parseCallingProfile(lead.notes);
    const active = [...profile.providerCalls]
      .reverse()
      .find((call) => call.status === "in-progress" && call.openaiCallId);
    if (!active) {
      return NextResponse.json({ ok: false, error: "There is no active AI call to transfer." }, { status: 409 });
    }
    await transferOpenAICall(active.openaiCallId);
    active.status = "transferred";
    active.updatedAt = new Date().toISOString();
    const updated = await updateLead(lead.id, {
      notes: mergeCallingProfile(lead.notes, profile),
    });
    return NextResponse.json({ ok: true, lead: updated });
  } catch (error) {
    console.error("Realtime call transfer failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "The live transfer could not be completed." }, { status: 502 });
  }
}
