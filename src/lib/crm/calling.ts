import type { Lead, LeadStatus } from "@/lib/crm/types";

const START = "\n\n[ASHER_CALLING_DATA]\n";
const END = "\n[/ASHER_CALLING_DATA]";

export const consentOptions = [
  "Not verified",
  "Inbound enquiry permission",
  "Existing client permission",
  "Registered campaign consent",
  "Withdrawn",
] as const;

export const callOutcomes = [
  "Answered",
  "No answer",
  "Busy",
  "Call back requested",
  "Wrong number",
  "Not interested",
  "Do not call",
] as const;

export const interestLevels = ["High", "Medium", "Low", "Unknown"] as const;
export const prospectClasses = ["Hot", "Warm", "Nurture", "Unreached", "Not a prospect"] as const;

export type ConsentStatus = (typeof consentOptions)[number];
export type CallOutcome = (typeof callOutcomes)[number];
export type InterestLevel = (typeof interestLevels)[number];
export type ProspectClass = (typeof prospectClasses)[number];

export type CallAttempt = {
  id: string;
  recordedAt: string;
  outcome: CallOutcome;
  interest: InterestLevel;
  language: string;
  disclosedAi: boolean;
  budgetConfirmed: boolean;
  timeline: string;
  summary: string;
  objection: string;
  transcript: string;
  recordingUrl: string;
  followUpAt: string;
  siteVisitDate: string;
  siteVisitTime: string;
  score: number;
  classification: ProspectClass;
};

export type CallingProfile = {
  consentStatus: ConsentStatus;
  consentSource: string;
  consentRecordedAt: string;
  doNotCall: boolean;
  attempts: CallAttempt[];
};

export type CallAssessmentInput = Omit<CallAttempt, "id" | "recordedAt" | "score" | "classification"> & {
  consentStatus: ConsentStatus;
  consentSource: string;
};

const emptyProfile: CallingProfile = {
  consentStatus: "Not verified",
  consentSource: "",
  consentRecordedAt: "",
  doNotCall: false,
  attempts: [],
};

export function stripCallingData(notes?: string | null) {
  if (!notes) return "";
  const start = notes.indexOf(START);
  return (start === -1 ? notes : notes.slice(0, start)).trim();
}

export function parseCallingProfile(notes?: string | null): CallingProfile {
  if (!notes) return { ...emptyProfile, attempts: [] };
  const start = notes.indexOf(START);
  const end = notes.indexOf(END, start + START.length);
  if (start === -1 || end === -1) return { ...emptyProfile, attempts: [] };
  try {
    const value = JSON.parse(notes.slice(start + START.length, end)) as Partial<CallingProfile>;
    const consentStatus = consentOptions.includes(value.consentStatus as ConsentStatus)
      ? (value.consentStatus as ConsentStatus)
      : "Not verified";
    return {
      consentStatus,
      consentSource: typeof value.consentSource === "string" ? value.consentSource : "",
      consentRecordedAt: typeof value.consentRecordedAt === "string" ? value.consentRecordedAt : "",
      doNotCall: Boolean(value.doNotCall),
      attempts: Array.isArray(value.attempts) ? value.attempts.slice(-20) : [],
    };
  } catch {
    return { ...emptyProfile, attempts: [] };
  }
}

export function mergeCallingProfile(notes: string | null | undefined, profile: CallingProfile) {
  const visible = stripCallingData(notes);
  return `${visible}${START}${JSON.stringify(profile)}${END}`.trim();
}

export function hasVerifiedConsent(profile: CallingProfile) {
  return (
    !profile.doNotCall &&
    profile.consentStatus !== "Not verified" &&
    profile.consentStatus !== "Withdrawn"
  );
}

export function assessLead(lead: Lead, input: CallAssessmentInput) {
  if (input.outcome === "Do not call" || input.outcome === "Wrong number" || input.outcome === "Not interested") {
    return { score: 0, classification: "Not a prospect" as const };
  }
  if (["No answer", "Busy"].includes(input.outcome)) {
    return { score: 5, classification: "Unreached" as const };
  }

  let score = 15;
  if (input.outcome === "Answered") score += 10;
  if (input.interest === "High") score += 30;
  if (input.interest === "Medium") score += 18;
  if (input.interest === "Low") score += 6;
  if (input.budgetConfirmed) score += 15;
  if (/within 3|immediate|0.?3/i.test(input.timeline || lead.timeline || "")) score += 15;
  else if (/3.?6|within 6/i.test(input.timeline || lead.timeline || "")) score += 9;
  if (input.siteVisitDate) score += 20;
  if (lead.project) score += 5;
  score = Math.min(100, score);

  const classification: ProspectClass = score >= 75 ? "Hot" : score >= 48 ? "Warm" : "Nurture";
  return { score, classification };
}

export function statusForAssessment(attempt: CallAttempt): LeadStatus {
  if (attempt.outcome === "Do not call" || attempt.outcome === "Not interested" || attempt.outcome === "Wrong number") {
    return "Not interested";
  }
  if (attempt.siteVisitDate) return "Site visit scheduled";
  if (attempt.classification === "Hot" || attempt.classification === "Warm") return "Qualified";
  if (attempt.outcome === "Answered" || attempt.outcome === "Call back requested") return "Contacted";
  return "Follow up later";
}

export function callingSummary(lead: Lead) {
  const profile = parseCallingProfile(lead.notes);
  const latest = profile.attempts.at(-1);
  return { profile, latest, eligible: hasVerifiedConsent(profile) };
}
