export const propertyIntents = ["Sell", "Rent out"] as const;
export type PropertyIntent = (typeof propertyIntents)[number];

export const propertyOwnerRoles = [
  "Owner",
  "Power of attorney holder",
  "Authorised representative",
] as const;
export type PropertyOwnerRole = (typeof propertyOwnerRoles)[number];

export const propertyTypes = [
  "Apartment",
  "Villa",
  "Independent house",
  "Residential plot",
  "Commercial property",
] as const;

export const propertyConfigurations = [
  "Studio",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5+ BHK",
  "Plot / open space",
  "Commercial unit",
] as const;

export const propertyBathroomOptions = ["1", "2", "3", "4+"] as const;
export const propertyAreaBases = [
  "Carpet area",
  "Built-up area",
  "Super built-up area",
  "Plot area",
] as const;
export const propertyFurnishingOptions = [
  "Unfurnished",
  "Semi-furnished",
  "Fully furnished",
] as const;
export const propertyParkingOptions = [
  "No dedicated parking",
  "1 car",
  "2 cars",
  "3+ cars",
] as const;
export const propertyAgeOptions = [
  "Under construction",
  "Less than 1 year",
  "1–5 years",
  "5–10 years",
  "More than 10 years",
] as const;
export const propertyOccupancyOptions = [
  "Vacant",
  "Owner occupied",
  "Tenant occupied",
  "Under construction",
] as const;
export const propertyContactPreferences = [
  "Phone or WhatsApp",
  "Phone call",
  "WhatsApp",
  "Email",
] as const;

export type PropertySubmissionInput = {
  intent: PropertyIntent;
  ownerRole: PropertyOwnerRole;
  propertyType: (typeof propertyTypes)[number];
  projectName: string;
  locality: string;
  pincode: string;
  configuration: (typeof propertyConfigurations)[number];
  bathrooms: "" | (typeof propertyBathroomOptions)[number];
  areaValue: string;
  areaBasis: (typeof propertyAreaBases)[number];
  furnishing: "" | (typeof propertyFurnishingOptions)[number];
  floor: string;
  totalFloors: string;
  parking: "" | (typeof propertyParkingOptions)[number];
  propertyAge: "" | (typeof propertyAgeOptions)[number];
  expectedPrice: string;
  monthlyRent: string;
  maintenance: string;
  deposit: string;
  availableFrom: string;
  occupancy: "" | (typeof propertyOccupancyOptions)[number];
  description: string;
  name: string;
  phone: string;
  email: string | null;
  contactPreference: (typeof propertyContactPreferences)[number];
  authorityDeclaration: boolean;
  accuracyDeclaration: boolean;
  contactConsent: boolean;
};
