import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { Lead, LeadInput, LeadStatus } from "@/lib/crm/types";
import { mergeCallingProfile, parseCallingProfile } from "@/lib/crm/calling";
import type { PropertySubmissionInput } from "@/lib/listings/types";

const SESSION_COOKIE = "asher_crm_session";
const SESSION_SECONDS = 60 * 60 * 12;

function env() {
  return {
    supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ""),
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    adminPassword: process.env.CRM_ADMIN_PASSWORD,
    sessionSecret: process.env.CRM_SESSION_SECRET,
  };
}

export function databaseConfigured() {
  const { supabaseUrl, serviceKey } = env();
  return Boolean(supabaseUrl && serviceKey);
}

export function crmConfigured() {
  const { adminPassword, sessionSecret } = env();
  return databaseConfigured() && Boolean(adminPassword && sessionSecret);
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { supabaseUrl, serviceKey } = env();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("CRM_STORAGE_NOT_CONFIGURED");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("CRM storage request failed", response.status, detail.slice(0, 300));
    throw new Error("CRM_STORAGE_ERROR");
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function createLead(input: LeadInput) {
  const { ai_call_consent, ...leadInput } = input;
  const profile = parseCallingProfile("");
  if (ai_call_consent) {
    profile.consentStatus = "Inbound enquiry permission";
    profile.consentSource = "Website consent checkbox";
    profile.consentRecordedAt = new Date().toISOString();
  }
  const rows = await supabaseRequest<Lead[]>("leads", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      ...leadInput,
      status: "New",
      notes: mergeCallingProfile("", profile),
    }),
  });
  return rows[0];
}

export async function createPropertySubmissionLead(
  input: PropertySubmissionInput
) {
  const commercial =
    input.intent === "Sell"
      ? `Expected price: ${input.expectedPrice}`
      : `Monthly rent: ${input.monthlyRent}; deposit: ${input.deposit || "Not shared"}; maintenance: ${input.maintenance || "Not shared"}`;
  const summary = [
    "PUBLIC PROPERTY SUBMISSION — PENDING MANUAL REVIEW",
    `Intent: ${input.intent}`,
    `Submitted by: ${input.ownerRole}`,
    `Property: ${input.propertyType}; ${input.configuration}`,
    `Project/building: ${input.projectName || "Not shared"}`,
    `Locality: ${input.locality}${input.pincode ? ` - ${input.pincode}` : ""}`,
    `Area: ${input.areaValue} sq ft (${input.areaBasis})`,
    `Bathrooms: ${input.bathrooms || "Not shared"}`,
    `Floor: ${input.floor || "Not shared"} of ${input.totalFloors || "Not shared"}`,
    `Furnishing: ${input.furnishing || "Not shared"}`,
    `Parking: ${input.parking || "Not shared"}`,
    `Property age: ${input.propertyAge || "Not shared"}`,
    commercial,
    `Available from: ${input.availableFrom || "To discuss"}`,
    `Occupancy: ${input.occupancy || "Not shared"}`,
    `Preferred contact: ${input.contactPreference}`,
    `Owner description: ${input.description || "Not shared"}`,
    "Declarations: authority to advertise, information accuracy and enquiry-contact permission accepted.",
    "Do not publish owner contact, exact address or property facts until manual verification is complete.",
  ].join("\n");

  const rows = await supabaseRequest<Lead[]>("leads", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: input.name,
      phone: input.phone,
      email: input.email,
      source: "owner_property_submission",
      project: input.projectName || `${input.propertyType} in ${input.locality}`,
      budget:
        input.intent === "Sell" ? input.expectedPrice : input.monthlyRent,
      location: `${input.locality}${input.pincode ? ` - ${input.pincode}` : ""}`,
      configuration: input.configuration,
      purpose: input.intent === "Sell" ? "Owner resale" : "Owner rental",
      timeline: input.availableFrom || "To discuss",
      status: "New",
      notes: summary,
    }),
  });

  return rows[0];
}

export async function createImportedLeads(
  contacts: Array<{ name: string; phone: string }>,
  fileName: string
) {
  const profile = parseCallingProfile("");
  const note = `Imported from ${fileName}. Calling permission has not been verified.`;
  const rows = contacts.map((contact) => ({
    name: contact.name,
    phone: contact.phone,
    source: "excel_contact_import",
    status: "New" as const,
    notes: mergeCallingProfile(note, profile),
  }));
  return supabaseRequest<Lead[]>("leads", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(rows),
  });
}

export async function listLeads() {
  return supabaseRequest<Lead[]>(
    "leads?select=*&order=created_at.desc&limit=500"
  );
}

export async function updateLead(
  id: string,
  input: {
    status?: LeadStatus;
    follow_up_at?: string | null;
    notes?: string | null;
    preferred_visit_date?: string | null;
    preferred_visit_time?: string | null;
  }
) {
  const rows = await supabaseRequest<Lead[]>(
    `leads?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
    }
  );
  return rows[0];
}

function signature(value: string) {
  const secret = env().sessionSecret;
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${signature(expires)}`;
}

export function verifySessionToken(token?: string) {
  if (!token || !crmConfigured()) return false;
  const [expires, supplied] = token.split(".");
  if (!expires || !supplied || Number(expires) < Date.now() / 1000) return false;
  const expected = signature(expires);
  if (expected.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

export function verifyAdminPassword(password: string) {
  const expected = env().adminPassword;
  if (!expected || expected.length !== password.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(password));
}

export const crmSessionCookie = {
  name: SESSION_COOKIE,
  maxAge: SESSION_SECONDS,
};
