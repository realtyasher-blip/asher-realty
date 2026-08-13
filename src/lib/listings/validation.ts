import type { PropertySubmissionInput } from "@/lib/listings/types";

function text(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function selected<T extends string>(value: unknown, options: readonly T[]) {
  const candidate = text(value, 80) as T;
  return options.includes(candidate) ? candidate : null;
}

export function parsePropertySubmission(
  value: unknown
): PropertySubmissionInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (text(data.website, 20)) return null;

  const intent = selected(data.intent, ["Sell", "Rent out"] as const);
  const ownerRole = selected(data.ownerRole, [
    "Owner",
    "Power of attorney holder",
    "Authorised representative",
  ] as const);
  const name = text(data.name, 80);
  const phone = text(data.phone, 20);
  const digits = phone.replace(/\D/g, "");
  const propertyType = text(data.propertyType, 60);
  const locality = text(data.locality, 120);
  const configuration = text(data.configuration, 60);
  const areaValue = text(data.areaValue, 20);
  const commercial =
    intent === "Sell"
      ? text(data.expectedPrice, 80)
      : text(data.monthlyRent, 80);

  if (
    !intent ||
    !ownerRole ||
    name.length < 2 ||
    digits.length < 8 ||
    digits.length > 15 ||
    propertyType.length < 2 ||
    locality.length < 2 ||
    configuration.length < 1 ||
    !/^\d{2,7}(?:\.\d{1,2})?$/.test(areaValue) ||
    commercial.length < 2 ||
    data.authorityDeclaration !== true ||
    data.accuracyDeclaration !== true ||
    data.contactConsent !== true
  ) {
    return null;
  }

  const pincode = text(data.pincode, 6);
  if (pincode && !/^\d{6}$/.test(pincode)) return null;
  const email = text(data.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const availableFrom = text(data.availableFrom, 10);
  if (availableFrom && !/^\d{4}-\d{2}-\d{2}$/.test(availableFrom)) return null;

  return {
    intent,
    ownerRole,
    propertyType,
    projectName: text(data.projectName, 140),
    locality,
    pincode,
    configuration,
    bathrooms: text(data.bathrooms, 20),
    areaValue,
    areaBasis: text(data.areaBasis, 40) || "Carpet area",
    furnishing: text(data.furnishing, 60),
    floor: text(data.floor, 20),
    totalFloors: text(data.totalFloors, 20),
    parking: text(data.parking, 60),
    propertyAge: text(data.propertyAge, 60),
    expectedPrice: text(data.expectedPrice, 80),
    monthlyRent: text(data.monthlyRent, 80),
    maintenance: text(data.maintenance, 80),
    deposit: text(data.deposit, 80),
    availableFrom,
    occupancy: text(data.occupancy, 80),
    description: text(data.description, 1200),
    name,
    phone,
    email: email || null,
    contactPreference: text(data.contactPreference, 60) || "Phone or WhatsApp",
    authorityDeclaration: true,
    accuracyDeclaration: true,
    contactConsent: true,
  };
}
