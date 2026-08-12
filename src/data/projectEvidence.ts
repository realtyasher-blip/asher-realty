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

type OfficialReraEvidenceInput = {
  registrations: string[];
  legalPromoter: string;
  approvedOn: string;
  completion: string;
  planApproval: string;
  inventory: string;
  land: string;
  landScope?: string;
  landNote?: string;
  carpet: string;
  carpetScope: string;
  carpetNote?: string;
  uds: string;
  udsScope: string;
  udsNote?: string;
  documents?: EvidenceDocument[];
};

function officialReraEvidence(input: OfficialReraEvidenceInput): ProjectEvidence {
  return {
    checkedAt: "10 Aug 2026",
    reviewLabel: "Karnataka RERA filing reviewed",
    registrations: input.registrations,
    legalPromoter: input.legalPromoter,
    officialStatus: "Approved",
    approvedOn: input.approvedOn,
    officialCompletion: input.completion,
    planApproval: input.planApproval,
    inventory: input.inventory,
    facts: [
      {
        label: "RERA phase",
        value: input.registrations.join(" · "),
        status: "official",
        source: "Karnataka RERA record",
        scope: input.registrations.length > 1 ? "Registered phases" : "Registered project",
        note:
          "Map the selected tower, plot or unit to the relevant registration before relying on the possession date.",
      },
      {
        label: "Registered land extent",
        value: input.land,
        status: "official",
        source: "Karnataka RERA project details",
        scope: input.landScope ?? "Registered project",
        note:
          input.landNote ??
          "This is the regulator-filed land extent. Confirm the survey and phase schedule for the selected inventory.",
      },
      {
        label: "RERA carpet / plot area",
        value: input.carpet,
        status: "official",
        source: "Karnataka RERA unit schedule",
        scope: input.carpetScope,
        note:
          input.carpetNote ??
          "Converted from square metres where needed and rounded. The exact filed unit row controls.",
      },
      {
        label: "Undivided share (UDS)",
        value: input.uds,
        status: "official",
        source: "Karnataka RERA unit schedule",
        scope: input.udsScope,
        note:
          input.udsNote ??
          "Converted from the filed UDS schedule and rounded. Confirm the exact value in the draft Agreement for Sale or sale deed.",
      },
    ],
    documents:
      input.documents ?? [
        {
          label: "RERA registration certificate",
          status: "Official link available",
          note: "Open the regulator-hosted certificate below.",
        },
        {
          label: "Approved building / development plan",
          status: "Published in K-RERA",
          note: "The plan approval reference is recorded in the reviewed filing; request the current phase-matched copy.",
        },
        {
          label: "Unit schedule with carpet area and UDS",
          status: "Published in K-RERA",
          note: "Asher has summarized the filed range; request the exact row for a shortlisted unit.",
        },
        {
          label: "Agreement for Sale and title pack",
          status: "Request exact copy",
          note: "Review the current developer-issued draft and legal schedule before paying a booking amount.",
        },
      ],
  };
}

const mizuKiEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/446/PR/070826/008862"],
  legalPromoter: "APG SKYWARDS PRIVATE LIMITED",
  approvedOn: "7 Aug 2026",
  completion: "31 Aug 2030",
  planApproval: "BDA/NM/AS/AA-2/TAS-3/U/14/2026-27 · approved 28 Jul 2026",
  inventory: "188 filed villa inventories · 12 blocks",
  land: "34,499 sq m · approx. 8.52 acres",
  carpet: "4 BHK: 2,257–2,494 sq ft",
  carpetScope: "186 unique parsed unit rows; filing total says 188",
  carpetNote:
    "The filing headline reports 188 inventories, while the parsed unit schedule contains 186 unique rows. Reconcile the two-row difference for the selected villa.",
  uds: "4 BHK: approx. 1,471–1,727 sq ft",
  udsScope: "Villa-specific filed range",
});

const kvnNiwaNeoEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/472/PR/220726/008831"],
  legalPromoter: "ELITE PROJECTS",
  approvedOn: "22 Jul 2026",
  completion: "30 Sep 2031",
  planApproval: "DO3-KIADB-00021/26-27/BP · approved 20 Jun 2026",
  inventory: "845 homes · 3 towers · includes 169 EWS units",
  land: "22,946 sq m · approx. 5.67 acres",
  carpet:
    "1 BHK 390–421 · 2 BHK 936–998 · 3 BHK 2T 936–998 · 3 BHK 3T 1,101–1,131 · EWS 184 sq ft",
  carpetScope: "845 filed unit rows",
  carpetNote:
    "The 2 BHK and 3 BHK 2T labels share overlapping filed carpet ranges. Confirm the exact layout and unit row, not the bedroom label alone.",
  uds:
    "1 BHK 101–110 · 2 BHK 269–306 · 3 BHK 2T 265–293 · 3 BHK 3T 312–351 · EWS 50 sq ft",
  udsScope: "Unit-type filed range",
});

const fioranaEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/472/PR/200726/008829"],
  legalPromoter: "LODHA DEVELOPERS LIMITED",
  approvedOn: "20 Jul 2026",
  completion: "31 Mar 2032",
  planApproval: "BIAAPA/TP/CC/170/2026-27 · approved 10 Jul 2026",
  inventory: "540 homes · 5 towers",
  land: "47,196 sq m · approx. 11.66 acres",
  carpet:
    "2 BHK 1,081 · 3 BHK 1,324–1,880 · 3 BHK + study 1,452–1,505 · 4 BHK 2,126–2,181 · penthouses 3,049–4,355 sq ft",
  carpetScope: "540 filed unit rows",
  uds:
    "2 BHK approx. 359 · 3 BHK 424–618 · 3 BHK + study 478–536 · 4 BHK 684–794 · penthouses 1,223–1,710 sq ft",
  udsScope: "Broad configuration range; exact unit row controls",
});

const regentParkEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/308/PR/150726/008810"],
  legalPromoter: "GODREJ PROPERTIES LIMITED",
  approvedOn: "15 Jul 2026",
  completion: "31 Jul 2031",
  planApproval: "APA/CC/193/2026-27 · approved 9 Jul 2026",
  inventory: "534 homes · 2 towers",
  land: "32,678 sq m · approx. 8.07 acres",
  carpet:
    "2 BHK 758–778 · 3 BHK 2T 1,000–1,002 · 3 BHK 3T 1,118–1,119 sq ft",
  carpetScope: "534 filed unit rows",
  uds:
    "2 BHK approx. 154–156 · 3 BHK 2T 199–202 · 3 BHK 3T approx. 234 sq ft",
  udsScope: "Unit-type filed range",
});

const miruMiyoEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/472/PR/050526/008621"],
  legalPromoter: "APG GREEN HOMES PRIVATE LIMITED",
  approvedOn: "5 May 2026",
  completion: "31 Mar 2031",
  planApproval:
    "Bengaluru South Taluk / Hobli-2 / Village-3 / 45/2025-26 · approved 17 Mar 2026",
  inventory: "350 three-bedroom homes",
  land: "25,697 sq m · approx. 6.35 acres",
  carpet: "3 BHK: approx. 1,183–1,236 sq ft",
  carpetScope: "350 filed units",
  uds: "3 BHK: approx. 627–710 sq ft",
  udsScope: "Unit-specific filed range",
});

const museMaisonEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/310/PR/040526/008618"],
  legalPromoter: "ASSETZ PRIVATE LIMITED",
  approvedOn: "4 May 2026",
  completion: "31 Mar 2030",
  planApproval: "BDA/NM/A.A-5/TAS-2/PU/01/2026-27 · approved 9 Apr 2026",
  inventory: "128 three-bedroom homes",
  land: "8,650 sq m · approx. 2.14 acres",
  carpet: "3 BHK: approx. 1,124–1,262 sq ft",
  carpetScope: "128 filed units",
  uds: "3 BHK: approx. 620–683 sq ft",
  udsScope: "Unit-specific filed range",
});

const prestigeGardeniaEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1250/303/PR/080626/008705"],
  legalPromoter: "PRESTIGE ESTATES PROJECTS LTD",
  approvedOn: "8 Jun 2026",
  completion: "31 Oct 2027",
  planApproval: "STRRPA/TP/LAO/44/2025-26 · approved 18 Mar 2026",
  inventory: "195 residential plots",
  land: "84,881 sq m · approx. 20.97 acres",
  carpet: "44,581 sq m total saleable plot area · 195 varied plot schedules",
  carpetScope: "Plotted development",
  carpetNote:
    "Plot dimensions and shapes vary. Use the exact RERA plot row and sanctioned layout for the selected plot.",
  uds: "Apartment UDS is not applicable; verify the registered plot extent and proportionate common rights",
  udsScope: "Exact plotted parcel",
  udsNote:
    "For a plotted development, review the individual plot title, road / open-space surrender and common-area rights instead of applying an apartment UDS metric.",
});

const eatonParkEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/308/PR/180326/008537"],
  legalPromoter: "PRESTIGE PROJECTS PRIVATE LIMITED",
  approvedOn: "18 Mar 2026",
  completion: "30 Jun 2030",
  planApproval: "CC/1459/2025-26 · approved 5 Mar 2026",
  inventory: "366 homes · 4 towers",
  land: "31,008 sq m · approx. 7.66 acres",
  carpet: "3 BHK 1,102–1,355 · 4 BHK 1,579–1,658 sq ft",
  carpetScope: "Filed aggregate and unit schedule",
  carpetNote:
    "The aggregate says 126 three-bedroom and 240 four-bedroom homes, while parsed schedule rows total 131 and 235. Reconcile the exact inventory mix.",
  uds: "3 BHK approx. 592–764 · 4 BHK 841–953 sq ft",
  udsScope: "Unit-type filed range",
});

const fernvaleEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/308/PR/110326/008519"],
  legalPromoter: "PRESTIGE PROJECTS PRIVATE LIMITED",
  approvedOn: "11 Mar 2026",
  completion: "31 Mar 2030",
  planApproval: "CC/1458/2025-26 · approved 5 Mar 2026",
  inventory: "387 homes · 2 towers · aggregate 167 two-bedroom + 220 three-bedroom",
  land: "20,183 sq m · approx. 4.99 acres",
  carpet: "Two filed size bands: 727–729 and 950–1,250 sq ft",
  carpetScope: "387 unit rows; unit-type cells display NA",
  carpetNote:
    "Retain the official aggregate mix, but do not assign a specific variant until the exact unit row and floor plan are mapped.",
  uds: "Two filed size bands: approx. 325–327 and 430–567 sq ft",
  udsScope: "Unit-specific range; type mapping requires confirmation",
});

const brigadeBelvedereEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/446/PR/240326/008549"],
  legalPromoter: "BRIGADE ENTERPRISES LTD",
  approvedOn: "24 Mar 2026",
  completion: "31 Mar 2031",
  planApproval: "BDA/PS/EM/EO-2/TA-3/N/44/2025-26 · approved 17 Mar 2026",
  inventory: "773 homes · 2 towers",
  land: "43,503 sq m · approx. 10.75 acres",
  carpet: "1 BHK 427–439 · 2 BHK 679–754 · 3 BHK 862–1,205 sq ft",
  carpetScope: "773 filed unit rows",
  uds: "1 BHK 115–118 · 2 BHK 180–198 · 3 BHK 221–325 sq ft",
  udsScope: "Unit-type filed range",
});

const brigadeLuminaEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/309/PR/230326/008545"],
  legalPromoter: "BRIGADE ENTERPRISES LTD",
  approvedOn: "23 Mar 2026",
  completion: "31 Dec 2030",
  planApproval: "BDA/PS/EM/EO-1/TA-1/E/05/2025-26 · approved 16 Mar 2026",
  inventory: "416 homes · 3 towers",
  land: "16,076 sq m · approx. 3.97 acres",
  carpet: "2 BHK 713–756 · 3 BHK 939–1,139 sq ft",
  carpetScope: "416 filed unit rows",
  uds: "2 BHK 285–299 · 3 BHK 375–472 sq ft",
  udsScope: "Unit-type filed range",
});

const embassyEdenEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/472/PR/311225/008368"],
  legalPromoter: "SION EDEN DEVELOPERS LIMITED",
  approvedOn: "31 Dec 2025",
  completion: "31 Dec 2031",
  planApproval: "06/2025-26 · approved 16 May 2025",
  inventory: "95 five-bedroom row houses",
  land: "128,081 sq m · approx. 31.65 acres",
  carpet: "5 BHK row houses: approx. 5,129–6,483 sq ft",
  carpetScope: "95 filed row-house schedules",
  uds: "Approx. 10,878–19,902 sq ft",
  udsScope: "Row-house-specific filed land-share range",
  udsNote:
    "The large UDS reflects the row-house format. Confirm the exact land schedule, setbacks and common rights in the agreement and sale deed.",
});

const northernLightsEvidence = officialReraEvidence({
  registrations: [
    "PRM/KA/RERA/1251/309/PR/120326/008523",
    "PRM/KA/RERA/1251/309/PR/120326/008524",
    "PRM/KA/RERA/1251/309/PR/120326/008525",
  ],
  legalPromoter: "KVN PROPERTY HOLDINGS LLP",
  approvedOn: "12 Mar 2026 (all three phases)",
  completion: "Phase 1: 31 Dec 2029 · Phase 2: 31 Dec 2030 · Phase 3: 31 Dec 2031",
  planApproval: "DO3-KIADB-00190/25-26/BP · approved 7 Mar 2026",
  inventory: "2,973 inventories · 8 towers across 3 phases · includes 300 EWS units",
  land: "Approx. 99,514 sq m · 24.59 acres across three phases",
  landScope: "Combined registered phases",
  carpet: "1 BHK 408 · 2 BHK 670–769 · 3 BHK 1,004–1,184 · 4 BHK 2,236–2,332 · EWS 75–85 sq ft",
  carpetScope: "Phase-level filed unit schedules",
  carpetNote:
    "Phase 1 contains a classification / UDS anomaly. Preserve the filed phase aggregate and map the exact unit row before purchase.",
  uds: "1 BHK approx. 135 · 2 BHK 221–254 · 3 BHK 332–391 · 4 BHK 739–771 · EWS 25–28 sq ft",
  udsScope: "Phase 2 / 3 clean ranges; verify Phase 1 row",
  udsNote:
    "Phase 3 also contains a suspect longitude in the filing. Use the sanctioned layout and site survey rather than relying on the coordinate alone.",
});

const sattvaCityEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/472/PR/270226/008494"],
  legalPromoter: "SATTVA CITY PRIVATE LIMITED",
  approvedOn: "27 Feb 2026",
  completion: "28 Feb 2032",
  planApproval: "BIAAPA/TP/CC/496/2025-26/3248 · approved 24 Feb 2026",
  inventory: "2,477 filed inventories · 31 blocks / wings",
  land: "189,513 sq m · approx. 46.83 acres",
  carpet: "Residential filed ranges: 2 BHK 790–1,211 · 2.5 BHK 974–1,249 · 3 BHK 1,138–1,808 · 3.5 BHK 1,287–1,808 · 4 BHK 1,409–4,449 sq ft",
  carpetScope: "Residential schedule; filing also includes non-residential rows",
  carpetNote:
    "The project inventory includes apartment, penthouse, garden, extended-balcony and non-residential rows. Map the exact home type before comparison.",
  uds: "2 BHK 384–589 · 2.5 BHK 465–579 · 3 BHK 533–658 · 3.5 BHK 611–709 · 4 BHK 666–2,119 sq ft",
  udsScope: "Residential variant ranges",
});

const sattvaSongbird2Evidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/310/PR/270326/008557"],
  legalPromoter: "SATTVA RESI PRIVATE LIMITED",
  approvedOn: "27 Mar 2026",
  completion: "27 Jun 2031",
  planApproval: "BaAPr/NaMa/AaSa/AA-2/TaSa-3/Ou/42/2025-26 · approved 27 Feb 2026",
  inventory: "381 homes · Towers 5 and 6",
  land: "17,528 sq m · approx. 4.33 acres",
  carpet: "2 BHK 785–832 · 3 BHK 975–1,098 sq ft",
  carpetScope: "381 filed unit rows",
  uds: "2 BHK 313–327 · 3 BHK 382–443 sq ft",
  udsScope: "Unit-type filed range",
});

const centuryKindleEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/309/PR/200326/008542"],
  legalPromoter: "HEBBAL PROPERTIES PRIVATE LIMITED",
  approvedOn: "20 Mar 2026",
  completion: "14 Mar 2031",
  planApproval: "GBA/BNCC/Addl.CTP/0001/25-26 · approved 29 Jan 2026",
  inventory: "458 homes · 2 towers",
  land: "18,843 sq m · approx. 4.66 acres",
  carpet: "2 BHK 723–803 · 3 BHK 932–1,124 · 4 BHK 1,566–1,873 sq ft",
  carpetScope: "458 filed unit rows",
  uds: "2 BHK 348–382 · 3 BHK 443–561 · 4 BHK 840–933 sq ft",
  udsScope: "Unit-type filed range",
});

const centuryAstoriaEvidence = officialReraEvidence({
  registrations: ["PRM/KA/RERA/1251/309/PR/160526/008662"],
  legalPromoter: "REALKRAFT VENTURES LLP",
  approvedOn: "16 May 2026",
  completion: "12 Feb 2031",
  planApproval: "BBMP/Addl.Dir/JDNORTH/0052/25-26 · approved 31 Dec 2025",
  inventory: "334 homes · 5 towers",
  land: "24,585 sq m · approx. 6.08 acres",
  carpet: "3 BHK 1,358–1,632 · 4 BHK 1,358–3,361 · 6 BHK 3,722–4,713 sq ft",
  carpetScope: "334 filed unit rows",
  carpetNote:
    "The 4 BHK range is unusually wide. Map the exact floor plan and unit row before comparing price per square foot.",
  uds: "3 BHK 516–618 · 4 BHK 516–1,250 · 6 BHK 1,407–1,806 sq ft",
  udsScope: "Unit-type filed range",
});

const mahindraBlossomEvidence = officialReraEvidence({
  registrations: ["TOR/PRM/KA/RERA/1251/446/PR/260615/008348"],
  legalPromoter: "MAHINDRA BLOSSOM DEVELOPERS LIMITED",
  approvedOn: "15 Jun 2026",
  completion: "31 Oct 2030",
  planApproval: "Underlying project plan set · request the exact transfer-linked approved copy",
  inventory: "733 homes · 7 filed wings / towers",
  land: "37,911 sq m · approx. 9.37 acres",
  carpet: "1 BHK 400–586 · 2 BHK / study 749–1,135 · 3 BHK / study 837–1,316 · 4 BHK 1,488–1,516 sq ft",
  carpetScope: "733 filed unit rows",
  carpetNote:
    "The official schedule is materially broader than early 3.5 / 4 BHK marketing and records one- to four-bedroom and study variants.",
  uds: "1 BHK 112–173 · 2 BHK / study 233–359 · 3 BHK / study 331–407 · 4 BHK approx. 454 sq ft",
  udsScope: "Unit-type filed range",
});

