import { NextRequest, NextResponse } from "next/server";

import { readContactFile } from "@/lib/crm/contact-import";
import {
  createImportedLeads,
  crmSessionCookie,
  listLeads,
  verifySessionToken,
} from "@/lib/crm/server";

export const runtime = "nodejs";

function authorised(request: NextRequest) {
  return verifySessionToken(request.cookies.get(crmSessionCookie.name)?.value);
}

function normalisePhone(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ ok: false }, { status: 401 });
  return new Response("\uFEFFName,Number\r\nSample Contact,9012345678\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="asher-realty-contact-template.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Choose an Excel or CSV file." }, { status: 400 });
    }

    const parsed = await readContactFile(file);
    if (parsed.contacts.length > 1000) {
      return NextResponse.json({ ok: false, error: "Import up to 1,000 contacts at a time." }, { status: 400 });
    }

    const existing = new Set((await listLeads()).map((lead) => normalisePhone(lead.phone)).filter(Boolean));
    const seen = new Set<string>();
    const accepted: Array<{ name: string; phone: string }> = [];
    let duplicates = 0;
    for (const contact of parsed.contacts) {
      const key = normalisePhone(contact.phone);
      if (!key || existing.has(key) || seen.has(key)) {
        duplicates += 1;
        continue;
      }
      seen.add(key);
      accepted.push({ name: contact.name, phone: contact.phone });
    }

    if (!accepted.length) {
      return NextResponse.json({
        ok: true,
        imported: 0,
        duplicates,
        rejected: parsed.rejected.length,
        errors: parsed.rejected.slice(0, 10),
      });
    }

    const created = await createImportedLeads(accepted, file.name.replace(/[^a-z0-9._ -]/gi, "").slice(0, 100));
    return NextResponse.json({
      ok: true,
      imported: created.length,
      duplicates,
      rejected: parsed.rejected.length,
      errors: parsed.rejected.slice(0, 10),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const publicMessage =
      message === "FILE_TOO_LARGE"
        ? "The file must be smaller than 3 MB."
        : message === "UNSUPPORTED_FILE"
          ? "Use an .xlsx or .csv file. Older .xls files are not supported."
          : message.includes("XLSX")
            ? "The Excel file could not be read. Save it again as .xlsx and retry."
            : "Unable to import contacts.";
    return NextResponse.json({ ok: false, error: publicMessage }, { status: 400 });
  }
}
