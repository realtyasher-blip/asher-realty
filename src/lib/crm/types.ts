export const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Site visit scheduled",
  "Site visit completed",
  "Negotiation",
  "Booked",
  "Follow up later",
  "Not interested",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  email?: string | null;
  source: string;
  project?: string | null;
  budget?: string | null;
  location?: string | null;
  configuration?: string | null;
  purpose?: string | null;
  timeline?: string | null;
  preferred_visit_date?: string | null;
  preferred_visit_time?: string | null;
  transport?: string | null;
  status: LeadStatus;
  follow_up_at?: string | null;
  notes?: string | null;
};

export type LeadInput = Omit<
  Lead,
  "id" | "created_at" | "updated_at" | "status" | "follow_up_at" | "notes"
> & {
  ai_call_consent?: boolean;
};
