export type TrueCostInputs = {
  projectSlug: string;
  otherProjectName: string;
  referenceType: "Builder quote" | "Platform starting-price reference";
  baseValueLakhs: number;
  floorViewPremiumLakhs: number;
  parkingLakhs: number;
  amenitiesLakhs: number;
  maintenanceCorpusLakhs: number;
  taxesLakhs: number;
  registrationLakhs: number;
  otherLakhs: number;
  carpetAreaSqft: number;
  saleableAreaSqft: number;
  downPaymentPercent: number;
  loanRatePercent: number;
  loanTenureYears: number;
  monthlyRentRupees: number;
  monthsToPossession: number;
};

export type TrueCostResult = {
  propertySubtotalLakhs: number;
  ownershipExtrasLakhs: number;
  allInLakhs: number;
  equityAndExtrasLakhs: number;
  illustrativeLoanLakhs: number;
  emiRupees: number;
  rentOverlapLakhs: number;
  carpetRateRupees: number;
  saleableRateRupees: number;
  loadingPercent: number;
  questions: string[];
  fieldsEntered: number;
};

export const emptyTrueCostInputs: TrueCostInputs = {
  projectSlug: "",
  otherProjectName: "",
  referenceType: "Builder quote",
  baseValueLakhs: 0,
  floorViewPremiumLakhs: 0,
  parkingLakhs: 0,
  amenitiesLakhs: 0,
  maintenanceCorpusLakhs: 0,
  taxesLakhs: 0,
  registrationLakhs: 0,
  otherLakhs: 0,
  carpetAreaSqft: 0,
  saleableAreaSqft: 0,
  downPaymentPercent: 20,
  loanRatePercent: 8.5,
  loanTenureYears: 20,
  monthlyRentRupees: 0,
  monthsToPossession: 0,
};

function safeNumber(value: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function monthlyEmi(principalLakhs: number, annualRate: number, years: number) {
  const principal = safeNumber(principalLakhs) * 100_000;
  const months = Math.round(safeNumber(years, 1, 40) * 12);
  const monthlyRate = safeNumber(annualRate, 0, 30) / 1200;

  if (!principal || !months) return 0;
  if (!monthlyRate) return principal / months;

  const growth = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function calculateTrueCost(inputs: TrueCostInputs): TrueCostResult {
  const base = safeNumber(inputs.baseValueLakhs);
  const floorView = safeNumber(inputs.floorViewPremiumLakhs);
  const parking = safeNumber(inputs.parkingLakhs);
  const amenities = safeNumber(inputs.amenitiesLakhs);
  const maintenance = safeNumber(inputs.maintenanceCorpusLakhs);
  const taxes = safeNumber(inputs.taxesLakhs);
  const registration = safeNumber(inputs.registrationLakhs);
  const other = safeNumber(inputs.otherLakhs);

  const propertySubtotalLakhs = base + floorView + parking + amenities;
  const ownershipExtrasLakhs = maintenance + taxes + registration + other;
  const allInLakhs = propertySubtotalLakhs + ownershipExtrasLakhs;
  const downPayment = safeNumber(inputs.downPaymentPercent, 0, 100) / 100;
  const illustrativeLoanLakhs = propertySubtotalLakhs * (1 - downPayment);
  const equityAndExtrasLakhs = propertySubtotalLakhs * downPayment + ownershipExtrasLakhs;
  const carpetArea = safeNumber(inputs.carpetAreaSqft);
  const saleableArea = safeNumber(inputs.saleableAreaSqft);
  const monthlyRent = safeNumber(inputs.monthlyRentRupees);
  const monthsToPossession = safeNumber(inputs.monthsToPossession, 0, 120);

  const questions: string[] = [];
  if (!base) questions.push("What is the exact agreement value for this unit—not the advertised starting price?");
  if (!floorView) questions.push("Is there a floor-rise, preferred-location or view premium for this unit?");
  if (!parking) questions.push("Is parking included, optional or charged separately?");
  if (!amenities) questions.push("Are clubhouse, amenity or infrastructure charges included in writing?");
  if (!maintenance) questions.push("What maintenance advance, corpus or sinking-fund amount is due?");
  if (!taxes) questions.push("Which taxes apply to this unit and payment stage, and are they included in the quote?");
  if (!registration) questions.push("What should be budgeted for stamp duty and registration at the applicable date?");
  if (!carpetArea) questions.push("What is the RERA carpet area for the exact unit and phase?");
  if (!saleableArea) questions.push("What saleable or super built-up area is being used in the quote?");

  const loadingPercent =
    carpetArea > 0 && saleableArea >= carpetArea
      ? ((saleableArea - carpetArea) / saleableArea) * 100
      : 0;

  if (loadingPercent > 38) {
    questions.push("The carpet-to-saleable difference is substantial. Ask for the area computation and common-area loading in writing.");
  }

  const trackedFields = [
    base,
    floorView,
    parking,
    amenities,
    maintenance,
    taxes,
    registration,
    carpetArea,
    saleableArea,
  ];

  return {
    propertySubtotalLakhs,
    ownershipExtrasLakhs,
    allInLakhs,
    equityAndExtrasLakhs,
    illustrativeLoanLakhs,
    emiRupees: monthlyEmi(
      illustrativeLoanLakhs,
      inputs.loanRatePercent,
      inputs.loanTenureYears
    ),
    rentOverlapLakhs: (monthlyRent * monthsToPossession) / 100_000,
    carpetRateRupees: carpetArea ? (allInLakhs * 100_000) / carpetArea : 0,
    saleableRateRupees: saleableArea ? (allInLakhs * 100_000) / saleableArea : 0,
    loadingPercent,
    questions: questions.slice(0, 8),
    fieldsEntered: trackedFields.filter((value) => value > 0).length,
  };
}

export function formatLakhs(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "₹0";
  if (value >= 100) {
    return `₹${(value / 100).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} Cr`;
  }
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })} L`;
}

export function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}
