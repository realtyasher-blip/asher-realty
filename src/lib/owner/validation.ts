import {
  ownerContactModes,
  ownerListingStatuses,
  ownerRoles,
  type OwnerListingInput,
  type OwnerListingStatus,
  type OwnerProfileInput,
} from "@/lib/owner/types";
import {
  normalizePublicPhone,
  sanitizePublicMultiline,
  sanitizePublicSingleLine,
} from "@/lib/listings/safety";

const intents = ["Sell", "Rent out"] as const;
const preferredContacts = [
  "Phone or WhatsApp",
  "Phone call",
  "WhatsApp",
  "Email",
] as const;

function selected<T extends string>(value: unknown, values: readonly T[]) {
  const candidate = sanitizePublicSingleLine(value, 80) as T;
  return values.includes(candidate) ? candidate : null;
}

function optionalLine(value: unknown, max: number) {
  return sanitizePublicSingleLine(value, max);
}

function wholeNumber(value: unknown, min: number, max: number) {
  const candidate = optionalLine(value, 4);
  if (!candidate) return "";
  if (!/^\d{1,3}$/u.test(candidate)) return null;
  const parsed = Number(candidate);
  return parsed >= min && parsed <= max ? candidate : null;
}

function validDate(value: string) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    year >= 2000 &&
    year <= 2100 &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function moneyValue(value: unknown, max: number, allowIncluded = false) {
  const display = optionalLine(value, 80);
  const raw = display.toLowerCase().replaceAll(",", "");
  if (!raw) return "";
  if (allowIncluded && /\bincluded\b/u.test(raw)) return display;
  const match = raw.match(/\d+(?:\.\d+)?/u);
  if (!match) return null;
  let amount = Number(match[0]);
  if (/\bcrore\b|\bcr\b/u.test(raw)) amount *= 10_000_000;
  else if (/\blakh\b|\blac\b|\bl\b/u.test(raw)) amount *= 100_000;
  else if (/\bthousand\b|\bk\b/u.test(raw)) amount *= 1_000;
  if (!Number.isFinite(amount) || amount <= 0 || amount > max) return null;
  return display;
}

export function parseOwnerProfile(value: unknown): OwnerProfileInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const displayName = optionalLine(data.display_name, 80);
  const role = selected(data.role, ownerRoles);
  const preferredContact = selected(data.preferred_contact, preferredContacts);
  const contactMode = selected(data.contact_mode, ownerContactModes);
  const phoneRaw = optionalLine(data.contact_phone, 24);
  const contactPhone = phoneRaw ? normalizePublicPhone(phoneRaw) : "";

  if (
    displayName.length < 2 ||
    !role ||
    !preferredContact ||
    !contactMode ||
    (phoneRaw && !contactPhone)
  ) {
    return null;
  }

  const showName = data.show_name === true;
  const showEmail = data.show_email === true;
  const showPhone = data.show_phone === true;
  if (showPhone && !contactPhone) return null;

  const isPublic = data.is_public === true;

  const expectedMode = showPhone
    ? "name_phone"
    : showEmail
      ? "name_email"
      : showName
        ? "name_only"
        : "asher_managed";
  if (contactMode !== expectedMode) return null;

  return {
    display_name: displayName,
    contact_phone: contactPhone || null,
    role,
    bio: sanitizePublicMultiline(data.bio, 500),
    preferred_contact: preferredContact,
    is_public: isPublic,
    show_name: showName,
    show_email: showEmail,
    show_phone: showPhone,
    contact_mode: contactMode,
  };
}

