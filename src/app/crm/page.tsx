import type { Metadata } from "next";
import { cookies } from "next/headers";

import CrmDashboard from "@/components/crm/CrmDashboard";
import CrmLogin from "@/components/crm/CrmLogin";
import {
  crmConfigured,
  crmSessionCookie,
  listLeads,
  verifySessionToken,
} from "@/lib/crm/server";
import type { Lead } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CRM",
  robots: { index: false, follow: false, nocache: true },
};

export default async function CrmPage() {
  const token = (await cookies()).get(crmSessionCookie.name)?.value;
  const authorised = verifySessionToken(token);
  if (!authorised) return <CrmLogin configured={crmConfigured()} />;

  let initialLeads: Lead[] = [];
  let initialError = "";
  try {
    initialLeads = await listLeads();
  } catch {
    initialError = "Unable to load leads.";
  }

  return (
    <CrmDashboard
      initialLeads={initialLeads}
      initialError={initialError}
      // The request timestamp is intentionally captured once on the server.
      // eslint-disable-next-line react-hooks/purity
      initialNow={Date.now()}
    />
  );
}
