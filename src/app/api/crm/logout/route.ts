import { NextResponse } from "next/server";

import { crmSessionCookie } from "@/lib/crm/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(crmSessionCookie.name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}

