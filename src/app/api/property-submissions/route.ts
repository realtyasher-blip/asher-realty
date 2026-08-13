import { NextRequest, NextResponse } from "next/server";

import {
  createPropertySubmissionLead,
  databaseConfigured,
} from "@/lib/crm/server";
import { parsePropertySubmission } from "@/lib/listings/validation";
import { propertySubmissionReference } from "@/lib/listings/reference";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();
const rateWindowMs = 15 * 60 * 1000;
const maxRateEntries = 2_000;
const maxBodyBytes = 20 * 1024;

function requestAddress(request: NextRequest) {
  const forwarded =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0];
  return (forwarded || "unknown").trim().slice(0, 100);
}

function pruneAttempts(now: number) {
  for (const [address, attempt] of attempts) {
    if (attempt.resetAt <= now) attempts.delete(address);
  }
  while (attempts.size >= maxRateEntries) {
    const oldest = attempts.keys().next().value;
    if (!oldest) break;
    attempts.delete(oldest);
  }
}

function rateLimited(request: NextRequest) {
  const now = Date.now();
  pruneAttempts(now);
  const address = requestAddress(request);
  const current = attempts.get(address);
  if (!current || current.resetAt < now) {
    attempts.set(address, { count: 1, resetAt: now + rateWindowMs });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

function sameOriginRequest(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return true;
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    request.nextUrl.protocol.replace(":", "") ||
    "https";
  const expectedHost = (
    request.headers.get("x-forwarded-host")?.split(",")[0] ||
    request.headers.get("host") ||
    request.nextUrl.host
  )
    .trim()
    .toLowerCase();
  try {
    const expectedOrigin = new URL(`${forwardedProto}://${expectedHost}`);
    return new URL(origin).origin.toLowerCase() === expectedOrigin.origin.toLowerCase();
  } catch {
    return false;
  }
}

async function readJsonBody(request: NextRequest) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBodyBytes) {
    return { ok: false as const, tooLarge: true };
  }
  if (!request.body) return { ok: false as const, tooLarge: false };

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBodyBytes) {
        await reader.cancel();
        return { ok: false as const, tooLarge: true };
      }
      chunks.push(decoder.decode(value, { stream: true }));
    }
    chunks.push(decoder.decode());
    return { ok: true as const, value: JSON.parse(chunks.join("")) as unknown };
  } catch {
    return { ok: false as const, tooLarge: false };
  }
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!/^application\/json(?:\s*;|$)/iu.test(contentType)) {
    return NextResponse.json(
      { ok: false, error: "Use application/json for this request." },
      { status: 415 }
    );
  }
  if (!sameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "Request origin was not accepted." },
      { status: 403 }
    );
  }
  if (rateLimited(request)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please call or use WhatsApp." },
      { status: 429 }
    );
  }

  const body = await readJsonBody(request);
  if (!body.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: body.tooLarge
          ? "Submission is too large. Please shorten the description."
          : "Invalid request.",
      },
      { status: body.tooLarge ? 413 : 400 }
    );
  }

  const input = parsePropertySubmission(body.value);
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
    return NextResponse.json(
      { ok: true, reference: propertySubmissionReference(lead.id) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, fallback: "whatsapp", error: "Please continue on WhatsApp." },
      { status: 503 }
    );
  }
}
