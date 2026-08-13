import {
  propertyAgeOptions,
  propertyAreaBases,
  propertyBathroomOptions,
  propertyConfigurations,
  propertyContactPreferences,
  propertyFurnishingOptions,
  propertyIntents,
  propertyOccupancyOptions,
  propertyOwnerRoles,
  propertyParkingOptions,
  propertyTypes,
  type PropertySubmissionInput,
} from "@/lib/listings/types";
import {
  normalizePublicPhone,
  sanitizePublicMultiline,
  sanitizePublicSingleLine,
} from "@/lib/listings/safety";

function selected<T extends string>(value: unknown, options: readonly T[]) {
  const candidate = sanitizePublicSingleLine(value, 80) as T;
  return options.includes(candidate) ? candidate : null;
}

function optionalSelected<T extends string>(
  value: unknown,
  options: readonly T[]
) {
  const candidate = sanitizePublicSingleLine(value, 80);
  if (!candidate) return "" as const;
  return options.includes(candidate as T) ? (candidate as T) : null;
}

function hasPositiveNumber(value: string) {
  const match = value.replaceAll(",", "").match(/\d+(?:\.\d+)?/u);
  return Boolean(match && Number.isFinite(Number(match[0])) && Number(match[0]) > 0);
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 2000 || year > 2100) return false;
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function optionalWholeNumber(value: unknown, min: number, max: number) {
  const candidate = sanitizePublicSingleLine(value, 4);
  if (!candidate) return "";
  if (!/^\d{1,3}$/u.test(candidate)) return null;
  const number = Number(candidate);
  return number >= min && number <= max ? candidate : null;
}

export function parsePropertySubmission(
  value: unknown
): PropertySubmissionInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (sanitizePublicSingleLine(data.website, 20)) return null;

  const intent = selected(data.intent, propertyIntents);
  const ownerRole = selected(data.ownerRole, propertyOwnerRoles);
  const propertyType = selected(data.propertyType, propertyTypes);
  const configuration = selected(data.configuration, propertyConfigurations);
  const areaBasis = selected(data.areaBasis, propertyAreaBases);
  const bathrooms = optionalSelected(data.bathrooms, propertyBathroomOptions);
  const furnishing = optionalSelected(data.furnishing, propertyFurnishingOptions);
  const parking = optionalSelected(data.parking, propertyParkingOptions);
  const propertyAge = optionalSelected(data.propertyAge, propertyAgeOptions);
  const occupancy = optionalSelected(data.occupancy, propertyOccupancyOptions);
  const contactPreference = selected(
    data.contactPreference,
    propertyContactPreferences
  );

  const name = sanitizePublicSingleLine(data.name, 80);
  const phone = normalizePublicPhone(data.phone);
  const locality = sanitizePublicSingleLine(data.locality, 120);
  const areaValue = sanitizePublicSingleLine(data.areaValue, 20);
  const areaNumber = Number(areaValue);
  const floor = optionalWholeNumber(data.floor, 0, 250);
  const totalFloors = optionalWholeNumber(data.totalFloors, 1, 300);
  const expectedPrice = sanitizePublicSingleLine(data.expectedPrice, 80);
  const monthlyRent = sanitizePublicSingleLine(data.monthlyRent, 80);
  const commercial = intent === "Sell" ? expectedPrice : monthlyRent;

  if (
    !intent ||
    !ownerRole ||
    !propertyType ||
    !configuration ||
    !areaBasis ||
    bathrooms === null ||
    furnishing === null ||
    parking === null ||
    propertyAge === null ||
    occupancy === null ||
    !contactPreference ||
    name.length < 2 ||
    !phone ||
    locality.length < 2 ||
    !/^\d{1,7}(?:\.\d{1,2})?$/u.test(areaValue) ||
    !Number.isFinite(areaNumber) ||
    areaNumber < 20 ||
    areaNumber > 10_000_000 ||
    floor === null ||
    totalFloors === null ||
    (floor && totalFloors && Number(floor) > Number(totalFloors)) ||
    !hasPositiveNumber(commercial) ||
    data.authorityDeclaration !== true ||
    data.accuracyDeclaration !== true ||
    data.contactConsent !== true
  ) {
    return null;
  }

  const pincode = sanitizePublicSingleLine(data.pincode, 6);
  if (pincode && !/^[1-9]\d{5}$/u.test(pincode)) return null;

  const email = sanitizePublicSingleLine(data.email, 120).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) return null;
  if (contactPreference === "Email" && !email) return null;

  const availableFrom = sanitizePublicSingleLine(data.availableFrom, 10);
  if (availableFrom && !validDate(availableFrom)) return null;

  const maintenance = sanitizePublicSingleLine(data.maintenance, 80);
  const deposit = sanitizePublicSingleLine(data.deposit, 80);
  if (intent === "Rent out") {
    if (maintenance && !/\bincluded\b/iu.test(maintenance) && !hasPositiveNumber(maintenance)) {
      return null;
    }
    if (deposit && !hasPositiveNumber(deposit)) return null;
  }

  return {
    intent,
    ownerRole,
    propertyType,
    projectName: sanitizePublicSingleLine(data.projectName, 140),
    locality,
    pincode,
    configuration,
    bathrooms,
    areaValue,
    areaBasis,
    furnishing,
    floor,
    totalFloors,
    parking,
    propertyAge,
    expectedPrice: intent === "Sell" ? expectedPrice : "",
    monthlyRent: intent === "Rent out" ? monthlyRent : "",
    maintenance: intent === "Rent out" ? maintenance : "",
    deposit: intent === "Rent out" ? deposit : "",
    availableFrom,
    occupancy,
    description: sanitizePublicMultiline(data.description, 1200),
    name,
    phone,
    email: email || null,
    contactPreference,
    authorityDeclaration: true,
    accuracyDeclaration: true,
    contactConsent: true,
  };
}