export function parseOwnerListing(value: unknown): OwnerListingInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const intent = selected(data.intent, intents);
  const propertyType = optionalLine(data.property_type, 80);
  const projectName = optionalLine(data.project_name, 140);
  const locality = optionalLine(data.locality, 120);
  const pincode = optionalLine(data.pincode, 6);
  const configuration = optionalLine(data.configuration, 80);
  const areaValue = optionalLine(data.area_value, 20);
  const areaBasis = optionalLine(data.area_basis, 80);
  const floor = wholeNumber(data.floor, 0, 250);
  const totalFloors = wholeNumber(data.total_floors, 1, 300);
  const availableFrom = optionalLine(data.available_from, 10);

  if (
    !intent ||
    propertyType.length < 2 ||
    locality.length < 2 ||
    !configuration ||
    !/^\d{1,7}(?:\.\d{1,2})?$/u.test(areaValue) ||
    Number(areaValue) < 20 ||
    Number(areaValue) > 10_000_000 ||
    !areaBasis ||
    floor === null ||
    totalFloors === null ||
    (floor && totalFloors && Number(floor) > Number(totalFloors)) ||
    (pincode && !/^[1-9]\d{5}$/u.test(pincode)) ||
    !validDate(availableFrom)
  ) {
    return null;
  }

  const expectedPrice = moneyValue(data.expected_price, 99_999_999_999_999);
  const monthlyRent = moneyValue(data.monthly_rent, 999_999_999_999);
  const maintenance = moneyValue(data.maintenance, 999_999_999_999, true);
  const deposit = moneyValue(data.deposit, 999_999_999_999);
  if (
    expectedPrice === null ||
    monthlyRent === null ||
    maintenance === null ||
    deposit === null ||
    (intent === "Sell" && !expectedPrice) ||
    (intent === "Rent out" && !monthlyRent)
  ) return null;

  return {
    intent,
    property_type: propertyType,
    project_name: projectName,
    locality,
    pincode,
    configuration,
    bathrooms: optionalLine(data.bathrooms, 20),
    area_value: areaValue,
    area_basis: areaBasis,
    furnishing: optionalLine(data.furnishing, 80),
    floor: floor || "",
    total_floors: totalFloors || "",
    parking: optionalLine(data.parking, 80),
    property_age: optionalLine(data.property_age, 80),
    expected_price: intent === "Sell" ? expectedPrice : "",
    monthly_rent: intent === "Rent out" ? monthlyRent : "",
    maintenance: intent === "Rent out" ? maintenance : "",
    deposit: intent === "Rent out" ? deposit : "",
    available_from: availableFrom,
    occupancy: optionalLine(data.occupancy, 80),
    description: sanitizePublicMultiline(data.description, 2_000),
  };
}

export function listingReadyForSubmission(input: OwnerListingInput) {
  return Boolean(
    input.project_name &&
      input.description.length >= 30 &&
      (input.intent === "Sell" ? input.expected_price : input.monthly_rent)
  );
}

export function ownerMayEditStatus(status: OwnerListingStatus) {
  return (["draft", "changes_requested"] as OwnerListingStatus[]).includes(status);
}

export function ownerMayArchiveStatus(status: OwnerListingStatus) {
  return ownerListingStatuses.includes(status) && status !== "archived";
}

export function parsePhotoMetadata(value: Record<string, unknown>) {
  return {
    label: optionalLine(value.label, 80),
    alt_text: optionalLine(value.alt_text, 180),
  };
}

export function parsePhotoOrder(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.photos) || data.photos.length > 12) return null;
  const photos = data.photos.map((item, index) => {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;
    const id = optionalLine(record.id, 64);
    const sortOrder = Number(record.sort_order ?? index);
    if (!/^[a-f0-9-]{20,64}$/iu.test(id) || !Number.isInteger(sortOrder)) return null;
    return { id, sort_order: Math.max(0, Math.min(11, sortOrder)), is_cover: record.is_cover === true };
  });
  if (photos.some((photo) => !photo)) return null;
  const typed = photos as Array<{ id: string; sort_order: number; is_cover: boolean }>;
  if (new Set(typed.map((photo) => photo.id)).size !== typed.length) return null;
  if (typed.filter((photo) => photo.is_cover).length > 1) return null;
  return typed;
}
