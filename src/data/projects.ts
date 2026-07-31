export type ProjectStatus =
  | "Coming soon"
  | "New launch"
  | "Under construction"
  | "Ready / active";

export type Project = {
  name: string;
  developer: string;
  location: string;
  corridor: "East Bengaluru" | "North Bengaluru" | "South Bengaluru" | "Central Bengaluru";
  configuration: string;
  propertyType?: string;
  unitSizes?: string;
  price: string;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  amenities?: string[];
  nearby?: string[];
  buyerNotes?: string[];
  video?: string;
  status: ProjectStatus;
  area?: string;
  possession?: string;
  rera?: string;
  featured?: boolean;
  verifiedAt: string;
  sourceUrl: string;
};

export const developerLogos: Record<string, string> = {
  SOBHA: "/logos/sobha-official.png",
  "Prestige Group": "/logos/prestige-official.svg",
  "Birla Estates": "/logos/birla-estates-official.png",
  "Assetz Property Group": "/logos/assetz-official.svg",
  "Sumadhura Group": "/logos/sumadhura-official.svg",
  "Brigade Group": "/logos/brigade-official.png",
  Lodha: "/logos/lodha-official.svg",
  "Godrej Properties": "/logos/godrej-properties-official.svg",
  "Bhartiya Urban": "/logos/bhartiya-official.jpg",
};

export function projectSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => projectSlug(project.name) === slug);
}

const verifiedAt = "30 Jul 2026";

/**
 * Public buyer catalogue assembled from developer-owned pages and disclosures.
 * Source URLs are retained for editorial audit but are intentionally not exposed
 * as outbound links. Price and inventory always require current confirmation.
 */
