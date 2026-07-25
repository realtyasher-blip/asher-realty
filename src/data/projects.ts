export type Project = {
  name: string;
  developer: string;
  location: string;
  configuration: string;
  price: string;
  image: string;
  status: "New launch" | "New phase" | "Ongoing";
  area?: string;
  possession?: string;
  rera?: string;
  featured?: boolean;
  officialUrl: string;
  mediaUrl?: string;
  verifiedAt: string;
};

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
    image: "/images/sobha-oneworld.jpg",
    status: "New launch",
    possession: "Phased delivery; verify current tower",
    featured: true,
    officialUrl:
      "https://www.sobha.com/bengaluru/sobha-oneworld-greater-whitefield/",
    mediaUrl:
      "https://www.sobha.com/bengaluru/sobha-oneworld-greater-whitefield/",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Prestige Southern Star",
    developer: "Prestige Group",
    location: "Akshayanagar, off Bannerghatta Road",
    configuration: "1, 2, 3, 3.5 & 4.5 BHK",
    price: "Contact for developer-approved price",
    image: "/images/prestige-southern-star.jpg",
    status: "New launch",
    rera: "PRM/KA/RERA/1251/310/PR/210325/007603",
    officialUrl: "https://www.prestigeconstructions.com/",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Birla Trimaya – The Bay",
    developer: "Birla Estates",
    location: "Shettigere Main Road, Devanahalli",
    configuration: "1, 2, 3 & 4 BHK",
    price: "Contact for developer-approved price",
    image: "/images/birla-trimaya.jpg",
    status: "New phase",
    area: "52-acre master development",
    rera: "PRM/KA/RERA/1250/303/PR/290126/008436",
    officialUrl:
      "https://www.birlaestates.com/birla-trimaya-devanahalli/index.aspx",
    mediaUrl:
      "https://www.birlaestates.com/birla-trimaya-devanahalli/index.aspx",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Dioro at Brigade El Dorado",
    developer: "Brigade Group",
    location: "KIADB Aerospace Park, North Bengaluru",
    configuration: "2 & 3 BHK",
    price: "Contact for developer-approved price",
    image: "/images/brigade-eldorado.jpg",
    status: "New phase",
    area: "Part of a 50-acre township",
    officialUrl:
      "https://www.brigadegroup.com/residential/projects/bangalore/brigade-el-dorado",
    verifiedAt: "26 Jul 2026",
  },
  {
    name: "Barca at Godrej MSR City",
    developer: "Godrej Properties",
    location: "Devanahalli, North Bengaluru",
    configuration: "3 BHK",
    price: "₹1.79 Cr onwards*",
    image: "/images/godrej-msr-city.jpg",
    status: "New launch",
    possession: "March 2030",
    rera: "PRM/KA/RERA/1250/303/PR/010425/007644",
    officialUrl:
      "https://www.godrejproperties.com/bengaluru/residential/barca-at-godrej-msr-city",
    mediaUrl:
      "https://www.godrejproperties.com/bengaluru/residential/godrej-msr-city/gallery",
    verifiedAt: "26 Jul 2026",
  },
];
