import { NextRequest, NextResponse } from "next/server";

import {
  createSessionToken,
  crmConfigured,
  crmSessionCookie,
  verifyAdminPassword,
} from "@/lib/crm/server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4 * 1024;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const MAX_TRACKED_KEYS = 5_000;

type Attempt = {
  failures: number;
  windowStartedAt: number;
  lockedUntil: number;
  touchedAt: number;
};

const attempts = new Map<string, Attempt>();

function sameOrigin(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
    return false;
  }
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    request.nextUrl.protocol.replace(":", "") ||
    "https";
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host");
  if (!host) return false;
  try {
    return (
      new URL(origin).origin.toLowerCase() ===
      new URL(`${protocol}://${host}`).origin.toLowerCase()
    );
  } catch {
    return false;
  }
}

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `crm-admin:${raw.replace(/[^a-f0-9:.]/giu, "").slice(0, 80) || "unknown"}`;
}

function pruneAttempts(now: number) {
  for (const [key, attempt] of attempts) {
    if (attempt.lockedUntil < now && now - attempt.touchedAt > ATTEMPT_WINDOW_MS) {
      attempts.delete(key);
    }
  }
  if (attempts.size <= MAX_TRACKED_KEYS) return;
  const oldest = [...attempts.entries()]
    .sort((a, b) => a[1].touchedAt - b[1].touchedAt)
    .slice(0, attempts.size - MAX_TRACKED_KEYS);
  for (const [key] of oldest) attempts.delete(key);
}

function retryAfterSeconds(attempt: Attempt, now: number) {
  return Math.max(1, Math.ceil((attempt.lockedUntil - now) / 1000));
}

function recordFailure(key: string, now: number) {
  const current = attempts.get(key);
  const withinWindow =
    current && now - current.windowStartedAt < ATTEMPT_WINDOW_MS;
  const next: Attempt = {
    failures: withinWindow ? current.failures + 1 : 1,
    windowStartedAt: withinWindow ? current.windowStartedAt : now,
    lockedUntil: current?.lockedUntil && current.lockedUntil > now ? current.lockedUntil : 0,
    touchedAt: now,
  };
  if (next.failures >= MAX_FAILURES) next.lockedUntil = now + LOCK_MS;
  attempts.set(key, next);
  return next;
}

function noStoreJson(
  body: Record<string, unknown>,
  init: { status: number; headers?: Record<string, string> }
) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      ...init.headers,
    },
  });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return noStoreJson(
      { ok: false, error: "This sign-in request could not be verified." },
      { status: 403 }
    );
  }

  if (!crmConfigured()) {
    return noStoreJson(
      { ok: false, error: "CRM environment is not configured." },
      { status: 503 }
    );
  }

  const contentType = request.headers.get("content-type") || "";
  const declaredLength = Number(request.headers.get("content-length"));
  if (
    !contentType.toLowerCase().startsWith("application/json") ||
    (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES)
  ) {
    return noStoreJson(
      { ok: false, error: "Invalid sign-in request." },
      { status: 400 }
    );
  }

  const now = Date.now();
  pruneAttempts(now);
  const key = clientKey(request);
  const current = attempts.get(key);
  if (current?.lockedUntil && current.lockedUntil > now) {
    const retryAfter = retryAfterSeconds(current, now);
    return noStoreJson(
      { ok: false, error: "Too many attempts. Try again in 15 minutes." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const rawBody = await request.text().catch(() => "");
  if (!rawBody || new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return noStoreJson(
      { ok: false, error: "Invalid sign-in request." },
      { status: 400 }
    );
  }
  const body = (() => {
    try {
      return JSON.parse(rawBody) as unknown;
    } catch {
      return null;
    }
  })();
  const password =
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    "password" in body &&
    typeof body.password === "string" &&
    body.password.length <= 256
      ? body.password
      : "";
  if (!password || !verifyAdminPassword(password)) {
    const failed = recordFailure(key, now);
    if (failed.lockedUntil > now) {
      return noStoreJson(
        { ok: false, error: "Too many attempts. Try again in 15 minutes." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds(failed, now)) },
        }
      );
    }
    return noStoreJson(
      { ok: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  attempts.delete(key);
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } }
  );
  response.cookies.set(crmSessionCookie.name, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: crmSessionCookie.maxAge,
  });
  return response;
}
