export type Project = {
  name: string;
  developer: string;
  location: string;
  configuration: string;
  price: string;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  video?: string;
  status: "New launch" | "New phase" | "Ongoing";
  area?: string;
  possession?: string;
  rera?: string;
  featured?: boolean;
  verifiedAt: string;
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

/**
 * Buyer-facing project facts verified against developer-owned pages or
 * developer-issued disclosures. Prices and inventory remain enquiry-led
 * because builders do not expose stable public availability APIs.
 */
export const projects: Project[] = [
  {
    name: "SOBHA OneWorld",
    developer: "SOBHA",
    location: "Greater Whitefield, Old Madras Road",
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
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Prestige Southern Star",
    developer: "Prestige Group",
    location: "Akshayanagar, off Bannerghatta Road",
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
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Birla Trimaya – The Bay",
    developer: "Birla Estates",
    location: "Shettigere Main Road, Devanahalli",
    configuration: "1, 2, 3 & 4 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/birla-trimaya/pool.webp",
    gallery: [
      "/projects/birla-trimaya/pool.webp",
      "/projects/birla-trimaya/kids-play.webp",
      "/projects/birla-trimaya/tennis.webp",
    ],
    description:
      "Phase 4 of Birla Trimaya adds bay-side living to a large-format Devanahalli community, combining residences, water-led landscaping and recreation within a long-term master plan.",
    highlights: [
      "Bay-side phase",
      "Near the airport corridor",
      "Multi-phase 52-acre development",
    ],
    status: "New phase",
    area: "52-acre master development",
    rera: "PRM/KA/RERA/1250/303/PR/290126/008436",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Dioro at Brigade El Dorado",
    developer: "Brigade Group",
    location: "KIADB Aerospace Park, North Bengaluru",
    configuration: "2 & 3 BHK",
    price: "Contact for developer-approved price",
    image: "/projects/brigade-el-dorado/aerial-day.webp",
    gallery: [
      "/projects/brigade-el-dorado/aerial-day.webp",
      "/projects/brigade-el-dorado/infinity-pool.webp",
      "/projects/brigade-el-dorado/central-amenities.webp",
    ],
    description:
      "Dioro forms part of Brigade El Dorado, a major North Bengaluru township with contemporary residences, expansive green spaces and a diverse recreation ecosystem.",
    highlights: [
      "KIADB Aerospace Park",
      "Part of a 50-acre township",
      "Pools, sports and central amenities",
    ],
    status: "New phase",
    area: "Part of a 50-acre township",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Barca at Godrej MSR City",
    developer: "Godrej Properties",
    location: "Devanahalli, North Bengaluru",
    configuration: "3 BHK",
    price: "₹1.79 Cr onwards*",
    image: "/projects/godrej-msr-city/exterior.webp",
    gallery: [
      "/projects/godrej-msr-city/exterior.webp",
      "/projects/godrej-msr-city/gallery-1.webp",
      "/projects/godrej-msr-city/gallery-2.webp",
    ],
    description:
      "A Mediterranean-inspired phase within the wider Godrej MSR City township, designed around sunlit homes, landscaped promenades and a comprehensive amenity network in North Bengaluru.",
    highlights: [
      "Mediterranean-inspired design",
      "Airport-side growth corridor",
      "Large township amenity network",
    ],
    status: "New launch",
    possession: "March 2030",
    rera: "PRM/KA/RERA/1250/303/PR/010425/007644",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Godrej Aveline",
    developer: "Godrej Properties",
    location: "Yelahanka, North Bengaluru",
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
    status: "Ongoing",
    possession: "March 2031",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Godrej Parkshire",
    developer: "Godrej Properties",
    location: "Whitefield–Hoskote, East Bengaluru",
    configuration: "2 & 3 BHK",
    price: "₹1.18 Cr onwards*",
    image: "/projects/godrej-parkshire/exterior.webp",
    gallery: ["/projects/godrej-parkshire/exterior.webp"],
    description:
      "A nature-led residential community near the Whitefield–Hoskote growth belt, offering contemporary homes, generous balconies, green open spaces and access to East Bengaluru employment hubs.",
    highlights: [
      "Nature-inspired community",
      "Whitefield connectivity",
      "Premium and luxe home layouts",
    ],
    status: "Ongoing",
    possession: "December 2030",
    rera: "PRM/KA/RERA/1250/304/PR/090126/008393",
    verifiedAt: "26 Jul 2026",
  },
];
