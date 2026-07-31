import type { Metadata } from "next";
import { cookies } from "next/headers";

import CallingWorkspace from "@/components/crm/CallingWorkspace";
import CrmLogin from "@/components/crm/CrmLogin";
import {
  crmConfigured,
  crmSessionCookie,
  listLeads,
  verifySessionToken,
} from "@/lib/crm/server";
import type { Lead } from "@/lib/crm/types";
import { getVoiceReadiness } from "@/lib/crm/voice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Calling | Asher Realty CRM",
  robots: { index: false, follow: false, nocache: true },
};

export default async function CallingPage() {
  const token = (await cookies()).get(crmSessionCookie.name)?.value;
  if (!verifySessionToken(token)) return <CrmLogin configured={crmConfigured()} />;

  let leads: Lead[] = [];
  let error = "";
  try {
    leads = await listLeads();
  } catch {
    error = "Unable to load leads.";
  }

  const voiceReadiness = getVoiceReadiness();

  return (
    <CallingWorkspace
      initialLeads={leads}
      initialError={error}
      voiceReadiness={voiceReadiness}
    />
  );
}
