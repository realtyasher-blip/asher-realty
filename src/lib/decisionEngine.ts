import type { Project } from "@/data/projects";

export type DataConfidence = {
  label: "Detailed" | "Good" | "Basic";
  detail: string;
};

export function projectPriceCrores(price: string) {
  const match = price.match(/(?:₹|INR)\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;

  return /\bL\b|lakh/i.test(price) ? value / 100 : value;
}

export function projectOffersConfiguration(project: Project, configuration: string) {
  if (!configuration || configuration === "Any BHK") return true;

  const text = project.configuration.toLowerCase();
  if (!/\b(?:bhk|bed|bedroom|residence)/i.test(text)) return false;

  const offered: string[] = text.match(/\b[1-4]\b/g) ?? [];
  return offered.includes(configuration);
}

export function budgetFits(project: Project, budget: string) {
  if (budget === "Flexible" || budget === "Any budget") return true;

  const value = projectPriceCrores(project.price);
  if (value === null) return false;
  if (budget === "Up to ₹2 Cr") return value <= 2;
  if (budget === "₹2–3 Cr") return value >= 2 && value <= 3;
  if (budget === "₹3 Cr+") return value >= 3;
  return true;
}

export function projectFitBand(score: number) {
  if (score >= 84) return "Strong match";
  if (score >= 72) return "Good match";
  return "Worth comparing";
}

export function projectDataConfidence(project: Project): DataConfidence {
  const signals = [
    Boolean(project.rera),
    Boolean(project.possession),
    projectPriceCrores(project.price) !== null,
    Boolean(project.unitSizes),
    project.gallery.length >= 3,
    Boolean(project.verifiedAt),
  ].filter(Boolean).length;

  if (signals >= 5) {
    return {
      label: "Detailed",
      detail: "Most core project fields are available",
    };
  }

  if (signals >= 3) {
    return {
      label: "Good",
      detail: "Useful facts are available; live unit checks remain",
    };
  }

  return {
    label: "Basic",
    detail: "More phase-level facts need confirmation",
  };
}

export function projectDecisionCaution(project: Project) {
  if (projectPriceCrores(project.price) === null) {
    return "Confirm current all-inclusive cost and preferred-stack availability";
  }
  if (!project.rera) {
    return "Confirm the exact phase RERA and possession schedule";
  }
  if (!project.possession) {
    return "Confirm the latest possession schedule and construction stage";
  }
  return "Confirm exact tower, floor, view and all-inclusive cost";
}

export function projectSourceLabel(project: Project) {
  return `Builder-sourced · reviewed ${project.verifiedAt}`;
}
