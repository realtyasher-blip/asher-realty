import "server-only";

import { randomUUID } from "node:crypto";

import OpenAI from "openai";

import {
  hasVerifiedConsent,
  mergeCallingProfile,
  parseCallingProfile,
  type ProviderCall,
  type ProviderCallStatus,
} from "@/lib/crm/calling";
import { createLead, listLeads, updateLead } from "@/lib/crm/server";
import type { Lead } from "@/lib/crm/types";
import type { TestCallResult, VoiceReadiness } from "@/lib/crm/voice-types";

const PENDING_CALL_WINDOW_MS = 5 * 60 * 1000;

function value(name: string) {
  return process.env[name]?.trim() || "";
}

function voiceConfig() {
  return {
    enabled: value("AI_CALLING_ENABLED") === "true",
    openaiKey: value("OPENAI_API_KEY"),
    openaiWebhookSecret: value("OPENAI_WEBHOOK_SECRET"),
    model: value("OPENAI_REALTIME_MODEL") || "gpt-realtime-2.1",
    voice: value("OPENAI_REALTIME_VOICE") || "marin",
    exotelKey: value("EXOTEL_API_KEY"),
    exotelToken: value("EXOTEL_API_TOKEN"),
    exotelAccountSid: value("EXOTEL_ACCOUNT_SID"),
    exotelCallerId: value("EXOTEL_CALLER_ID"),
    exotelSubdomain: value("EXOTEL_SUBDOMAIN") || "api.in.exotel.com",
    exotelFlowUrl: value("EXOTEL_FLOW_URL"),
    appUrl: (value("NEXT_PUBLIC_SITE_URL") || "https://www.asherrealty.in").replace(/\/$/, ""),
    webhookSecret: value("VOICE_WEBHOOK_SECRET"),
    humanTransferNumber: value("AI_HUMAN_TRANSFER_NUMBER"),
  };
}

export function getVoiceReadiness(): VoiceReadiness {
  const config = voiceConfig();
  const checks: VoiceReadiness["checks"] = [
    {
      key: "activation",
      label: "Controlled activation",
      ready: config.enabled,
      detail: config.enabled ? "Single-call activation is enabled." : "AI_CALLING_ENABLED remains safely off.",
    },
    {
      key: "openai",
      label: "OpenAI Realtime",
      ready: Boolean(config.openaiKey),
      detail: config.openaiKey ? `${config.model} is configured.` : "Add the server-only OpenAI API key.",
    },
    {
      key: "openaiWebhook",
      label: "Signed OpenAI webhook",
      ready: Boolean(config.openaiWebhookSecret),
      detail: config.openaiWebhookSecret ? "Incoming SIP calls will be signature verified." : "Add the OpenAI webhook signing secret.",
    },
    {
      key: "telephony",
      label: "Exotel account",
      ready: Boolean(config.exotelKey && config.exotelToken && config.exotelAccountSid),
      detail: config.exotelKey && config.exotelToken && config.exotelAccountSid ? "India telephony credentials are present." : "Add Exotel API credentials and account SID.",
    },
    {
      key: "callerId",
      label: "Verified caller ID",
      ready: Boolean(config.exotelCallerId),
      detail: config.exotelCallerId ? "A registered ExoPhone is configured." : "Add the registered Exotel caller ID.",
    },
    {
      key: "callFlow",
      label: "Voice-AI call flow",
      ready: Boolean(config.exotelFlowUrl),
      detail: config.exotelFlowUrl ? "The outbound flow can route to the OpenAI SIP trunk." : "Add the saved Exotel flow URL connected to the OpenAI SIP trunk.",
    },
    {
      key: "statusWebhook",
      label: "Signed call-status callback",
      ready: Boolean(config.webhookSecret),
      detail: config.webhookSecret ? "Provider callbacks require the shared secret." : "Add a long random VOICE_WEBHOOK_SECRET.",
    },
    {
      key: "humanTransfer",
      label: "Human advisor transfer",
      ready: Boolean(config.humanTransferNumber),
      detail: config.humanTransferNumber ? "A live advisor destination is configured." : "Add the advisor transfer number in E.164 format.",
    },
  ];
  return {
    ready: checks.every((check) => check.ready),
    safeMode: !config.enabled,
    model: config.model,
    voice: config.voice,
    checks,
  };
}

export function openAIClient() {
  const config = voiceConfig();
  if (!config.openaiKey) throw new Error("OPENAI_NOT_CONFIGURED");
  return new OpenAI({
    apiKey: config.openaiKey,
    webhookSecret: config.openaiWebhookSecret || undefined,
  });
}

