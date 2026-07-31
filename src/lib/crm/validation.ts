import type { LeadInput } from "@/lib/crm/types";

function text(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseLeadInput(value: unknown): LeadInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (text(data.website, 20)) return null;

  const name = text(data.name, 80);
  const phone = text(data.phone, 20);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || digits.length < 8 || digits.length > 15) return null;

  return {
    name,
    phone,
    email: text(data.email, 120) || null,
    source: text(data.source, 60) || "website",
    project: text(data.project, 160) || null,
    budget: text(data.budget, 80) || null,
    location: text(data.location, 120) || null,
    configuration: text(data.configuration, 80) || null,
    purpose: text(data.purpose, 60) || null,
    timeline: text(data.timeline, 80) || null,
    preferred_visit_date: text(data.preferred_visit_date, 10) || null,
    preferred_visit_time: text(data.preferred_visit_time, 60) || null,
    transport: text(data.transport, 80) || null,
    ai_call_consent: data.ai_call_consent === true,
  };
}
