import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authenticatedOwner, ownerAccountsConfigured, sameOriginRequest } from "@/lib/owner/server";

export function apiError(error: string, status: number, setupRequired = false) {
  return NextResponse.json({ ok: false, error, ...(setupRequired ? { setupRequired: true } : {}) }, { status });
}

export async function ownerRequest(request: NextRequest, mutation = false) {
  if (!ownerAccountsConfigured()) return { response: apiError("Owner accounts are being connected.", 503, true), user: null };
  if (mutation && !sameOriginRequest(request)) return { response: apiError("Request origin was not accepted.", 403), user: null };
  const user = await authenticatedOwner(request);
  if (!user) return { response: apiError("Please sign in again.", 401), user: null };
  return { response: null, user };
}

export async function jsonBody(request: NextRequest, maxBytes = 32 * 1024) {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maxBytes) return null;
  const text = await request.text();
  if (!text || new TextEncoder().encode(text).byteLength > maxBytes) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function validUuid(value: string) {
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/iu.test(value);
}
