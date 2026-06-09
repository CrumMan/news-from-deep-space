import type { Combination } from "../../admin/bot-config";
import type { MatchedKeyword } from "./keyword-dictionary";

/** Component 3: iterate keyword pairs in discovery order; return first DB combo match */
export function findFirstCombination(
  matches: MatchedKeyword[],
  combinations: Combination[],
): Combination | null {
  if (matches.length < 2) return null;

  const ids = matches.map((m) => m.id);

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const combo = combinations.find(
        (c) =>
          (c.fk_keyword1 === a && c.fk_keyword2 === b) ||
          (c.fk_keyword1 === b && c.fk_keyword2 === a),
      );
      if (combo) return combo;
    }
  }

  return null;
}

export function combinationLabel(combo: Combination): string {
  return `${combo.keyword1} + ${combo.keyword2}`;
}

/** DB may store legacy type "photo" — treat like api for NASA/APOD combos */
export function isApiLikeComboType(type: string): boolean {
  return type === "api" || type === "photo";
}

/** Strip accidental "api_key=" prefix from admin-entered keys */
export function normalizeStoredApiKey(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed.toLowerCase().startsWith("api_key=")) {
    return trimmed.slice("api_key=".length).trim() || null;
  }
  return trimmed;
}

export function isApodResult(result: string): boolean {
  const lower = result.toLowerCase();
  return (
    lower.includes("api.nasa.gov/planetary/apod") ||
    lower === "/api/apod" ||
    lower.startsWith("/api/apod?")
  );
}

export function combinationTarget(combo: Combination): string {
  if (isApodResult(combo.result)) {
    return "/api/apod";
  }

  if (isApiLikeComboType(combo.type)) {
    const key = normalizeStoredApiKey(combo.api_key);
    const separator = combo.result.includes("?") ? "&" : "?";
    return key
      ? `${combo.result}${separator}api_key=${encodeURIComponent(key)}`
      : combo.result;
  }
  return combo.result;
}
