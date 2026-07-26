import type { Metadata } from "next";
import { cookies } from "next/headers";

import CrmDashboard from "@/components/crm/CrmDashboard";
import CrmLogin from "@/components/crm/CrmLogin";
import {
  crmConfigured,
  crmSessionCookie,
  verifySessionToken,
} from "@/lib/crm/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CRM",
  robots: { index: false, follow: false, nocache: true },
};

export default async function CrmPage() {
  const token = (await cookies()).get(crmSessionCookie.name)?.value;
  const authorised = verifySessionToken(token);
  return authorised ? <CrmDashboard /> : <CrmLogin configured={crmConfigured()} />;
}

