import type { Project } from "@/data/projects";

export type EvidenceStatus =
  | "official"
  | "published"
  | "live-check"
  | "not-public"
  | "review-pending";

export type EvidenceFact = {
  label: string;
  value: string;
  status: EvidenceStatus;
  source: string;
  scope: string;
  note: string;
};

export type EvidenceDocument = {
  label: string;
  status: "Published in K-RERA" | "Official link available" | "Request exact copy" | "Not found in reviewed filing";
  note: string;
};

export type ProjectEvidence = {
  checkedAt: string;
  reviewLabel: string;
  registrations: string[];
  legalPromoter?: string;
  officialStatus?: string;
  approvedOn?: string;
  officialCompletion?: string;
  planApproval?: string;
  inventory?: string;
  facts: EvidenceFact[];
  documents: EvidenceDocument[];
};

const exactRegistrationPattern =
  /(?:EX\/|TOR\/)?PRM\/KA\/RERA\/\d{4}\/\d{3}\/PR\/\d{6}\/\d{6}/g;

export function getExactRegistrations(rera?: string) {
  return [...new Set(rera?.match(exactRegistrationPattern) ?? [])];
}

export function getReraCertificateUrl(registration: string) {
  return `https://rera.karnataka.gov.in/certificate?CER_NO=${encodeURIComponent(registration)}`;
}

const southernStarEvidence: ProjectEvidence = {
  checkedAt: "9 Aug 2026",
  reviewLabel: "Karnataka RERA filing reviewed",
  registrations: ["PRM/KA/RERA/1251/310/PR/210325/007603"],
  legalPromoter: "PRESTIGE ACRES PRIVATE LIMITED",
  officialStatus: "Approved",
  approvedOn: "21 Mar 2025",
  officialCompletion: "30 Sep 2029",
  planApproval: "BBMP/CC/14100/24-25 · approved 30 Jan 2025",
  inventory: "2,130 homes · 14 towers",
  facts: [
    {
      label: "RERA phase",
      value: "PRM/KA/RERA/1251/310/PR/210325/007603",
      status: "official",
      source: "Karnataka RERA record",
      scope: "Registered project",
      note: "Map the selected tower and flat to this registration before relying on the possession date.",
    },
    {
      label: "Registered land extent",
      value: "119,852 sq m · approx. 29.62 acres",
      status: "official",
      source: "Karnataka RERA project details",
      scope: "Registered project",
      note: "The filing description also says around 35 acres. Reconcile the exact land schedule for the booked phase before purchase.",
    },
    {
      label: "RERA carpet area",
      value: "1 BHK 437 · 2 BHK 703–970 · 3 BHK 907–1,530 · 4 BHK 1,620–1,672 sq ft",
      status: "official",
      source: "Karnataka RERA unit schedule",
      scope: "2,130 filed unit rows",
      note: "Converted from square metres and rounded. The exact tower, stack and unit row controls.",
    },
    {
      label: "Undivided share (UDS)",
      value: "1 BHK approx. 206 · 2 BHK 337–473 · 3 BHK 433–766 · 4 BHK 796–821 sq ft",
      status: "official",
      source: "Karnataka RERA unit schedule",
      scope: "Unit-specific range",
      note: "Converted from the filed UDS schedule and rounded. Confirm the exact value in the draft Agreement for Sale or sale deed.",
    },
  ],
  documents: [
    {
      label: "RERA registration certificate",
      status: "Official link available",
      note: "Open on the Karnataka RERA portal.",
    },
    {
      label: "Approved building plan",
      status: "Published in K-RERA",
      note: "Listed as Sothernstar BDA DP.pdf in the filing.",
    },
    {
      label: "Sectional apartment drawings",
      status: "Published in K-RERA",
      note: "Listed under Annexure 82.",
    },
    {
      label: "Project specifications and RERA brochure",
      status: "Published in K-RERA",
      note: "Both are listed in the uploaded-document register.",
    },
    {
      label: "Proforma Agreement for Sale",
      status: "Not found in reviewed filing",
      note: "The reviewed entry displays NA.pdf. Request the current draft before booking.",
    },
  ],
};

