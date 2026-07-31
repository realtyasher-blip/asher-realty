import { randomUUID } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import {
  assessLead,
  callOutcomes,
  consentOptions,
  interestLevels,
  mergeCallingProfile,
  parseCallingProfile,
  statusForAssessment,
  type CallAssessmentInput,
  type CallOutcome,
  type ConsentStatus,
  type InterestLevel,
} from "@/lib/crm/calling";
import {
  crmSessionCookie,
  listLeads,
  updateLead,
  verifySessionToken,
} from "@/lib/crm/server";

export const runtime = "nodejs";

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(crmSessionCookie.name)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.leadId !== "string") {
    return NextResponse.json({ ok: false, error: "Choose a lead first." }, { status: 400 });
  }

  const outcome = callOutcomes.includes(body.outcome as CallOutcome)
    ? (body.outcome as CallOutcome)
    : null;
  const interest = interestLevels.includes(body.interest as InterestLevel)
    ? (body.interest as InterestLevel)
    : null;
  const consentStatus = consentOptions.includes(body.consentStatus as ConsentStatus)
    ? (body.consentStatus as ConsentStatus)
    : null;
  if (!outcome || !interest || !consentStatus) {
    return NextResponse.json({ ok: false, error: "Complete the call outcome fields." }, { status: 400 });
  }

  try {
    const lead = (await listLeads()).find((item) => item.id === body.leadId);
    if (!lead) return NextResponse.json({ ok: false, error: "Lead not found." }, { status: 404 });

    const input: CallAssessmentInput = {
      outcome,
      interest,
      consentStatus,
      consentSource: clean(body.consentSource, 160),
      language: clean(body.language, 40) || "English",
      disclosedAi: body.disclosedAi === true,
      budgetConfirmed: body.budgetConfirmed === true,
      timeline: clean(body.timeline, 80),
      summary: clean(body.summary, 1000),
      objection: clean(body.objection, 500),
      transcript: clean(body.transcript, 1500),
      recordingUrl: clean(body.recordingUrl, 500),
      followUpAt: clean(body.followUpAt, 30),
      siteVisitDate: clean(body.siteVisitDate, 10),
      siteVisitTime: clean(body.siteVisitTime, 60),
    };
    const result = assessLead(lead, input);
    const attempt = {
      ...input,
      ...result,
      id: randomUUID(),
      recordedAt: new Date().toISOString(),
    };
    const profile = parseCallingProfile(lead.notes);
    profile.consentStatus = consentStatus;
    profile.consentSource = input.consentSource;
    if (consentStatus !== "Not verified" && !profile.consentRecordedAt) {
      profile.consentRecordedAt = new Date().toISOString();
    }
    profile.doNotCall = outcome === "Do not call" || consentStatus === "Withdrawn";
    profile.attempts = [...profile.attempts, attempt].slice(-20);

    const updated = await updateLead(lead.id, {
      status: statusForAssessment(attempt),
      follow_up_at: input.followUpAt || null,
      preferred_visit_date: input.siteVisitDate || lead.preferred_visit_date || null,
      preferred_visit_time: input.siteVisitTime || lead.preferred_visit_time || null,
      notes: mergeCallingProfile(lead.notes, profile),
    });

    return NextResponse.json({ ok: true, lead: updated, assessment: attempt });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to save the call assessment." },
      { status: 503 }
    );
  }
}
