import type { LeadInput } from "@/lib/crm/types";
import {
  normalizePublicPhone,
  sanitizePublicMultiline,
  sanitizePublicSingleLine,
} from "@/lib/listings/safety";

function text(value: unknown, max = 160) {
  return sanitizePublicSingleLine(value, max);
}

const requirementConfigurations = new Set(["1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Villa"]);
const requirementTimelines = new Set(["Immediately", "Within 1 month", "1–3 months", "3–6 months", "Just exploring"]);

const publicLeadSources = new Set([
  "property_consultation",
  "site_visit_booking",
  "rental_requirement",
  "resale_requirement",
]);

export function parseLeadInput(value: unknown): LeadInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (text(data.website, 20)) return null;

  const name = text(data.name, 80);
  const phone = normalizePublicPhone(data.phone);
  if (name.length < 2 || !phone) return null;
  const requestedSource = text(data.source, 60);
  const source = publicLeadSources.has(requestedSource)
    ? requestedSource
    : "website";
  const location = text(data.location, 120);
  const configuration = text(data.configuration, 80);
  const budget = text(data.budget, 80);
  const timeline = text(data.timeline, 80);
  if (source === "rental_requirement" || source === "resale_requirement") {
    if (
      data.contactConsent !== true ||
      location.length < 2 ||
      !requirementConfigurations.has(configuration) ||
      budget.length < 2 ||
      !requirementTimelines.has(timeline)
    ) {
      return null;
    }
  }

  return {
    name,
    phone,
    email: text(data.email, 120) || null,
    source,
    project: text(data.project, 160) || null,
    budget: budget || null,
    location: location || null,
    configuration: configuration || null,
    purpose: text(data.purpose, 60) || null,
    timeline: timeline || null,
    preferred_visit_date: text(data.preferred_visit_date, 10) || null,
    preferred_visit_time: text(data.preferred_visit_time, 60) || null,
    transport: text(data.transport, 80) || null,
    ai_call_consent: data.ai_call_consent === true,
    public_context: sanitizePublicMultiline(data.requirementDetails, 1_200),
  };
}
