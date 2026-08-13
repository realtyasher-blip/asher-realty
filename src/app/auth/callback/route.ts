import { NextResponse } from "next/server";

import { createClient, publicSupabaseConfigured } from "@/lib/supabase/server";

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

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNext(requestUrl.searchParams.get("next"));

  if (!publicSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/account/sign-in?error=setup", requestUrl.origin)
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/account/sign-in?error=auth", requestUrl.origin)
  );
}
