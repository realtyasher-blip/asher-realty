import { NextRequest, NextResponse } from "next/server";

import {
  createSessionToken,
  crmConfigured,
  crmSessionCookie,
  verifyAdminPassword,
} from "@/lib/crm/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!crmConfigured()) {
    return NextResponse.json(
      { ok: false, error: "CRM environment is not configured." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { password?: string }
    | null;
  if (!body?.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(crmSessionCookie.name, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: crmSessionCookie.maxAge,
  });
  return response;
}

