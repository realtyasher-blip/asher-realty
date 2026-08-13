export function propertySubmissionReference(id: string) {
  const compact = id.replace(/[^a-f0-9]/giu, "").slice(0, 8).toUpperCase();
  if (compact.length === 8) return `AR-P-${compact}`;

  let hash = 0x811c9dc5;
  for (const character of id) {
    hash ^= character.codePointAt(0) || 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return `AR-P-${(hash >>> 0).toString(16).padStart(8, "0").toUpperCase()}`;
}
