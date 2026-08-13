const reservedMarker = /\[\s*\/?\s*ASHER_(?:CALLING_DATA|PROPERTY_SUBMISSION)\s*\]/giu;
const reservedToken = /ASHER_(?:CALLING_DATA|PROPERTY_SUBMISSION)/giu;
const disallowedControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/gu;
const invisibleFormatting = /[\u200b-\u200f\u202a-\u202e\u2060\u2066-\u2069\ufeff]/gu;

function cleanPublicText(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/\r\n?/gu, "\n")
    .replace(disallowedControls, "")
    .replace(invisibleFormatting, "")
    .replace(reservedMarker, "")
    .replace(reservedToken, "");
}

export function sanitizePublicSingleLine(value: unknown, max = 160) {
  return cleanPublicText(value).replace(/\s+/gu, " ").trim().slice(0, max);
}

export function sanitizePublicMultiline(value: unknown, max = 1200) {
  return cleanPublicText(value)
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/gu, " ").trim())
    .join("\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim()
    .slice(0, max);
}

export function normalizePublicPhone(value: unknown) {
  const raw = sanitizePublicSingleLine(value, 24);
  let digits = raw.replace(/\D/gu, "");
  if (raw.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length < 8 || digits.length > 15) return "";
  if (!raw.startsWith("+") && !raw.startsWith("00") && digits.length < 11) {
    return "";
  }
  return `+${digits}`;
}