export function buildVoiceInstructions(lead?: Lead, direction: "outbound" | "inbound" = "outbound") {
  const name = lead?.name?.trim() || "the buyer";
  const project = lead?.project?.trim() || "their Bengaluru property requirement";
  const location = lead?.location?.trim() || "Bengaluru";
  const budget = lead?.budget?.trim() || "not yet confirmed";
  const opening =
    direction === "inbound"
      ? `Say: "Thank you for calling Asher Realty. I am Aira, our AI property assistant. This call may be recorded for quality and follow-up. How may I help with your Bengaluru property search today?"`
      : `Say: "Hi ${name}, I am Aira, Asher Realty's AI property assistant. This call may be recorded for quality and follow-up. Is now a convenient time for a brief update about ${project}?" Stop and wait for permission.`;
  return `You are Aira, Asher Realty's virtual property assistant. Speak naturally, warmly and concisely in Indian English unless the buyer asks for Kannada, Hindi, Tamil or Telugu.

NON-NEGOTIABLE OPENING: ${opening}

If the buyer declines, says stop, asks not to be called, or withdraws permission: apologise once, confirm that Asher Realty will not call again, and end the call. Never pressure the buyer.

Known context: buyer=${name}; project=${project}; preferred location=${location}; stated budget=${budget}.

CONVERSATION RULES:
- Ask one question at a time. Do not interrupt. Keep most turns under 20 words.
- Confirm self-use or investment, preferred configuration, budget, location and purchase timeline conversationally.
- Never invent price, availability, offers, RERA facts, appreciation, possession dates or legal/loan claims.
- When information is uncertain, say an Asher Realty advisor will verify it.
- Offer at most two relevant next steps: a human advisor callback or a guided site visit.
- For pricing negotiation, legal, finance, complaints, refunds, or any buyer request for a person, say you will connect a human advisor.
- Do not claim to be human. Do not use manipulative urgency. Do not mention internal scores or CRM data.
- Before ending, repeat the agreed next action and time. Keep the full call useful and preferably under three minutes.`;
}

function indiaCallingWindowOpen(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value || "0") % 24;
  return hour >= 10 && hour < 19;
}

function toExotelNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (!/^\d{10}$/.test(local)) throw new Error("INVALID_PHONE");
  return `0${local}`;
}

function latestPendingCall(leads: Lead[]) {
  const cutoff = Date.now() - PENDING_CALL_WINDOW_MS;
  return leads
    .flatMap((lead) =>
      parseCallingProfile(lead.notes).providerCalls.map((call) => ({ lead, call }))
    )
    .filter(({ call }) => ["requested", "ringing", "in-progress"].includes(call.status))
    .filter(({ call }) => Date.parse(call.updatedAt) >= cutoff)
    .sort((a, b) => Date.parse(b.call.updatedAt) - Date.parse(a.call.updatedAt))[0];
}

async function saveProviderCall(lead: Lead, call: ProviderCall) {
  const profile = parseCallingProfile(lead.notes);
  const index = profile.providerCalls.findIndex((item) => item.id === call.id);
  if (index === -1) profile.providerCalls.push(call);
  else profile.providerCalls[index] = call;
  profile.providerCalls = profile.providerCalls.slice(-20);
  return updateLead(lead.id, { notes: mergeCallingProfile(lead.notes, profile) });
}

export async function startControlledTestCall(lead: Lead): Promise<TestCallResult> {
  const config = voiceConfig();
  if (!getVoiceReadiness().ready) throw new Error("VOICE_NOT_READY");
  const profile = parseCallingProfile(lead.notes);
  if (!hasVerifiedConsent(profile) || profile.doNotCall) throw new Error("CONSENT_REQUIRED");
  if (!indiaCallingWindowOpen()) throw new Error("OUTSIDE_CALLING_HOURS");
  if (profile.providerCalls.filter((call) => call.status !== "failed").length >= 2) {
    throw new Error("ATTEMPT_LIMIT_REACHED");
  }
  const leads = await listLeads();
  if (latestPendingCall(leads)) throw new Error("ANOTHER_TEST_CALL_ACTIVE");

  const now = new Date().toISOString();
  const providerCall: ProviderCall = {
    id: randomUUID(),
    provider: "Exotel",
    direction: "outbound",
    requestedAt: now,
    updatedAt: now,
    status: "requested",
    callSid: "",
    openaiCallId: "",
    recordingUrl: "",
    project: lead.project || "General Bengaluru property enquiry",
    disclosureRequired: true,
  };
  await saveProviderCall(lead, providerCall);

  const statusCallback =
    `${config.appUrl}/api/webhooks/exotel/call-status` +
    `?token=${encodeURIComponent(config.webhookSecret)}` +
    `&leadId=${encodeURIComponent(lead.id)}` +
    `&providerCallId=${encodeURIComponent(providerCall.id)}`;
  const form = new URLSearchParams({
    From: toExotelNumber(lead.phone),
    CallerId: config.exotelCallerId,
    CallType: "trans",
    Url: config.exotelFlowUrl,
    TimeLimit: "240",
    Timeout: "30",
    StatusCallback: statusCallback,
    CustomField: `${lead.id}:${providerCall.id}`,
  });
  const auth = Buffer.from(`${config.exotelKey}:${config.exotelToken}`).toString("base64");
  const endpoint = `https://${config.exotelSubdomain}/v1/Accounts/${encodeURIComponent(config.exotelAccountSid)}/Calls/connect.json`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
      cache: "no-store",
    });
    const payload = await response.text();
    if (!response.ok) throw new Error(`EXOTEL_${response.status}`);
    const callSid = payload.match(/<Sid>([^<]+)<\/Sid>/i)?.[1] || "";
    const saved = {
      ...providerCall,
      callSid,
      updatedAt: new Date().toISOString(),
      status: "ringing" as const,
    };
    await saveProviderCall(lead, saved);
    return {
      callId: callSid || providerCall.id,
      status: saved.status,
      message: `A single consent-verified test call was requested for ${lead.name}.`,
    };
  } catch (error) {
    await saveProviderCall(lead, {
      ...providerCall,
      updatedAt: new Date().toISOString(),
      status: "failed",
    });
    throw error;
  }
}

