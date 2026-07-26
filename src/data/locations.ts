import { projects, type Project } from "@/data/projects";

export type LocationHub = {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  bestFor: string[];
  buyerNote: string;
  connectivity: string[];
  match: (project: Project) => boolean;
};

export const locationHubs: LocationHub[] = [
  {
    slug: "east-bengaluru",
    name: "East Bengaluru",
    eyebrow: "Technology-led residential corridor",
    summary:
      "Whitefield, Sarjapur, Panathur and the ORR catchment combine major employment hubs with Bengaluru’s deepest pipeline of township and premium apartment choices.",
    bestFor: ["Technology professionals", "Family townships", "Rental-demand visibility"],
    buyerNote:
      "Compare commute routes at peak hours and verify the exact access road, not only the broad East Bengaluru label.",
    connectivity: ["Whitefield", "Outer Ring Road", "Sarjapur Road", "Old Madras Road"],
    match: (project) => project.corridor === "East Bengaluru",
  },
  {
    slug: "north-bengaluru",
    name: "North Bengaluru",
    eyebrow: "Airport and business-growth corridor",
    summary:
      "The airport economy, Manyata employment district, Aerospace Park and Yelahanka have created a broad mix of large townships and premium family homes.",
    bestFor: ["Airport access", "Long-horizon buyers", "Large township choices"],
    buyerNote:
      "North Bengaluru is not one micro-market. Test daily access to your workplace before assigning value to airport proximity.",
    connectivity: ["Kempegowda Airport", "Manyata Tech Park", "Yelahanka", "Aerospace Park"],
    match: (project) => project.corridor === "North Bengaluru",
  },
  {
    slug: "south-bengaluru",
    name: "South Bengaluru",
    eyebrow: "Established end-user market",
    summary:
      "Bannerghatta Road, Electronic City, Hosa Road and the HSR catchment offer established social infrastructure with a growing selection of premium communities.",
    bestFor: ["End-use families", "Established neighbourhoods", "South-side employment"],
    buyerNote:
      "Prioritise the school, workplace and healthcare route you will use weekly; cross-city travel can outweigh a stronger headline price.",
    connectivity: ["Electronic City", "Bannerghatta Road", "HSR Layout", "Hosa Road"],
    match: (project) => project.corridor === "South Bengaluru",
  },
  {
    slug: "central-bengaluru",
    name: "Central Bengaluru",
    eyebrow: "Scarce premium city inventory",
    summary:
      "Central addresses trade township scale for established neighbourhood value, mature infrastructure and shorter access to multiple business districts.",
    bestFor: ["Premium end use", "Central-city access", "Low-inventory addresses"],
    buyerNote:
      "Compare usable home area, privacy and redevelopment around the site; central projects often command a premium for scarcity.",
    connectivity: ["Koramangala", "CBD access", "Inner Ring Road", "Established social infrastructure"],
    match: (project) => project.corridor === "Central Bengaluru",
  },
  {
    slug: "whitefield",
    name: "Whitefield",
    eyebrow: "Bengaluru’s most active eastern hub",
    summary:
      "Whitefield and its adjoining Varthur, Hoskote and Old Madras Road belts offer metro access, technology employment and some of the city’s largest residential communities.",
    bestFor: ["Whitefield employees", "Metro-oriented buyers", "Township living"],
    buyerNote:
      "Check the project’s real drive time to your office and metro station; the Whitefield label covers a wide geography.",
    connectivity: ["Purple Line metro", "ITPL", "Varthur Road", "Old Madras Road"],
    match: (project) =>
      /whitefield|varthur|hoskote|old madras/i.test(project.location),
  },
  {
    slug: "sarjapur-road",
    name: "Sarjapur Road",
    eyebrow: "Family and technology catchment",
    summary:
      "Sarjapur Road links eastern technology districts with a broad education and residential ecosystem, attracting both premium end users and long-horizon buyers.",
    bestFor: ["ORR commuters", "School access", "Premium family homes"],
    buyerNote:
      "Verify the exact distance from the main road and compare alternative access during rain and peak commuting periods.",
    connectivity: ["Outer Ring Road", "HSR Layout", "Carmelaram", "Whitefield link"],
    match: (project) => /sarjapur|kodathi|yamare/i.test(project.location),
  },
  {
    slug: "devanahalli",
    name: "Devanahalli",
    eyebrow: "Airport-side investment corridor",
    summary:
      "Devanahalli’s appeal is tied to airport access, business and infrastructure growth, with large master plans offering a longer-term ownership proposition.",
    bestFor: ["Airport economy", "Long-term ownership", "Large master plans"],
    buyerNote:
      "Treat infrastructure and appreciation claims as scenarios, not guarantees. Verify current occupancy, access and delivery timelines.",
    connectivity: ["Kempegowda Airport", "Airport Road", "Shettigere", "North Bengaluru"],
    match: (project) => /devanahalli|shettigere/i.test(project.location),
  },
  {
    slug: "manyata-hebbal",
    name: "Manyata–Hebbal",
    eyebrow: "Employment-led North Bengaluru hub",
    summary:
      "Manyata, Nagavara, Rachenahalli and Thanisandra combine a major employment base with established retail, healthcare and airport-road connectivity.",
    bestFor: ["Manyata professionals", "Shorter work commutes", "Premium family homes"],
    buyerNote:
      "Compare access from both Hebbal and Thanisandra sides; local traffic patterns can materially change the daily experience.",
    connectivity: ["Manyata Tech Park", "Hebbal", "Thanisandra", "Airport Road"],
    match: (project) =>
      /manyata|nagavara|rachenahalli|thanisandra|bhartiya/i.test(project.location),
  },
];

export function getLocationHub(slug: string) {
  return locationHubs.find((hub) => hub.slug === slug);
}

export function getProjectsForLocation(hub: LocationHub) {
  return projects.filter(hub.match);
}

