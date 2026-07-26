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
  price: string;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  video?: string;
  status: ProjectStatus;
  area?: string;
  possession?: string;
  rera?: string;
  featured?: boolean;
  verifiedAt: string;
  sourceUrl: string;
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

const verifiedAt = "26 Jul 2026";

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
