export const FAVOURITES_KEY = "asher-favourite-projects";
export const RECENT_KEY = "asher-recent-projects";
export const COMPARISON_KEY = "asher-last-comparison";
export const BUYER_WORKSPACE_EVENT = "asher:buyer-workspace-updated";

export type BuyerWorkspaceSnapshot = {
  favourites: string[];
  comparison: string[];
  recent: string[];
};

function readStringArray(key: string) {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function readBuyerWorkspace(): BuyerWorkspaceSnapshot {
  return {
    favourites: readStringArray(FAVOURITES_KEY),
    comparison: readStringArray(COMPARISON_KEY).slice(0, 2),
    recent: readStringArray(RECENT_KEY),
  };
}

export function writeBuyerWorkspaceList(key: string, values: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Device storage can be unavailable in privacy-restricted browsers.
  }

  window.dispatchEvent(new CustomEvent(BUYER_WORKSPACE_EVENT));
}

export function toggleBuyerWorkspaceItem(
  key: string,
  value: string,
  options?: { maxItems?: number }
) {
  const current = readStringArray(key);
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  const limited = options?.maxItems
    ? next.slice(Math.max(0, next.length - options.maxItems))
    : next;

  writeBuyerWorkspaceList(key, limited);
  return limited;
}
