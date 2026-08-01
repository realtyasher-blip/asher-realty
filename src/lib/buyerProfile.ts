import type { Project } from "@/data/projects";

export const BUYER_PROFILE_KEY = "asher-buyer-preferences";
export const BUYER_PROFILE_EVENT = "asher:buyer-profile-updated";

export type BuyerPreferences = {
  corridor: string;
  configuration: string;
  budget: string;
  purpose: string;
  workHub: string;
  timeline: string;
  priority: string;
  customized: boolean;
};

export type BuyerPreferenceField = Exclude<keyof BuyerPreferences, "customized">;

export const defaultBuyerPreferences: BuyerPreferences = {
  corridor: "Flexible",
  configuration: "3",
  budget: "Flexible",
  purpose: "Self-use",
  workHub: "Flexible",
  timeline: "Flexible",
  priority: "Balanced",
  customized: false,
};

export const buyerPreferenceOptions: Array<{
  label: string;
  key: BuyerPreferenceField;
  options: string[];
}> = [
  {
    label: "Preferred corridor",
    key: "corridor",
    options: [
      "Flexible",
      "East Bengaluru",
      "North Bengaluru",
      "South Bengaluru",
      "Central Bengaluru",
    ],
  },
  {
    label: "Home size",
    key: "configuration",
    options: ["1", "2", "3", "4"],
  },
  {
    label: "Budget",
    key: "budget",
    options: ["Flexible", "Up to ₹2 Cr", "₹2–3 Cr", "₹3 Cr+"],
  },
  {
    label: "Buying for",
    key: "purpose",
    options: ["Self-use", "Investment"],
  },
  {
    label: "Daily work anchor",
    key: "workHub",
    options: [
      "Flexible",
      "Whitefield / ITPL",
      "ORR / Bellandur",
      "Manyata Tech Park",
      "Electronic City",
      "CBD / MG Road",
      "Airport / Devanahalli",
    ],
  },
  {
    label: "Move-in preference",
    key: "timeline",
    options: ["Flexible", "Ready–2 years", "2–4 years", "4+ years"],
  },
  {
    label: "Top priority",
    key: "priority",
    options: [
      "Balanced",
      "Metro & commute",
      "Open space & lifestyle",
      "Rental & appreciation",
      "Large home",
    ],
  },
];

const workHubCorridor: Record<string, Project["corridor"]> = {
  "Whitefield / ITPL": "East Bengaluru",
  "ORR / Bellandur": "East Bengaluru",
  "Manyata Tech Park": "North Bengaluru",
  "Electronic City": "South Bengaluru",
  "CBD / MG Road": "Central Bengaluru",
  "Airport / Devanahalli": "North Bengaluru",
};

function safeProjectText(project: Project) {
  return [
    project.location,
    project.corridor,
    project.description,
    project.propertyType || "",
    project.unitSizes || "",
    ...(project.highlights || []),
    ...(project.amenities || []),
    ...(project.nearby || []),
  ]
    .join(" ")
    .toLowerCase();
}