export const projects: Project[] = [
  {
    name: "SOBHA OneWorld",
    developer: "SOBHA",
    location: "Greater Whitefield, Old Madras Road",
    corridor: "East Bengaluru",
    configuration: "2, 3 & 4 Bed Residences",
    price: "Contact for developer-approved price",
    image: "/projects/sobha-oneworld/aerial.jpg",
    gallery: [
      "/projects/sobha-oneworld/aerial.jpg",
      "/projects/sobha-oneworld/living-dining.jpg",
      "/projects/sobha-oneworld/world-stadium.jpg",
    ],
    video: "/projects/sobha-oneworld/project-film.mp4",
    description:
      "A next-generation integrated township bringing residences, landscaped environments, retail, recreation and community experiences together in one master-planned address.",
    highlights: [
      "Integrated township setting",
      "Lifestyle and sports amenities",
      "Greater Whitefield growth corridor",
    ],
    status: "New launch",
    possession: "Phased delivery; verify current tower",
    featured: true,
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-oneworld-greater-whitefield/",
  },
  {
    name: "SOBHA Altair",
    developer: "SOBHA",
    location: "Off Sarjapur Main Road",
    corridor: "East Bengaluru",
    configuration: "3 & 4 Bed Residences",
    price: "Contact for developer-approved price",
    image: "/projects/sobha-altair/hero.webp",
    gallery: ["/projects/sobha-altair/hero.webp"],
    description:
      "A low-density luxury address off Sarjapur Road, planned for privacy, generous proportions and quieter living while retaining access to the eastern technology corridor.",
    highlights: [
      "1894–2570 sq ft residences",
      "Low-density luxury planning",
      "Sarjapur–ORR employment access",
    ],
    status: "New launch",
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-altair/",
  },
  {
    name: "SOBHA Neopolis",
    developer: "SOBHA",
    location: "Panathur, off Marathahalli–ORR",
    corridor: "East Bengaluru",
    configuration: "3 & 4 Bed Residences",
    price: "Contact for developer-approved price",
    image: "/projects/sobha-neopolis/hero.webp",
    gallery: [
      "/projects/sobha-neopolis/hero.webp",
      "/projects/sobha-neopolis/gallery-2.webp",
    ],
    description:
      "A Greek-themed township in the Panathur–ORR catchment, combining a multi-tower residential plan with island-inspired landscaping and an extensive amenity programme.",
    highlights: [
      "19-tower township plan",
      "1611–2481 sq ft homes",
      "Near the Outer Ring Road tech belt",
    ],
    status: "Under construction",
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-neopolis-apartments-in-panathur/",
  },
  {
    name: "SOBHA Ayana",
    developer: "SOBHA",
    location: "Panathur, off Marathahalli–ORR",
    corridor: "East Bengaluru",
    configuration: "3 Bed Residences",
    price: "Contact for developer-approved price",
    image: "/projects/sobha-ayana/hero.webp",
    gallery: ["/projects/sobha-ayana/hero.webp"],
    description:
      "A modern tropical residential phase within the larger SOBHA Dream Acres community, designed around greenery, ventilation and a broad multi-generational amenity mix.",
    highlights: [
      "1553–1789 sq ft residences",
      "100+ lifestyle experiences",
      "Panathur–ORR connectivity",
    ],
    status: "Under construction",
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-ayana/",
  },
  {
    name: "SOBHA Infinia",
    developer: "SOBHA",
    location: "Koramangala",
    corridor: "Central Bengaluru",
    configuration: "3 & 4 Bed Residences",
    price: "Contact for developer-approved price",
    image: "/projects/sobha-infinia/hero.webp",
    gallery: ["/projects/sobha-infinia/hero.webp"],
    description:
      "An ultra-luxury residential address in Koramangala balancing large-format homes, central-city convenience and a landscape-led private community.",
    highlights: [
      "1768–3264 sq ft residences",
      "Central Bengaluru address",
      "Premium low-inventory positioning",
    ],
    status: "Under construction",
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-infinia/",
  },
  {
    name: "SOBHA Townpark",
    developer: "SOBHA",
    location: "Near Electronic City",
    corridor: "South Bengaluru",
    configuration: "2, 3 & 4 Bed Residences",
    price: "Contact for developer-approved price",
    image: "/projects/sobha-townpark/hero.webp",
    gallery: ["/projects/sobha-townpark/hero.webp"],
    description:
      "A New York-themed residential township near Electronic City with multiple towers, active social spaces and a wide selection of family-sized homes.",
    highlights: [
      "New tower inventory",
      "1240–2846 sq ft homes",
      "Electronic City employment corridor",
    ],
    status: "Under construction",
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-townpark/",
  },
  {
    name: "SOBHA Magnus",
    developer: "SOBHA",
    location: "Kalena Agrahara, Bannerghatta Main Road",
    corridor: "South Bengaluru",
    configuration: "3 & 4 Bed Residences",
    propertyType: "Eco-luxe apartments",
    unitSizes: "1,856–2,578 sq ft",
    price: "₹3.4 Cr onwards*",
    image: "/projects/sobha-magnus/day.webp",
    gallery: [
      "/projects/sobha-magnus/day.webp",
      "/projects/sobha-magnus/club.webp",
      "/projects/sobha-magnus/pool.webp",
    ],
    video: "/projects/sobha-magnus/film.mp4",
    description:
      "A 5.85-acre biophilic community on Bannerghatta Main Road with 294 large-format homes, climate-responsive planning and a two-storey clubhouse designed for multi-generational living.",
    highlights: [
      "Biophilic, climate-responsive design",
      "294 residences in a 5.85-acre community",
      "More than 20 lifestyle amenities",
    ],
    amenities: [
      "Two-storey clubhouse",
      "Swimming pool",
      "Multi-sport court",
      "Amphitheatre",
      "Children’s play park",
      "Pet park",
      "Senior citizens’ corner",
      "Nature pavilion",
    ],
    nearby: [
      "Bannerghatta Main Road",
      "Kalena Agrahara",
      "South Bengaluru employment corridor",
    ],
    buyerNotes: [
      "A strong shortlist for buyers prioritising larger homes and South Bengaluru access.",
      "Ask for the tower-specific view, floor rise, all-inclusive cost and May 2030 delivery schedule.",
    ],
    status: "Under construction",
    area: "5.85 acres · 294 homes",
    possession: "May 2030",
    rera: "PRM/KA/RERA/1251/310/PR/131025/008160",
    featured: true,
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-magnus/",
  },
  {
    name: "SOBHA Galera",
    developer: "SOBHA",
    location: "Kannamangala, Whitefield–Hoskote Road",
    corridor: "East Bengaluru",
    configuration: "4 Bed Duplex & Triplex Row Houses",
    propertyType: "Spanish-themed row houses",
    unitSizes: "3,009–4,340 sq ft",
    price: "₹5.25 Cr onwards*",
    image: "/projects/sobha-galera/hero.webp",
    gallery: [
      "/projects/sobha-galera/hero.webp",
      "/projects/sobha-galera/avenue.webp",
      "/projects/sobha-galera/living.webp",
    ],
    description:
      "An intimate 40-home row-house enclave inspired by Spanish architecture, with terracotta roofs, private courtyards and tree-lined avenues near the Whitefield–Hoskote growth corridor.",
    highlights: [
      "Only 40 duplex and triplex row houses",
      "Private courtyard-led family layouts",
      "Whitefield–Hoskote Road connectivity",
    ],
    amenities: [
      "The Club",
      "Fountain Belleza",
      "Leisure trail",
      "Activity lawn",
      "Children’s play area",
      "Pergolas",
      "Tree-lined avenues",
      "Two-car parking per home",
    ],
    nearby: [
      "Whitefield–Hoskote Road",
      "Kannamangala",
      "East Bengaluru technology corridor",
    ],
    buyerNotes: [
      "Best suited to buyers comparing villas and low-density row-house communities.",
      "Limited inventory can change quickly; confirm the exact duplex or triplex home before visiting.",
    ],
    status: "Ready / active",
    area: "4.08 acres · 40 row houses",
    possession: "December 2026",
    rera: "PRM/KA/RERA/1251/446/PR/050123/005601",
    verifiedAt,
    sourceUrl: "https://www.sobha.com/bengaluru/sobha-galera-near-kannamangala/",
  },
  {
    name: "Prestige Southern Star",
    developer: "Prestige Group",
    location: "Akshayanagar, off Bannerghatta Road",
    corridor: "South Bengaluru",
    configuration: "1, 2, 3, 3.5 & 4.5 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/prestige-southern-star/aerial.webp",
    gallery: [
      "/projects/prestige-southern-star/aerial.webp",
      "/projects/prestige-southern-star/elevation.webp",
      "/projects/prestige-southern-star/amenities.webp",
    ],
    description:
      "A large residential community in South Bengaluru planned around high-rise homes, landscaped open areas and a broad mix of lifestyle amenities near established city neighbourhoods.",
    highlights: [
      "South Bengaluru location",
      "Multiple home configurations",
      "Large landscaped community",
    ],
    status: "New launch",
    rera: "PRM/KA/RERA/1251/310/PR/210325/007603",
    verifiedAt,
    sourceUrl: "https://www.prestigeconstructions.com/residential/prestige-southern-star",
  },
  {
    name: "Prestige Raintree Park",
    developer: "Prestige Group",
    location: "Whitefield–Varthur Road",
    corridor: "East Bengaluru",
    configuration: "3, 4 & 5 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/prestige-raintree-park/hero.jpg",
    gallery: ["/projects/prestige-raintree-park/hero.jpg"],
    description:
      "A large-format luxury township on the Whitefield–Varthur corridor, planned around expansive residences, a major clubhouse and a comprehensive landscape and recreation programme.",
    highlights: [
      "Whitefield–Varthur location",
      "Large township format",
      "Family and luxury configurations",
    ],
    status: "Under construction",
    rera: "PRM/KA/RERA/1251/446/PR/270824/006981",
    verifiedAt,
    sourceUrl: "https://www.prestigeconstructions.com/ads/bangalore/prestige-raintree-park",
  },
  {
    name: "Birla Trimaya – The Bay",
    developer: "Birla Estates",
    location: "Shettigere Main Road, Devanahalli",
    corridor: "North Bengaluru",
    configuration: "1, 2, 3 & 4 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/birla-trimaya/pool.webp",
    gallery: [
      "/projects/birla-trimaya/pool.webp",
      "/projects/birla-trimaya/kids-play.webp",
      "/projects/birla-trimaya/tennis.webp",
    ],
    description:
      "A bay-side phase within the large-format Birla Trimaya community, combining residences, water-led landscaping and recreation in the Devanahalli airport corridor.",
    highlights: [
      "Bay-side phase",
      "Near the airport corridor",
      "Multi-phase 52-acre development",
    ],
    status: "New launch",
    area: "52-acre master development",
    rera: "PRM/KA/RERA/1250/303/PR/290126/008436",
    verifiedAt,
    sourceUrl: "https://www.birlaestates.com/birla-trimaya",
  },
  {
    name: "Mizumi Reserve",
    developer: "Assetz Property Group",
    location: "Off HSR Layout, Hosa Road",
    corridor: "South Bengaluru",
    configuration: "3 & 4 BHK",
    price: "₹2.66 Cr onwards*",
    image: "/projects/assetz-mizumi-reserve/hero.webp",
    gallery: [
      "/projects/assetz-mizumi-reserve/hero.webp",
      "/projects/assetz-mizumi-reserve/gallery-2.webp",
    ],
    description:
      "A lake-facing luxury community off HSR Layout within a larger Hosa Road master plan, pairing generous homes with green views and a contemporary clubhouse experience.",
    highlights: [
      "Lake-facing setting",
      "1901–2476 sq ft homes",
      "Access to HSR and South Bengaluru IT hubs",
    ],
    status: "New launch",
    rera: "PRM/KA/RERA/1251/310/PR/040226/008450",
    verifiedAt,
    sourceUrl: "https://www.assetzproperty.com/mizumireserve/",
  },
  {
    name: "Zen & Sato",
    developer: "Assetz Property Group",
    location: "Yelahanka, Bagalur Main Road",
    corridor: "North Bengaluru",
    configuration: "3 & 4 BHK",
    price: "₹2.92 Cr onwards*",
    image: "/projects/assetz-zen-sato/hero.webp",
    gallery: [
      "/projects/assetz-zen-sato/hero.webp",
      "/projects/assetz-zen-sato/gallery-2.webp",
    ],
    description:
      "A design-led North Bengaluru community with large residences, landscaped open spaces and a calm Japanese-inspired visual language close to Yelahanka and the airport corridor.",
    highlights: [
      "2159–2955 sq ft homes",
      "Yelahanka–Bagalur location",
      "Landscape and wellness-led planning",
    ],
    status: "New launch",
    rera: "PRM/KA/RERA/1251/472/PR/080525/007728",
    verifiedAt,
    sourceUrl: "https://www.assetzproperty.com/zenandsato/",
  },
  {
    name: "Trees & Tandem",
    developer: "Assetz Property Group",
    location: "Off Sarjapur Road",
    corridor: "East Bengaluru",
    configuration: "3 BHK",
    price: "₹2.26 Cr onwards*",
    image: "/projects/assetz-trees-tandem/hero.png",
    gallery: [
      "/projects/assetz-trees-tandem/hero.png",
      "/projects/assetz-trees-tandem/gallery-2.png",
    ],
    description:
      "A premium apartment community off Sarjapur Road conceived around mature landscaping, large three-bedroom homes and access to the eastern technology corridor.",
    highlights: [
      "1885–2142 sq ft homes",
      "Green open-space focus",
      "Sarjapur–ORR catchment",
    ],
    status: "New launch",
    rera: "PRM/KA/RERA/1251/308/PR/280325/007636",
    verifiedAt,
    sourceUrl: "https://www.assetzproperty.com/treesandtandem",
  },
  {
    name: "Sumadhura Folium",
    developer: "Sumadhura Group",
    location: "Whitefield, East Bengaluru",
    corridor: "East Bengaluru",
    configuration: "2, 3 & 4 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/sumadhura-folium/hero.png",
    gallery: [
      "/projects/sumadhura-folium/hero.png",
      "/projects/sumadhura-folium/gallery-2.png",
    ],
    description:
      "A 16.5-acre lakeside community in Whitefield with seven towers, water gardens and a large branded clubhouse; later phases introduce spacious four-bedroom homes.",
    highlights: [
      "Sheelavanthakere Lake setting",
      "120+ lifestyle amenities",
      "Multi-phase Whitefield community",
    ],
    status: "Under construction",
    area: "16.5 acres",
    possession: "Phase-dependent; latest phase Dec 2027",
    rera: "Phases: 004738 / 005393 / 006468 / 008382",
    verifiedAt,
    sourceUrl: "https://sumadhuragroup.com/projects/residential/sumadhura-folium",
  },
  {
    name: "Sumadhura Epitome",
    developer: "Sumadhura Group",
    location: "Rachenahalli, near Manyata Tech Park",
    corridor: "North Bengaluru",
    configuration: "2, 3 & 4 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/sumadhura-epitome/hero.png",
    gallery: [
      "/projects/sumadhura-epitome/hero.png",
      "/projects/sumadhura-epitome/gallery-2.png",
    ],
    description:
      "A low-density Mediterranean-inspired community near Manyata Tech Park where every residence is planned as a corner home with light and ventilation from multiple sides.",
    highlights: [
      "262 corner homes",
      "80% open green area",
      "Five minutes from Manyata Tech Park",
    ],
    status: "Under construction",
    area: "3.75 acres",
    possession: "December 2027",
    rera: "PRM/KA/RERA/1251/446/PR/190924/007044",
    verifiedAt,
    sourceUrl: "https://sumadhuragroup.com/residential/bangalore/sumadhura-epitome",
  },
  {
    name: "Sumadhura Pramoda",
    developer: "Sumadhura Group",
    location: "Kenchenahalli, Rajarajeshwari Nagar",
    corridor: "South Bengaluru",
    configuration: "2, 2.5 & 3 BHK",
    propertyType: "Premium apartments",
    unitSizes: "1,390–2,055 sq ft",
    price: "Contact for developer-approved price",
    image: "/projects/sumadhura-pramoda/pool.png",
    gallery: [
      "/projects/sumadhura-pramoda/pool.png",
      "/projects/sumadhura-pramoda/aerial.png",
      "/projects/sumadhura-pramoda/balcony.png",
    ],
    description:
      "A three-tower, 297-home community facing Bengaluru University’s protected 1,200-acre green campus, with long balconies, a Carnatic-inspired clubhouse and metro access in South-West Bengaluru.",
    highlights: [
      "Views towards 1,200 acres of university greens",
      "22-foot balconies and outward-facing towers",
      "Jnanabharathi Metro approximately 1 km away",
    ],
    amenities: [
      "20,000 sq ft clubhouse",
      "Swimming and splash pools",
      "Tennis and badminton courts",
      "Jogging and cycling tracks",
      "Yoga and fitness studios",
      "Ten curated gardens",
      "Pet park",
      "Children’s play zones",
    ],
    nearby: [
      "Jnanabharathi Metro · 5 min",
      "Bengaluru University · 2 min",
      "Gopalan Mall · 5 min",
      "NICE Ring Road · 10 min",
      "RV College of Engineering · 15 min",
      "Fortis Hospital Nagarbhavi · 15 min",
    ],
    buyerNotes: [
      "A differentiated South-West Bengaluru option for buyers who value green outlooks and metro access.",
      "Compare balcony orientation, university-facing views and the exact 2/2.5/3 BHK carpet-area schedule.",
    ],
    status: "Under construction",
    area: "3.5 acres · 297 homes",
    possession: "December 2028",
    rera: "PRM/KA/RERA/1251/310/PR/250325/007625",
    featured: true,
    verifiedAt,
    sourceUrl: "https://sumadhuragroup.com/residential/bangalore/sumadhura-pramoda",
  },
  {
    name: "Sumadhura Sarang",
    developer: "Sumadhura Group",
    location: "Doddabanahalli, Whitefield",
    corridor: "East Bengaluru",
    configuration: "3 & 4 BHK",
    propertyType: "Biophilic apartments",
    unitSizes: "1,740–2,580 sq ft",
    price: "Contact for developer-approved price",
    image: "/projects/sumadhura-sarang/hero.png",
    gallery: [
      "/projects/sumadhura-sarang/hero.png",
      "/projects/sumadhura-sarang/view.png",
      "/projects/sumadhura-sarang/club.png",
    ],
    description:
      "A low-density biophilic community beside the Atal Bihari Vajpayee Botanical Garden, planned for 270-degree openness, no shared walls and panoramic views from large homes.",
    highlights: [
      "No common walls between homes",
      "33,000 sq ft clubhouse with 60+ amenities",
      "78% open green within 4.65 acres",
    ],
    amenities: [
      "Swimming pool",
      "Cricket pitch",
      "Tennis and basketball courts",
      "Skating rink",
      "Amphitheatre",
      "Barbecue deck",
      "Butterfly garden",
      "Pet park",
    ],
    nearby: [
      "Atal Bihari Vajpayee Botanical Garden · 1 min",
      "Cipla · 3 min",
      "ITPB · 15 min",
      "Park Square Mall · 9 min",
      "Whitefield employment hub",
    ],
    buyerNotes: [
      "Shortlist this for privacy, airflow and a lower-density Whitefield lifestyle.",
      "The project has phase-specific RERA and possession dates; match the quoted home to the correct phase.",
    ],
    status: "Under construction",
    area: "4.65 acres · 78% open green",
    possession: "Phase 1 Dec 2026 · Phase 2 Jun 2027",
    rera: "Phase 1: 006075 · Phase 2: 007481",
    verifiedAt,
    sourceUrl: "https://sumadhuragroup.com/residential/bangalore/sumadhura-sarang",
  },
  {
    name: "Sumadhura Solea",
    developer: "Sumadhura Group",
    location: "Behind Manyata Tech Park, Thanisandra",
    corridor: "North Bengaluru",
    configuration: "3 & 4 BHK",
    propertyType: "Mediterranean-inspired apartments",
    price: "Contact for developer-approved price",
    image: "/projects/sumadhura-solea/hero.png",
    gallery: ["/projects/sumadhura-solea/hero.png"],
    description:
      "A Mediterranean-inspired North Bengaluru enclave behind Manyata Tech Park, pairing warm facades and coastal design cues with large family residences and a commute-efficient address.",
    highlights: [
      "Behind Manyata Tech Park",
      "Mediterranean-inspired architecture",
      "Large 3 and 4 BHK family homes",
    ],
    amenities: [
      "Clubhouse",
      "Landscaped courts",
      "Swimming pool",
      "Fitness spaces",
      "Children’s recreation",
      "Community gathering zones",
    ],
    nearby: [
      "Manyata Tech Park",
      "Thanisandra Main Road",
      "Hebbal and airport corridor",
    ],
    buyerNotes: [
      "A practical North Bengaluru shortlist for households working around Manyata and Hebbal.",
      "This is a newly disclosed project; request the current cost sheet, area schedule and tower launch status.",
    ],
    status: "New launch",
    possession: "December 2029",
    rera: "PRM/KA/RERA/1251/446/PR/100326/008517",
    verifiedAt,
    sourceUrl: "https://sumadhuragroup.com/projects",
  },
  {
    name: "Brigade Sanctuary",
    developer: "Brigade Group",
    location: "Whitefield–Sarjapur Road",
    corridor: "East Bengaluru",
    configuration: "1, 3 & 4 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/brigade-sanctuary/hero.webp",
    gallery: ["/projects/brigade-sanctuary/hero.webp"],
    description:
      "A nature-forward residential community connecting Whitefield and Sarjapur, retaining mature trees while combining apartments, open landscapes and a substantial clubhouse.",
    highlights: [
      "14-acre community",
      "80% open spaces",
      "35+ recreation and wellness amenities",
    ],
    status: "Under construction",
    possession: "December 2028",
    rera: "PRM/KA/RERA/1251/446/PR/041123/006372",
    verifiedAt,
    sourceUrl: "https://www.brigadegroup.com/residential/projects/bengaluru/brigade-sanctuary",
  },
  {
    name: "Dioro at Brigade El Dorado",
    developer: "Brigade Group",
    location: "KIADB Aerospace Park",
    corridor: "North Bengaluru",
    configuration: "2 & 3 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/brigade-el-dorado/aerial-day.webp",
    gallery: [
      "/projects/brigade-el-dorado/aerial-day.webp",
      "/projects/brigade-el-dorado/infinity-pool.webp",
      "/projects/brigade-el-dorado/central-amenities.webp",
    ],
    description:
      "A phase within Brigade El Dorado, a major North Bengaluru township with contemporary residences, expansive green spaces and a diverse recreation ecosystem.",
    highlights: [
      "KIADB Aerospace Park",
      "Part of a 50-acre township",
      "Pools, sports and central amenities",
    ],
    status: "New launch",
    area: "Part of a 50-acre township",
    verifiedAt,
    sourceUrl: "https://www.brigadegroup.com/residential/projects/bengaluru/brigade-el-dorado",
  },
  {
    name: "Lodha Mirabelle",
    developer: "Lodha",
    location: "Manyata Business Park, Nagavara",
    corridor: "North Bengaluru",
    configuration: "3 & 4 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/lodha-mirabelle/hero.jpg",
    gallery: [
      "/projects/lodha-mirabelle/hero.jpg",
      "/projects/lodha-mirabelle/gallery-2.jpg",
    ],
    description:
      "A luxury residential address beside Manyata Business Park, designed around large family homes, landscaped amenities and a commute-efficient North Bengaluru location.",
    highlights: [
      "Adjacent to Manyata Business Park",
      "Large-format residences",
      "Premium clubhouse and sports programme",
    ],
    status: "Under construction",
    rera: "PRM/KA/RERA/1251/309/PR/131023/006321; phase 2: 007688",
    verifiedAt,
    sourceUrl: "https://www.lodhagroup.com/projects/residential-property-in-bangalore/lodha-mirabelle",
  },
  {
    name: "Lodha Elanza",
    developer: "Lodha",
    location: "Yamare, Sarjapur Road",
    corridor: "East Bengaluru",
    configuration: "3 BHK & 3 BHK + Study",
    price: "Contact for developer-approved price",
    image: "/projects/lodha-elanza/hero.jpg",
    gallery: [
      "/projects/lodha-elanza/hero.jpg",
      "/projects/lodha-elanza/gallery-2.jpg",
    ],
    description:
      "A premium Sarjapur Road community with lake and green views, expansive decks and a landscape programme extending everyday living beyond the home.",
    highlights: [
      "Yamare Lake outlook",
      "Large decks and family layouts",
      "Sarjapur growth corridor",
    ],
    status: "Under construction",
    verifiedAt,
    sourceUrl: "https://www.lodhagroup.com/projects/residential-property-in-bangalore/lodha-elanza-sarjapur-road",
  },
  {
    name: "Barca at Godrej MSR City",
    developer: "Godrej Properties",
    location: "Devanahalli",
    corridor: "North Bengaluru",
    configuration: "3 BHK",
    price: "₹1.79 Cr onwards*",
    image: "/projects/godrej-msr-city/exterior.webp",
    gallery: [
      "/projects/godrej-msr-city/exterior.webp",
      "/projects/godrej-msr-city/gallery-1.webp",
      "/projects/godrej-msr-city/gallery-2.webp",
    ],
    description:
      "A Mediterranean-inspired phase within Godrej MSR City, designed around sunlit homes, landscaped promenades and a broad township amenity network in North Bengaluru.",
    highlights: [
      "Mediterranean-inspired design",
      "Airport-side growth corridor",
      "Large township amenity network",
    ],
    status: "New launch",
    possession: "March 2030",
    rera: "PRM/KA/RERA/1250/303/PR/010425/007644",
    verifiedAt,
    sourceUrl: "https://www.godrejproperties.com/bangalore/residential/godrej-msr-city",
  },
  {
    name: "Godrej Aveline",
    developer: "Godrej Properties",
    location: "Yelahanka",
    corridor: "North Bengaluru",
    configuration: "3, 3.5 & 4.5 BHK",
    price: "₹2.90 Cr onwards*",
    image: "/projects/godrej-aveline/exterior.webp",
    gallery: ["/projects/godrej-aveline/exterior.webp"],
    description:
      "A premium North Bengaluru address shaped by Dutch-inspired design, generous family-sized homes, sunlit interiors and landscaped outdoor spaces in established Yelahanka.",
    highlights: [
      "Dutch-inspired architecture",
      "Large-format family residences",
      "Yelahanka airport-road corridor",
    ],
    status: "Under construction",
    possession: "March 2031",
    verifiedAt,
    sourceUrl: "https://www.godrejproperties.com/bengaluru/residential/godrej-aveline",
  },
  {
    name: "Godrej Parkshire",
    developer: "Godrej Properties",
    location: "Whitefield–Hoskote",
    corridor: "East Bengaluru",
    configuration: "2 & 3 BHK",
    price: "₹1.18 Cr onwards*",
    image: "/projects/godrej-parkshire/exterior.webp",
    gallery: ["/projects/godrej-parkshire/exterior.webp"],
    description:
      "A nature-led residential community near the Whitefield–Hoskote growth belt, offering contemporary homes, generous balconies and access to East Bengaluru employment hubs.",
    highlights: [
      "Nature-inspired community",
      "Whitefield connectivity",
      "Premium and luxe home layouts",
    ],
    status: "Under construction",
    possession: "December 2030",
    rera: "PRM/KA/RERA/1250/304/PR/090126/008393",
    verifiedAt,
    sourceUrl: "https://www.godrejproperties.com/landing-page/bangalore/residential/godrej-parkshire/",
  },
  {
    name: "Godrej Lakeside Orchard",
    developer: "Godrej Properties",
    location: "Kodathi, off Sarjapur Road",
    corridor: "East Bengaluru",
    configuration: "3 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/godrej-lakeside-orchard/hero.jpg",
    gallery: ["/projects/godrej-lakeside-orchard/hero.jpg"],
    description:
      "A lake-adjacent residential community in Kodathi within the Sarjapur–Varthur catchment, planned for family living with landscaped amenities and access to eastern employment hubs.",
    highlights: [
      "Kodathi–Sarjapur location",
      "Lake-side landscape setting",
      "Multiple three-bedroom layouts",
    ],
    status: "Under construction",
    rera: "PRM/KA/RERA/1251/446/PR/300924/007105",
    verifiedAt,
    sourceUrl: "https://www.godrejproperties.com/the-1-percent-plan/projects/godrej-lakeside-orchard/",
  },
  {
    name: "Godrej Woods",
    developer: "Godrej Properties",
    location: "Kogilu, Thanisandra–Yelahanka",
    corridor: "North Bengaluru",
    configuration: "2 & 3 BHK",
    propertyType: "Forest-inspired apartments",
    price: "Contact for developer-approved price",
    image: "/projects/godrej-woods/hero.webp",
    gallery: [
      "/projects/godrej-woods/hero.webp",
      "/projects/godrej-woods/greens.webp",
      "/projects/godrej-woods/amenity.webp",
    ],
    description:
      "A forest-inspired community in Kogilu with 18,000 sq ft of central greens, expansive balconies, landscaped gardens and a large clubhouse in the Thanisandra–Yelahanka corridor.",
    highlights: [
      "18,000 sq ft of central greens",
      "Expansive balcony-led residences",
      "Thanisandra, Yelahanka and airport access",
    ],
    amenities: [
      "Grand clubhouse",
      "Swimming pool",
      "Landscaped gardens",
      "Jogging tracks",
      "Sports courts",
      "Yoga spaces",
      "Indoor games",
      "Children’s play areas",
    ],
    nearby: [
      "Thanisandra",
      "Yelahanka",
      "Manyata Tech Park",
      "Kempegowda International Airport corridor",
    ],
    buyerNotes: [
      "A recent North Bengaluru launch for buyers comparing nature-led developments near Manyata and Yelahanka.",
      "Confirm the payment plan eligibility, apartment stack and all-inclusive cost before reservation.",
    ],
    status: "New launch",
    rera: "PRM/KA/RERA/1251/472/PR/121125/008248",
    featured: true,
    verifiedAt,
    sourceUrl: "https://www.godrejproperties.com/landing-page/bangalore/residential/godrej-woods/",
  },
  {
    name: "Godrej Woodscapes",
    developer: "Godrej Properties",
    location: "Budigere Cross, near Whitefield",
    corridor: "East Bengaluru",
    configuration: "4 BHK",
    propertyType: "Premium green residences",
    price: "₹4.10 Cr onwards*",
    image: "/projects/godrej-woodscapes/hero.jpg",
    gallery: [
      "/projects/godrej-woodscapes/hero.jpg",
      "/projects/godrej-woodscapes/overview.webp",
    ],
    description:
      "A green-led residential community at Budigere Cross in the Whitefield technology corridor, combining large four-bedroom homes, woodland landscaping and an extensive wellness and recreation programme.",
    highlights: [
      "Whitefield–Budigere Cross location",
      "Woodland and water-led landscape zones",
      "Large four-bedroom residences",
    ],
    amenities: [
      "Temperature-controlled pool",
      "Gym and fit-play arena",
      "Futsal court",
      "Party lawn",
      "Barbecue deck",
      "Health café",
      "Water play court",
      "Woodland grove",
    ],
    nearby: [
      "Whitefield · approximately 12 km",
      "Old Madras Road",
      "ITPL and EPIP Zone",
      "Budigere Cross growth corridor",
    ],
    buyerNotes: [
      "Consider this when comparing large-format East Bengaluru homes with stronger green-space positioning.",
      "Two RERA registrations apply; map the selected tower and possession to the correct phase.",
    ],
    status: "Under construction",
    possession: "January 2029",
    rera: "PRM/KA/RERA/1251/446/PR/170524/006882 · 006888",
    verifiedAt,
    sourceUrl: "https://www.godrejproperties.com/bengaluru/residential/godrej-woodscapes",
  },
  {
    name: "Bhartiya Garden Estate",
    developer: "Bhartiya Urban",
    location: "Bhartiya City, Thanisandra Main Road",
    corridor: "North Bengaluru",
    configuration: "Apartments in a multi-phase township",
    price: "Contact for developer-approved price",
    image: "/projects/bhartiya-garden-estate/hero.jpg",
    gallery: [
      "/projects/bhartiya-garden-estate/hero.jpg",
      "/projects/bhartiya-garden-estate/gallery-2.jpg",
    ],
    description:
      "A new multi-phase residential addition to the Bhartiya City ecosystem, bringing contemporary homes into an established integrated district with retail, workspaces and social infrastructure.",
    highlights: [
      "Integrated Bhartiya City setting",
      "Construction updates published monthly",
      "Thanisandra–Manyata catchment",
    ],
    status: "New launch",
    rera: "Phases: PR/260825/008038; PR/060925/008064; PR/060925/008065",
    verifiedAt,
    sourceUrl: "https://nikoohomes.com/construction-progress-bhartiya-garden-estate/",
  },
];
