import { developerLogos } from "@/data/projects";

export type DeveloperProfile = {
  name: string;
  established: string;
  headquarters: string;
  summary: string;
  knownFor: string[];
  buyerLens: string;
  verify: string[];
  sourceUrl: string;
};

export function developerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const developerProfiles: DeveloperProfile[] = [
  {
    name: "SOBHA",
    established: "1995",
    headquarters: "Bengaluru",
    summary:
      "A Bengaluru-founded national developer known for its backward-integrated delivery model, in-house capabilities and strong emphasis on engineering and finish quality.",
    knownFor: ["Backward-integrated execution", "Premium residences", "Large townships"],
    buyerLens:
      "Strong for buyers who value construction control and finish consistency. Compare phase, tower density and final all-inclusive cost across SOBHA communities.",
    verify: ["Tower-specific possession", "Carpet area and cost sheet", "Amenity delivery by phase"],
    sourceUrl: "https://www.sobha.com/story/",
  },
  {
    name: "Prestige Group",
    established: "1986",
    headquarters: "Bengaluru",
    summary:
      "A Bengaluru-headquartered listed developer with a broad portfolio across residential, commercial, retail, hospitality and large mixed-use developments.",
    knownFor: ["Integrated townships", "Multi-asset development", "Broad Bengaluru footprint"],
    buyerLens:
      "Useful for buyers seeking choice across corridors and formats. Compare the exact phase, master-plan scale, traffic access and shared amenity timelines.",
    verify: ["Phase-specific RERA", "Tower location in master plan", "Clubhouse and access timelines"],
    sourceUrl: "https://www.prestigeconstructions.com/",
  },
  {
    name: "Birla Estates",
    established: "2016",
    headquarters: "Mumbai",
    summary:
      "The real-estate venture of the Aditya Birla Group, focused on premium residential, commercial and mixed-use developments through its LifeDesigned philosophy.",
    knownFor: ["Design-led planning", "Premium housing", "Institutional governance"],
    buyerLens:
      "Consider when layout quality, brand governance and contemporary design matter. Review usable room dimensions and delivery commitments project by project.",
    verify: ["Net usable layout", "Specification schedule", "Possession and payment milestones"],
    sourceUrl: "https://www.birlaestates.com/organisation.aspx",
  },
  {
    name: "Assetz Property Group",
    established: "2006",
    headquarters: "Bengaluru",
    summary:
      "A professionally managed Bengaluru developer whose portfolio spans residential and commercial projects, with a recurring focus on design and sustainability.",
    knownFor: ["Contemporary design", "Sustainability features", "East Bengaluru presence"],
    buyerLens:
      "Often relevant for buyers prioritising modern layouts and green features. Verify maintenance implications, open-space claims and commute routes at peak hour.",
    verify: ["Green-feature specifications", "Open-space calculation", "Peak-hour connectivity"],
    sourceUrl: "https://www.assetzproperty.com/about",
  },
  {
    name: "Sumadhura Group",
    established: "1995",
    headquarters: "Bengaluru",
    summary:
      "A South India-focused developer active across residences, workplaces, plotted communities and logistics, with a substantial presence in Bengaluru and Hyderabad.",
    knownFor: ["Large communities", "Whitefield portfolio", "Residential and plotted formats"],
    buyerLens:
      "Good to compare for East Bengaluru family living. Examine tower spacing, actual open areas, phase handover and the operating plan for large clubhouses.",
    verify: ["Tower spacing", "Phase handover", "Clubhouse operating plan"],
    sourceUrl: "https://sumadhuragroup.com/about-us",
  },
  {
    name: "Brigade Group",
    established: "1986",
    headquarters: "Bengaluru",
    summary:
      "A listed Bengaluru-based property group spanning residential, offices, retail and hospitality, with decades of development across South Indian cities.",
    knownFor: ["Mixed-use destinations", "Residential communities", "Commercial ecosystem"],
    buyerLens:
      "Relevant for buyers who value integrated destinations and established delivery systems. Compare micro-location, phase density and total recurring charges.",
    verify: ["Recurring charges", "Phase density", "Shared infrastructure delivery"],
    sourceUrl: "https://www.brigadegroup.com/",
  },
  {
    name: "Lodha",
    established: "Four-decade legacy",
    headquarters: "Mumbai",
    summary:
      "A large listed national developer known for premium residential communities, integrated ecosystems and large-scale urban development.",
    knownFor: ["Large-scale delivery", "Luxury residences", "Integrated ecosystems"],
    buyerLens:
      "Review when brand-led services and a managed lifestyle are important. Compare service charges, specifications and Bengaluru execution history for the exact project.",
    verify: ["Service-charge structure", "Specification inclusions", "Local delivery schedule"],
    sourceUrl: "https://www.lodhagroup.com/",
  },
  {
    name: "Godrej Properties",
    established: "1990",
    headquarters: "Mumbai",
    summary:
      "The real-estate arm of the Godrej Industries Group, combining a national residential footprint with a stated focus on design, sustainability and community building.",
    knownFor: ["National platform", "Sustainability focus", "Township development"],
    buyerLens:
      "Strong consideration for governance-conscious buyers. Confirm the development partnership structure, phase RERA and exact specifications before comparing price.",
    verify: ["Development entity", "Phase-specific RERA", "Cost and specification schedule"],
    sourceUrl: "https://www.godrejproperties.com/know-us/about",
  },
  {
    name: "Bhartiya Urban",
    established: "Urban venture of Bhartiya Group",
    headquarters: "Bengaluru",
    summary:
      "The real-estate and infrastructure arm behind Bhartiya City, a master-planned urban district combining homes, workplaces, retail, hospitality and public spaces.",
    knownFor: ["Integrated city planning", "Design-led urbanism", "North Bengaluru"],
    buyerLens:
      "Best understood as a city ecosystem rather than a standalone apartment. Evaluate district location, completed social infrastructure and future construction around the home.",
    verify: ["District and tower position", "Operational infrastructure", "Future construction phases"],
    sourceUrl: "https://www.bhartiya.com/",
  },
  {
    name: "Embassy Developments",
    established: "1993 group heritage",
    headquarters: "Bengaluru",
    summary:
      "Part of a Bengaluru-rooted real-estate ecosystem with experience across commercial, residential, industrial and large urban developments.",
    knownFor: ["Large urban campuses", "North Bengaluru", "Commercial-led ecosystems"],
    buyerLens:
      "Relevant for buyers who value large campuses and employment-led locations. Verify the precise development entity, residential phase and shared infrastructure obligations.",
    verify: ["Project development entity", "Residential phase scope", "Infrastructure responsibility"],
    sourceUrl: "https://embassyindia.com/",
  },
  {
    name: "Puravankara",
    established: "1975",
    headquarters: "Bengaluru",
    summary:
      "A Bengaluru-headquartered listed developer with residential brands spanning premium homes, mid-income housing, plotted development and construction services.",
    knownFor: ["Five-decade track record", "Multiple housing brands", "Customer-focused systems"],
    buyerLens:
      "Offers useful choice across price segments and formats. Confirm whether the project sits under Puravankara, Provident or Purva Land and compare the relevant product standard.",
    verify: ["Brand and legal entity", "Product specification", "Possession and quality process"],
    sourceUrl: "https://www.puravankara.com/about-us",
  },
  {
    name: "Provident Housing",
    established: "2008",
    headquarters: "Bengaluru",
    summary:
      "The value-housing subsidiary of Puravankara, focused on practical, community-led homes across major Indian cities.",
    knownFor: ["Value-oriented homes", "Large communities", "Puravankara group platform"],
    buyerLens:
      "Relevant for buyers balancing price, connectivity and community amenities. Always map the exact Provident phase because large townships can have several registrations and separate delivery schedules.",
    verify: ["Exact phase and tower", "RERA carpet area and UDS", "Shared-amenity delivery"],
    sourceUrl: "https://www.providenthousing.com/about-us/",
  },
  {
    name: "Sattva Group",
    established: "Three-decade legacy",
    headquarters: "Bengaluru",
    summary:
      "A Bengaluru-rooted diversified property group with experience across residential communities, offices, urban infrastructure and related real-estate services.",
    knownFor: ["Bengaluru portfolio", "Residential and commercial scale", "Large communities"],
    buyerLens:
      "Compare for location depth and large-community planning. Check phase-specific RERA, handover sequencing and the relationship between residential and commercial components.",
    verify: ["Phase-specific approvals", "Handover sequencing", "Mixed-use interfaces"],
    sourceUrl: "https://sattvagroup.in/",
  },
  {
    name: "Total Environment",
    established: "Design-led Bengaluru studio",
    headquarters: "Bengaluru",
    summary:
      "A design-focused developer recognised for nature-integrated luxury homes, customisation and a distinctive architectural approach.",
    knownFor: ["Nature-integrated design", "Customisable homes", "Luxury apartments and villas"],
    buyerLens:
      "Best for buyers who prioritise architecture, privacy and long-term living quality. Carefully compare customisation scope, delivery timing and maintenance intensity.",
    verify: ["Customisation cut-off", "Delivery schedule", "Landscape maintenance cost"],
    sourceUrl: "https://www.totalenvironment.in/",
  },
  {
    name: "Century Real Estate",
    established: "1973",
    headquarters: "Bengaluru",
    summary:
      "A long-established Bengaluru developer and landowner active across residential, commercial and plotted development in the city.",
    knownFor: ["Deep Bengaluru land portfolio", "North Bengaluru", "Plotted and residential formats"],
    buyerLens:
      "Useful for buyers studying North Bengaluru and plotted formats. Verify approach roads, surrounding land use and development sequencing in emerging locations.",
    verify: ["Approach-road status", "Surrounding land use", "Infrastructure phasing"],
    sourceUrl: "https://www.centuryrealestate.in/about",
  },
  {
    name: "Mahindra Lifespaces",
    established: "1994",
    headquarters: "Mumbai",
    summary:
      "The Mahindra Group's real-estate and infrastructure arm, focused on sustainable residential communities, integrated cities and industrial clusters.",
    knownFor: ["Sustainable design", "Net-zero initiatives", "Institutional governance"],
    buyerLens:
      "Strong for sustainability-focused buyers. Translate green claims into measurable home comfort, utility savings, certification scope and long-term maintenance.",
    verify: ["Certification scope", "Energy and water systems", "Maintenance responsibilities"],
    sourceUrl: "https://www.mahindralifespaces.com/our-story/",
  },
];

export function getDeveloperBySlug(slug: string) {
  return developerProfiles.find((profile) => developerSlug(profile.name) === slug);
}

export function getDeveloperLogo(name: string) {
  return developerLogos[name];
}
