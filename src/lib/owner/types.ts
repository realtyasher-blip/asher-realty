export const ownerRoles = [
  "Owner",
  "Power of attorney holder",
  "Authorised representative",
] as const;

export type OwnerRole = (typeof ownerRoles)[number];

export const ownerContactModes = [
  "asher_managed",
  "name_only",
  "name_email",
  "name_phone",
] as const;

export type OwnerContactMode = (typeof ownerContactModes)[number];

export type OwnerProfile = {
  id: string;
  display_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  role: OwnerRole;
  bio: string;
  preferred_contact: "Phone or WhatsApp" | "Phone call" | "WhatsApp" | "Email";
  is_public: boolean;
  show_name: boolean;
  show_email: boolean;
  show_phone: boolean;
  contact_mode: OwnerContactMode;
  created_at: string;
  updated_at: string;
};

export type OwnerProfileInput = Pick<
  OwnerProfile,
  | "display_name"
  | "contact_phone"
  | "role"
  | "bio"
  | "preferred_contact"
  | "is_public"
  | "show_name"
  | "show_email"
  | "show_phone"
  | "contact_mode"
>;

export const ownerListingStatuses = [
  "draft",
  "submitted",
  "in_review",
  "changes_requested",
  "approved",
  "published",
  "paused",
  "rejected",
  "archived",
] as const;

export type OwnerListingStatus = (typeof ownerListingStatuses)[number];

export type OwnerListing = {
  id: string;
  owner_id: string;
  intent: "Sell" | "Rent out";
  property_type: string;
  project_name: string;
  locality: string;
  pincode: string;
  configuration: string;
  bathrooms: string;
  area_value: string;
  area_basis: string;
  furnishing: string;
  floor: string;
  total_floors: string;
  parking: string;
  property_age: string;
  expected_price: string;
  monthly_rent: string;
  maintenance: string;
  deposit: string;
  available_from: string;
  occupancy: string;
  description: string;
  status: OwnerListingStatus;
  review_note: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  photos?: ListingPhoto[];
};

export type OwnerListingInput = Pick<
  OwnerListing,
  | "intent"
  | "property_type"
  | "project_name"
  | "locality"
  | "pincode"
  | "configuration"
  | "bathrooms"
  | "area_value"
  | "area_basis"
  | "furnishing"
  | "floor"
  | "total_floors"
  | "parking"
  | "property_age"
  | "expected_price"
  | "monthly_rent"
  | "maintenance"
  | "deposit"
  | "available_from"
  | "occupancy"
  | "description"
>;

export type ListingPhotoStatus = "pending" | "approved" | "rejected";

export type ListingPhoto = {
  id: string;
  listing_id: string;
  owner_id: string;
  storage_path: string;
  preview_url?: string | null;
  label: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
  status: ListingPhotoStatus;
  rejection_reason: string | null;
  created_at: string;
};

export type AccountPayload = {
  user: { id: string; email: string | null };
  profile: OwnerProfile | null;
  listings: OwnerListing[];
  setupRequired?: boolean;
};

export const emptyOwnerListing: OwnerListingInput = {
  intent: "Sell",
  property_type: "Apartment",
  project_name: "",
  locality: "",
  pincode: "",
  configuration: "",
  bathrooms: "",
  area_value: "",
  area_basis: "Carpet area",
  furnishing: "",
  floor: "",
  total_floors: "",
  parking: "",
  property_age: "",
  expected_price: "",
  monthly_rent: "",
  maintenance: "",
  deposit: "",
  available_from: "",
  occupancy: "",
  description: "",
};
