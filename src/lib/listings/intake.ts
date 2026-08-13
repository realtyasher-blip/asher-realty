const INTAKE_START = "[ASHER_PROPERTY_SUBMISSION]";
const INTAKE_END = "[/ASHER_PROPERTY_SUBMISSION]";

const intakePattern = new RegExp(
  `${INTAKE_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*([\\s\\S]*?)\\s*${INTAKE_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
  "u"
);

export function propertySubmissionIntake(notes?: string | null) {
  return notes?.match(intakePattern)?.[1]?.trim() || "";
}

export function stripPropertySubmissionIntake(notes?: string | null) {
  return (notes || "").replace(intakePattern, "").trim();
}

export function mergePropertySubmissionIntake(
  staffNotes: string,
  intake: string
) {
  const cleanStaff = stripPropertySubmissionIntake(staffNotes);
  if (!intake.trim()) return cleanStaff;
  return [cleanStaff, `${INTAKE_START}\n${intake.trim()}\n${INTAKE_END}`]
    .filter(Boolean)
    .join("\n\n");
}