const laurelMapleEvidence: ProjectEvidence = {
  checkedAt: "12 Aug 2026",
  reviewLabel: "Karnataka RERA registration and official project disclosure reviewed",
  registrations: ["PRM/KA/RERA/1250/303/PR/040326/008505"],
  legalPromoter: "BCV DEVELOPERS PRIVATE LIMITED",
  officialStatus: "Approved",
  approvedOn: "4 Mar 2026",
  officialCompletion: "31 Mar 2030",
  planApproval: "Request the phase-matched sanctioned plan from the official filing",
  inventory: "Exact filed inventory schedule requires phase-level extraction",
  facts: [
    {
      label: "RERA phase",
      value: "PRM/KA/RERA/1250/303/PR/040326/008505",
      status: "official",
      source: "Karnataka RERA certificate",
      scope: "Laurel & Maple at Brigade Orchards",
      note: "The Brigade brand and BCV Developers legal-promoter identity should both appear in the booking documents.",
    },
    {
      label: "Registered land extent",
      value: "Not safely extracted in this review",
      status: "review-pending",
      source: "Detailed Karnataka RERA filing",
      scope: "Exact registered phase",
      note: "Request the filed land schedule and sanctioned phase boundary instead of using the wider Brigade Orchards township extent.",
    },
    {
      label: "RERA carpet / published carpet area",
      value: "448.54–1,051.21 sq ft",
      status: "published",
      source: "Official Brigade Orchards project disclosure",
      scope: "Published 1, 2 and 3 bed range",
      note: "Map the exact Laurel or Maple product, type and unit to the RERA schedule before comparison.",
    },
    {
      label: "Undivided share (UDS)",
      value: "Exact unit-specific value not yet extracted",
      status: "review-pending",
      source: "Detailed RERA unit schedule / draft agreement",
      scope: "Selected unit",
      note: "Confirm the exact UDS together with the Primus service and common-area obligations.",
    },
  ],
  documents: [
    {
      label: "RERA registration certificate",
      status: "Official link available",
      note: "Open the regulator-hosted certificate from the evidence actions.",
    },
    {
      label: "Laurel and Maple specification schedules",
      status: "Published in K-RERA",
      note: "Request the exact phase-matched specifications because accessibility features differ between products.",
    },
    {
      label: "Approved plan and unit schedule",
      status: "Request exact copy",
      note: "Request the sanctioned phase plan and the exact carpet-area / UDS row before booking.",
    },
  ],
};

const centuryBlissEvidence: ProjectEvidence = {
  checkedAt: "12 Aug 2026",
  reviewLabel: "Karnataka RERA registration and official Century phase disclosure reviewed",
  registrations: ["PRM/KA/RERA/1250/301/PR/210426/008595"],
  legalPromoter: "HEBBAL PROPERTIES PRIVATE LIMITED",
  officialStatus: "Approved",
  approvedOn: "21 Apr 2026",
  officialCompletion: "7 Apr 2031",
  planApproval: "Request the Phase 6 sanctioned plan from the official filing",
  inventory: "Exact phase inventory and product mapping require reconciliation",
  facts: [
    {
      label: "RERA phase",
      value: "PRM/KA/RERA/1250/301/PR/210426/008595",
      status: "official",
      source: "Karnataka RERA certificate and official Century page",
      scope: "Century Eden Phase 6 (Century Bliss)",
      note: "The official developer page identifies this registration as Century Eden Phase 6 and calls the project Century Bliss.",
    },
    {
      label: "Registered land extent",
      value: "Not safely extracted in this review",
      status: "review-pending",
      source: "Detailed Karnataka RERA filing",
      scope: "Phase 6 only",
      note: "Do not use the wider Century Eden extent as the registered extent of Century Bliss.",
    },
    {
      label: "RERA carpet / product schedule",
      value: "Official catalogue says 2 & 3 bed homes; exact filed range pending",
      status: "review-pending",
      source: "Official Century catalogue + detailed filing queue",
      scope: "Phase 6",
      note: "The wider Century Eden page still contains plotted-community material. Reconcile the exact Phase 6 product before relying on a home type.",
    },
    {
      label: "Undivided share (UDS)",
      value: "Exact unit-specific value not yet extracted",
      status: "review-pending",
      source: "Detailed RERA unit schedule / draft agreement",
      scope: "Selected unit",
      note: "Request the exact unit row and legal schedule before comparing the phase.",
    },
  ],
  documents: [
    {
      label: "RERA registration certificate",
      status: "Official link available",
      note: "Open the regulator-hosted certificate from the evidence actions.",
    },
    {
      label: "Phase 6 sanctioned plan and product schedule",
      status: "Request exact copy",
      note: "Use these documents to resolve the apartment-versus-plotted material visible on the wider project page.",
    },
    {
      label: "Unit carpet area, UDS and Agreement for Sale",
      status: "Request exact copy",
      note: "Review the exact unit row and current draft agreement before paying a booking amount.",
    },
  ],
};