export function projectPriceCrores(price: string) {
  const match = price.match(/(?:₹|INR)\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const value = Number(match[1]);
  return /\bL\b|lakh/i.test(price) ? value / 100 : value;
}

export function budgetFits(project: Project, budget: string) {
  const value = projectPriceCrores(project.price);
  if (budget === "Flexible" || value === null) return true;
  if (budget === "Up to ₹2 Cr") return value <= 2;
  if (budget === "₹2–3 Cr") return value >= 2 && value <= 3;
  return value >= 3;
}

function timelineFit(project: Project, timeline: string) {
  if (timeline === "Flexible") return true;
  if (timeline === "Ready–2 years") {
    return project.status === "Ready / active" || /2026|2027|2028/.test(project.possession || "");
  }
  if (timeline === "2–4 years") {
    return project.status === "Under construction" || /2028|2029|2030/.test(project.possession || "");
  }
  return ["Coming soon", "New launch", "Under construction"].includes(project.status);
}

export function scoreProject(project: Project, preferences: BuyerPreferences) {
  let score = project.featured ? 47 : 43;
  const reasons: string[] = [];
  const text = safeProjectText(project);
  const preferredCorridor =
    preferences.corridor !== "Flexible"
      ? preferences.corridor
      : workHubCorridor[preferences.workHub];

  if (preferredCorridor && project.corridor === preferredCorridor) {
    score += 18;
    reasons.push(
      preferences.workHub !== "Flexible"
        ? `${preferences.workHub} commute lens`
        : `${preferredCorridor} match`
    );
  } else if (!preferredCorridor) {
    score += 8;
    reasons.push("Strong Bengaluru option");
  }

  if (project.configuration.includes(preferences.configuration)) {
    score += 14;
    reasons.push(`${preferences.configuration} BHK available`);
  }

  if (budgetFits(project, preferences.budget)) {
    score += 12;
    reasons.push(
      projectPriceCrores(project.price) === null
        ? "Price needs live confirmation"
        : "Within selected budget band"
    );
  } else {
    score -= 8;
  }

  if (timelineFit(project, preferences.timeline)) {
    score += 8;
    if (preferences.timeline !== "Flexible") {
      reasons.push(`${preferences.timeline} delivery fit`);
    }
  }

  if (
    preferences.purpose === "Investment" &&
    ["North Bengaluru", "East Bengaluru"].includes(project.corridor)
  ) {
    score += 7;
    reasons.push("Growth-corridor exposure");
  }

  if (preferences.purpose === "Self-use" && (project.amenities?.length || 0) >= 5) {
    score += 6;
    reasons.push("Family-lifestyle depth");
  }

  const priorityRules: Record<string, { pattern: RegExp; reason: string }> = {
    "Metro & commute": {
      pattern: /metro|outer ring road|orr|tech park|itpl|airport road|electronic city/,
      reason: "Commute-led location",
    },
    "Open space & lifestyle": {
      pattern: /open space|green|garden|forest|lake|clubhouse|landscape/,
      reason: "Open-space and lifestyle fit",
    },
    "Rental & appreciation": {
      pattern: /tech|employment|airport|metro|itpl|manyata|electronic city/,
      reason: "Employment-demand catchment",
    },
    "Large home": {
      pattern: /4 bhk|villa|row house|large-format|2,\d{3}|3,\d{3}/,
      reason: "Large-home potential",
    },
  };
  const priorityRule = priorityRules[preferences.priority];
  if (priorityRule?.pattern.test(text)) {
    score += 7;
    reasons.push(priorityRule.reason);
  } else if (preferences.priority === "Balanced") {
    score += 4;
  }

  if (project.rera) score += 3;
  if (project.possession) score += 2;
  if (project.status === "Coming soon") score -= 4;

  return {
    project,
    score: Math.max(38, Math.min(score, 97)),
    reasons: Array.from(new Set(reasons)).slice(0, 3),
  };
}

export function readBuyerPreferences(): BuyerPreferences {
  if (typeof window === "undefined") return defaultBuyerPreferences;

  try {
    const stored = JSON.parse(localStorage.getItem(BUYER_PROFILE_KEY) || "null");
    return stored && typeof stored === "object"
      ? { ...defaultBuyerPreferences, ...stored }
      : defaultBuyerPreferences;
  } catch {
    return defaultBuyerPreferences;
  }
}

export function writeBuyerPreferences(preferences: BuyerPreferences) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BUYER_PROFILE_KEY, JSON.stringify(preferences));
  } catch {
    // Preferences remain usable for the session in privacy-restricted browsers.
  }
  window.dispatchEvent(new CustomEvent(BUYER_PROFILE_EVENT));
  const analyticsWindow = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  };
  analyticsWindow.gtag?.("event", "buyer_profile_updated", {
    page_path: window.location.pathname,
  });
}

export function buyerBriefSummary(preferences: BuyerPreferences) {
  return [
    `${preferences.configuration} BHK`,
    preferences.budget,
    preferences.corridor === "Flexible" ? preferences.workHub : preferences.corridor,
    preferences.timeline,
    preferences.purpose,
  ]
    .filter((value) => value && value !== "Flexible")
    .join(" · ");
}
