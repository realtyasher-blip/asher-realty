export type CorridorIntelligence = {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  signal: string;
  scores: {
    employment: number;
    connectivity: number;
    family: number;
    lifestyle: number;
    longTerm: number;
  };
  bestFor: string[];
  watchouts: string[];
};

/**
 * Asher Decision Index values are editorial decision-support scores, not price
 * forecasts. They combine employment access, present connectivity, social
 * infrastructure, project depth and the practical needs of Bengaluru buyers.
 */
export const corridorIntelligence: CorridorIntelligence[] = [
  {
    slug: "east-bengaluru",
    name: "East Bengaluru",
    shortName: "East",
    headline: "Deepest premium project choice around Bengaluru’s technology core.",
    signal: "High buyer activity",
    scores: {
      employment: 94,
      connectivity: 82,
      family: 86,
      lifestyle: 88,
      longTerm: 84,
    },
    bestFor: ["Whitefield and ORR professionals", "Township lifestyles", "Rental-demand visibility"],
    watchouts: ["Peak-hour road access", "Project-to-metro distance", "Micro-market price variation"],
  },
  {
    slug: "north-bengaluru",
    name: "North Bengaluru",
    shortName: "North",
    headline: "Airport economy, Manyata and large master plans shape the long view.",
    signal: "Growth watch",
    scores: {
      employment: 82,
      connectivity: 78,
      family: 79,
      lifestyle: 86,
      longTerm: 92,
    },
    bestFor: ["Airport-linked households", "Manyata professionals", "Long-horizon ownership"],
    watchouts: ["Distance from daily workplace", "Current occupancy around the project", "Future-infrastructure claims"],
  },
  {
    slug: "south-bengaluru",
    name: "South Bengaluru",
    shortName: "South",
    headline: "Established social infrastructure with strong end-user depth.",
    signal: "End-user strength",
    scores: {
      employment: 83,
      connectivity: 84,
      family: 91,
      lifestyle: 82,
      longTerm: 78,
    },
    bestFor: ["Family end use", "South-side employment", "Established neighbourhood access"],
    watchouts: ["Cross-city commute", "Last-mile metro access", "Older-road bottlenecks"],
  },
  {
    slug: "central-bengaluru",
    name: "Central Bengaluru",
    shortName: "Central",
    headline: "Scarce premium supply prioritising access, privacy and established value.",
    signal: "Scarcity premium",
    scores: {
      employment: 90,
      connectivity: 91,
      family: 84,
      lifestyle: 90,
      longTerm: 80,
    },
    bestFor: ["Central-city access", "Premium end use", "Lower-inventory addresses"],
    watchouts: ["Higher entry price", "Smaller community scale", "Neighbouring redevelopment"],
  },
];

export const dueDiligenceChecks = [
  {
    title: "All-inclusive cost",
    detail: "Base price, floor rise, parking, clubhouse, GST, registration and maintenance corpus.",
  },
  {
    title: "RERA and tower mapping",
    detail: "Match the quoted unit to the correct registration, phase and committed possession.",
  },
  {
    title: "Usable home efficiency",
    detail: "Compare carpet area, balcony utility, circulation and furniture-ready room dimensions.",
  },
  {
    title: "Daily access test",
    detail: "Check real peak-hour routes to work, school, healthcare and the nearest mass transit.",
  },
  {
    title: "Construction and delivery",
    detail: "Review current progress, phase dependencies and the developer’s delivery track record.",
  },
  {
    title: "Unit-level quality",
    detail: "Evaluate orientation, light, ventilation, privacy, view protection and nearby services.",
  },
  {
    title: "Payment-plan reality",
    detail: "Model cash flow, loan disbursement, pre-EMI and the cost of delayed possession.",
  },
  {
    title: "Exit and rental scenario",
    detail: "Treat appreciation as a scenario; assess tenant depth, competing supply and holding period.",
  },
];

export const benchmarkPrinciples = [
  "Search that starts with buyer intent, not a builder brochure",
  "Clear source dates and confidence labels on every important fact",
  "Side-by-side comparison across builders and corridors",
  "Saved decisions that continue across return visits",
  "Fast human handoff with the buyer’s context already prepared",
];
