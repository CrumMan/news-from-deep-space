import type { Keyword } from "../../admin/bot-config";
import {
  getKeywordById,
  type MatchedKeyword,
  type KeywordDictionary,
  readKeywordIdFromDictionary,
} from "./keyword-dictionary";

export type KeywordLookupResult = {
  matches: MatchedKeyword[];
  /** Component 1 testing lines: "X (Keyword) word found…" */
  debugLines: string[];
};

type PhraseEntry = { phrase: string; keyword: Keyword };

function collectPhrases(keywords: Keyword[]): PhraseEntry[] {
  const phrases: PhraseEntry[] = [];
  for (const keyword of keywords) {
    phrases.push({ phrase: keyword.keyword.toLowerCase(), keyword });
    for (const synonym of keyword.synonyms ?? []) {
      const normalized = synonym.toLowerCase().trim();
      if (normalized) phrases.push({ phrase: normalized, keyword });
    }
  }
  return phrases.sort((a, b) => b.phrase.length - a.phrase.length);
}

function atWordBoundary(text: string, start: number, end: number): boolean {
  const beforeOk = start === 0 || !/\w/.test(text[start - 1]);
  const afterOk = end === text.length || !/\w/.test(text[end]);
  return beforeOk && afterOk;
}

function overlapsRange(
  ranges: Array<[number, number]>,
  start: number,
  end: number,
): boolean {
  return ranges.some(([s, e]) => !(end <= s || start >= e));
}

/** Component 2: scan message (phrases + single words) → ordered keyword hits with IDs */
export function lookupKeywordsInMessage(
  message: string,
  keywords: Keyword[],
  dictionary: KeywordDictionary,
): KeywordLookupResult {
  const lowered = message.toLowerCase();
  const matches: MatchedKeyword[] = [];
  const usedRanges: Array<[number, number]> = [];
  const seenIds = new Set<string>();
  const debugLines: string[] = [];

  for (const { phrase, keyword } of collectPhrases(keywords)) {
    let searchFrom = 0;
    while (searchFrom < lowered.length) {
      const found = lowered.indexOf(phrase, searchFrom);
      if (found === -1) break;
      const end = found + phrase.length;
      if (
        atWordBoundary(lowered, found, end) &&
        !overlapsRange(usedRanges, found, end) &&
        !seenIds.has(keyword.id)
      ) {
        const matchedText = message.slice(found, end);
        matches.push({
          id: keyword.id,
          canonical: keyword.keyword,
          matchedText,
          startIndex: found,
        });
        usedRanges.push([found, end]);
        seenIds.add(keyword.id);
        debugLines.push(
          `"${matchedText}" (Keyword) word found, we will refer to the new word as ${keyword.keyword} with ${keyword.id} as the ID.`,
        );
      }
      searchFrom = found + 1;
    }
  }

  matches.sort((a, b) => a.startIndex - b.startIndex);

  const words = message.split(/\s+/);
  for (const word of words) {
    const id = readKeywordIdFromDictionary(dictionary, word);
    if (!id || seenIds.has(id)) continue;
    const keyword = getKeywordById(keywords, id);
    if (!keyword) continue;
    const idx = lowered.indexOf(word.toLowerCase());
    if (idx === -1) continue;
    if (overlapsRange(usedRanges, idx, idx + word.length)) continue;

    matches.push({
      id,
      canonical: keyword.keyword,
      matchedText: word,
      startIndex: idx,
    });
    usedRanges.push([idx, idx + word.length]);
    seenIds.add(id);
    debugLines.push(
      `"${word}" (Keyword) word found, we will refer to the new word as ${keyword.keyword} with ${keyword.id} as the ID.`,
    );
  }

  matches.sort((a, b) => a.startIndex - b.startIndex);
  return { matches, debugLines };
}
