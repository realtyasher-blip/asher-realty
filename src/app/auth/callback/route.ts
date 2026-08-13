import { type NextRequest, NextResponse } from "next/server";

import {
  createRouteClient,
  publicSupabaseConfigured,
} from "@/lib/supabase/server";

function safeNext(value: string | null) {
  if (
    !value ||
    (value !== "/account" && !value.startsWith("/account/")) ||
    value.includes("\\")
  ) {
    return "/account";
  }
  return value;
}

function noStoreRedirect(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0"
  );
  response.headers.set("Expires", "0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const code = requestUrl.searchParams.get("code");
  const next = safeNext(requestUrl.searchParams.get("next"));

  if (!publicSupabaseConfigured()) {
    return noStoreRedirect(
      new URL("/account/sign-in?error=setup", requestUrl.origin)
    );
  }

  if (code) {
    const successResponse = noStoreRedirect(new URL(next, requestUrl.origin));
    const supabase = createRouteClient(request, successResponse);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return successResponse;
    }
  }

  return noStoreRedirect(
    new URL("/account/sign-in?error=auth", requestUrl.origin)
  );
}
