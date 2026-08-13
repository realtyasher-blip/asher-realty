import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Property media is private. Open it from your signed-in owner account." },
    { status: 404 }
  );
}
