import type { Keyword } from "../../admin/bot-config";

export const KEYWORD_DICTIONARY_KEY = "keyword_dictionary";

export type KeywordDictionary = Record<string, string>;

export type MatchedKeyword = {
  id: string;
  canonical: string;
  matchedText: string;
  startIndex: number;
};

/** Component 1: build word → keyword ID map and persist to sessionStorage */
export function buildKeywordDictionary(keywords: Keyword[]): KeywordDictionary {
  const dict: KeywordDictionary = {};

  for (const entry of keywords) {
    dict[entry.keyword.toLowerCase()] = entry.id;
    for (const synonym of entry.synonyms ?? []) {
      const normalized = synonym.toLowerCase().trim();
      if (normalized) dict[normalized] = entry.id;
    }
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem(KEYWORD_DICTIONARY_KEY, JSON.stringify(dict));
  }

  return dict;
}

export function loadKeywordDictionaryFromStorage(): KeywordDictionary | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(KEYWORD_DICTIONARY_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as KeywordDictionary;
  } catch {
    return null;
  }
}

export function readKeywordIdFromDictionary(
  dictionary: KeywordDictionary,
  word: string,
): string | null {
  return dictionary[word.toLowerCase().trim()] ?? null;
}

export function getKeywordById(keywords: Keyword[], id: string): Keyword | null {
  return keywords.find((k) => k.id === id) ?? null;
}