const providentEquinox5Evidence: ProjectEvidence = {
  checkedAt: "12 Aug 2026",
  reviewLabel: "Karnataka RERA certificate and official Phase 5 launch disclosure reviewed",
  registrations: ["PRM/KA/RERA/1251/310/PR/170126/008410"],
  legalPromoter: "PROVIDENT HOUSING LIMITED",
  officialStatus: "Approved",
  approvedOn: "17 Jan 2026",
  officialCompletion: "31 Mar 2030",
  planApproval: "Request the exact BDA-approved Phase 5 plan from the filing",
  inventory: "Exact filed inventory schedule requires phase-level extraction",
  facts: [
    {
      label: "RERA phase",
      value: "PRM/KA/RERA/1251/310/PR/170126/008410",
      status: "official",
      source: "Karnataka RERA certificate",
      scope: "Provident Equinox 5",
      note: "The official certificate names Provident Equinox 5 and locates it at Venkatapura Village, Kengeri Hobli.",
    },
    {
      label: "Registered land extent",
      value: "Not safely extracted in this review",
      status: "review-pending",
      source: "Detailed Karnataka RERA filing",
      scope: "Phase 5 only",
      note: "Do not use a third-party or wider-township land figure until it is reconciled with this registration.",
    },
    {
      label: "RERA carpet / unit schedule",
      value: "2 & 3 BHK communication; exact filed range pending",
      status: "review-pending",
      source: "Official Phase 5 launch disclosure + detailed filing queue",
      scope: "Phase 5",
      note: "A reviewed detailed label reportedly says Provident Equinox 1. Resolve that naming mismatch and map the exact unit row.",
    },
    {
      label: "Undivided share (UDS)",
      value: "Exact unit-specific value not yet extracted",
      status: "review-pending",
      source: "Detailed RERA unit schedule / draft agreement",
      scope: "Selected unit",
      note: "Request the exact UDS with the sanctioned tower plan and Agreement for Sale.",
    },
  ],
  documents: [
    {
      label: "RERA registration certificate",
      status: "Official link available",
      note: "The regulator-hosted certificate identifies Provident Equinox 5.",
    },
    {
      label: "Official Phase 5 launch intimation",
      status: "Official link available",
      note: "Puravankara disclosed the launch of Phase 5 in the existing Provident Equinox project.",
    },
    {
      label: "Sanctioned plan, unit schedule and Agreement for Sale",
      status: "Request exact copy",
      note: "Use the exact documents to resolve the project-name mismatch before booking.",
    },
  ],
};

const detailedEvidenceByProject: Record<string, ProjectEvidence> = {
  "Prestige Southern Star": southernStarEvidence,
  "Assetz Mizu & Ki": mizuKiEvidence,
  "Assetz KVN Niwa & Neo": kvnNiwaNeoEvidence,
  "Fiorana at Beaumont Estate – Phase 1": fioranaEvidence,
  "Godrej Regent Park": regentParkEvidence,
  "Assetz Miru & Miyo": miruMiyoEvidence,
  "Assetz Muse & Maison": museMaisonEvidence,
  "Prestige Gardenia Phase 2": prestigeGardeniaEvidence,
  "Eaton Park at The Prestige City": eatonParkEvidence,
  "Fernvale at The Prestige City": fernvaleEvidence,
  "Brigade Belvedere": brigadeBelvedereEvidence,
  "Brigade Lumina": brigadeLuminaEvidence,
  "Embassy Eden": embassyEdenEvidence,
  "Northern Lights by Puravankara KVN": northernLightsEvidence,
  "Sattva City": sattvaCityEvidence,
  "Sattva Songbird Phase 2": sattvaSongbird2Evidence,
  "Century Kindle Phase 1": centuryKindleEvidence,
  "Century Astoria": centuryAstoriaEvidence,
  "Mahindra Blossom": mahindraBlossomEvidence,
  "Laurel & Maple at Brigade Orchards": laurelMapleEvidence,
  "Century Bliss": centuryBlissEvidence,
  "Provident Equinox 5": providentEquinox5Evidence,
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