const detailedEvidenceByProject: Record<string, ProjectEvidence> = {
  "Prestige Southern Star": southernStarEvidence,
};

export function getProjectEvidence(project: Project): ProjectEvidence {
  const detailed = detailedEvidenceByProject[project.name];
  if (detailed) return detailed;

  const registrations = getExactRegistrations(project.rera);
  const hasRegistration = registrations.length > 0;
  const hasCompositeRera = Boolean(
    project.rera &&
      (project.rera.toLowerCase().includes("phase") ||
        project.rera.toLowerCase().includes("multiple") ||
        registrations.length > 1)
  );
  const hasExplicitCarpetBasis = project.unitSizes?.toLowerCase().includes("carpet");

  return {
    checkedAt: project.verifiedAt,
    reviewLabel: hasRegistration
      ? "Registration mapped; detailed filing review pending"
      : "Phase registration mapping pending",
    registrations,
    officialCompletion: project.possession,
    facts: [
      {
        label: "RERA phase",
        value: project.rera || "No registration mapped to this catalogue entry yet",
        status: hasRegistration ? "official" : "review-pending",
        source: hasRegistration ? "Karnataka RERA registration" : "Asher evidence queue",
        scope: hasCompositeRera ? "Multiple phases / registrations" : "Project listing",
        note: hasCompositeRera
          ? "Map the exact tower, phase and unit before relying on a possession date."
          : hasRegistration
            ? "Open the official certificate and ask Asher to map the selected unit to this filing."
            : "A coming-soon or older project name is not proof of a current registered phase. Ask for the exact registration before paying an EOI.",
      },
      {
        label: "Land extent",
        value: project.area || "Phase-specific land extent not yet mapped",
        status: project.area ? "published" : "review-pending",
        source: project.area ? "Developer-published / Asher summary" : "Detailed RERA review pending",
        scope: project.area ? "Marketing project description" : "Exact registered phase",
        note: project.area
          ? "This may describe a township, a phase or an open-space share. Confirm the RERA land schedule for the selected phase."
          : "The official survey-wise land record must be reviewed before showing one project-wide number.",
      },
      {
        label: "Home area",
        value: project.unitSizes || "Exact carpet and saleable-area schedule not yet mapped",
        status: hasExplicitCarpetBasis
          ? "official"
          : project.unitSizes
            ? "published"
            : "review-pending",
        source: hasExplicitCarpetBasis
          ? "Published RERA carpet area"
          : project.unitSizes
            ? "Developer-published area"
            : "Unit schedule review pending",
        scope: "Configuration / selected unit",
        note: hasExplicitCarpetBasis
          ? "Confirm the exact tower and unit row before booking."
          : "Asher does not relabel an ambiguous size as carpet area. Request the carpet, balcony and saleable break-up for the exact unit.",
      },
      {
        label: "Undivided share (UDS)",
        value: "Unit-specific value not yet mapped",
        status: "not-public",
        source: "Agreement / RERA unit schedule required",
        scope: "Exact flat or villa",
        note: "UDS varies by unit. Confirm it in the draft Agreement for Sale or sale deed; do not rely on a project-wide estimate.",
      },
    ],
    documents: [
      {
        label: "RERA registration certificate",
        status: hasRegistration ? "Official link available" : "Request exact copy",
        note: hasRegistration
          ? "Open the regulator-hosted certificate below."
          : "Ask for the phase-specific registration certificate.",
      },
      {
        label: "Approved master / building plan",
        status: "Request exact copy",
        note: "Request the sanctioned plan for the exact registered phase.",
      },
      {
        label: "Tower and configuration floor plan",
        status: "Request exact copy",
        note: "Generic marketing plans are not a substitute for the selected tower and stack plan.",
      },
      {
        label: "Agreement for Sale and area schedule",
        status: "Request exact copy",
        note: "Review carpet area, balcony, UDS, parking and possession clauses before paying a booking amount.",
      },
    ],
  };
}