export async function findPendingVoiceLead() {
  const result = latestPendingCall(await listLeads());
  return result || null;
}

type SipHeader = { name: string; value: string };

function phoneFromSipHeaders(headers: SipHeader[]) {
  const identityHeaders = headers
    .filter((header) => ["from", "p-asserted-identity", "remote-party-id"].includes(header.name.toLowerCase()))
    .map((header) => header.value)
    .join(" ");
  const match = identityHeaders.match(/(?:\+?91[\s-]?)?([6-9]\d{9})/);
  return match?.[1] || "";
}

export async function resolveVoiceLead(headers: SipHeader[]) {
  const pending = await findPendingVoiceLead();
  if (pending) {
    return { lead: pending.lead, providerCall: pending.call, direction: "outbound" as const };
  }

  const phone = phoneFromSipHeaders(headers);
  if (!phone) return { lead: undefined, providerCall: undefined, direction: "inbound" as const };
  const leads = await listLeads();
  const existing = leads.find((lead) => lead.phone.replace(/\D/g, "").endsWith(phone));
  if (existing) return { lead: existing, providerCall: undefined, direction: "inbound" as const };

  const lead = await createLead({
    name: `Inbound caller ${phone.slice(-4)}`,
    phone: `+91${phone}`,
    source: "inbound_phone_call",
    ai_call_consent: true,
  });
  return { lead, providerCall: undefined, direction: "inbound" as const };
}

export async function attachOpenAICall(lead: Lead, providerCall: ProviderCall, callId: string) {
  return saveProviderCall(lead, {
    ...providerCall,
    openaiCallId: callId,
    status: "in-progress",
    updatedAt: new Date().toISOString(),
  });
}

export async function recordInboundOpenAICall(lead: Lead, callId: string) {
  const now = new Date().toISOString();
  return saveProviderCall(lead, {
    id: randomUUID(),
    provider: "Exotel",
    direction: "inbound",
    requestedAt: now,
    updatedAt: now,
    status: "in-progress",
    callSid: "",
    openaiCallId: callId,
    recordingUrl: "",
    project: lead.project || "Inbound Bengaluru property enquiry",
    disclosureRequired: true,
  });
}

export async function updateProviderStatus(args: {
  leadId: string;
  providerCallId: string;
  status: ProviderCallStatus;
  callSid?: string;
  recordingUrl?: string;
}) {
  const lead = (await listLeads()).find((item) => item.id === args.leadId);
  if (!lead) return null;
  const profile = parseCallingProfile(lead.notes);
  const call = profile.providerCalls.find((item) => item.id === args.providerCallId);
  if (!call) return null;
  return saveProviderCall(lead, {
    ...call,
    status: args.status,
    callSid: args.callSid || call.callSid,
    recordingUrl: args.recordingUrl || call.recordingUrl,
    updatedAt: new Date().toISOString(),
  });
}

export function normalizeProviderStatus(status: string): ProviderCallStatus {
  const normalized = status.toLowerCase().replace(/[ _]+/g, "-");
  if (normalized === "completed") return "completed";
  if (normalized === "busy") return "busy";
  if (normalized === "no-answer" || normalized === "noanswer") return "no-answer";
  if (normalized === "in-progress" || normalized === "ringing") return normalized;
  return "failed";
}

export async function transferOpenAICall(callId: string) {
  const target = voiceConfig().humanTransferNumber;
  if (!target) throw new Error("TRANSFER_NOT_CONFIGURED");
  await openAIClient().realtime.calls.refer(callId, { target_uri: `tel:${target}` });
}
