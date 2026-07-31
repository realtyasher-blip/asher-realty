import { NextRequest, NextResponse } from "next/server";

import { crmSessionCookie, verifySessionToken } from "@/lib/crm/server";
import { getVoiceReadiness } from "@/lib/crm/voice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(crmSessionCookie.name)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, readiness: getVoiceReadiness() });
}
