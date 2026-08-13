import type { Metadata } from "next";
import { cookies } from "next/headers";

import CrmLogin from "@/components/crm/CrmLogin";
import OwnerModerationWorkspace from "@/components/crm/OwnerModerationWorkspace";
import {
  getOwnerModerationListing,
  listOwnerModerationQueue,
  ownerModerationConfigured,
  type ModerationListingDetail,
  type ModerationListingSummary,
} from "@/lib/crm/owner-moderation";
import {
  crmConfigured,
  crmSessionCookie,
  verifySessionToken,
} from "@/lib/crm/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner Listing Review | Asher Realty CRM",
  robots: { index: false, follow: false, nocache: true },
};

export default async function OwnerListingReviewPage() {
  const token = (await cookies()).get(crmSessionCookie.name)?.value;
  if (!verifySessionToken(token)) {
    return <CrmLogin configured={crmConfigured()} />;
  }

  let listings: ModerationListingSummary[] = [];
  let initialDetail: ModerationListingDetail | null = null;
  let error = "";
  if (!ownerModerationConfigured()) {
    error = "Owner listing storage is not configured yet.";
  } else {
    try {
      listings = await listOwnerModerationQueue();
      initialDetail = listings[0]
        ? await getOwnerModerationListing(listings[0].id)
        : null;
    } catch {
      error = "Unable to load the owner moderation queue.";
    }
  }

  return (
    <OwnerModerationWorkspace
      initialListings={listings}
      initialDetail={initialDetail}
      initialError={error}
    />
  );
}
