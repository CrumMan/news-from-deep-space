"use client";

import { useState, useEffect } from "react";
import { keywordDictionary } from "./KeywordDictionary";

export interface MatchedKeyword {
  keywordId: string;
  keyword: string;
  matchedWord: string;
  position: number;
  synonyms?: string[];
}

export interface MessageLookupResult {
  originalMessage: string;
  words: string[];
  matchedKeywords: MatchedKeyword[];
  uniqueKeywordIds: string[];
  timestamp: number;
}

// Component 2: Message Lookup Service

export class MessageLookupService {
  // 1. Break user message into individual words
  tokenizeMessage(message: string): string[] {
    // Remove punctuation, convert to lowercase, split by spaces
    const cleanMessage = message
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    return cleanMessage ? cleanMessage.split(" ") : [];
  }

  // 2. Compare each word against dictionary from Component 1
  //    Generate array of keywords with corresponding user ID
  lookupKeywords(message: string): MessageLookupResult {
    // Step 1: Break message into individual words
    const words = this.tokenizeMessage(message);

    // Step 2: Compare each word against dictionary
    const matchedKeywords: MatchedKeyword[] = [];
    const seenKeywordIds = new Set<string>();

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Check if word exists in dictionary (from Component 1)
      const keywordId = keywordDictionary.getKeywordId(word);

      if (keywordId && !seenKeywordIds.has(keywordId)) {
        seenKeywordIds.add(keywordId);

        // Get full keyword object
        const keywordObj = keywordDictionary.getKeywordById(keywordId);

        matchedKeywords.push({
          keywordId: keywordId,
          keyword: keywordObj?.keyword || word,
          matchedWord: word,
          position: i,
          synonyms: keywordObj?.synonyms || [],
        });
      }
    }

    // Return result with all matched keywords
    return {
      originalMessage: message,
      words: words,
      matchedKeywords: matchedKeywords,
      uniqueKeywordIds: Array.from(seenKeywordIds),
      timestamp: Date.now(),
    };
  }

  // 3. Get keyword combinations (for two-keyword matching)
  getKeywordCombinations(
    matchedKeywords: MatchedKeyword[],
  ): { keyword1: MatchedKeyword; keyword2: MatchedKeyword }[] {
    const combinations: {
      keyword1: MatchedKeyword;
      keyword2: MatchedKeyword;
    }[] = [];

    for (let i = 0; i < matchedKeywords.length; i++) {
      for (let j = i + 1; j < matchedKeywords.length; j++) {
        combinations.push({
          keyword1: matchedKeywords[i],
          keyword2: matchedKeywords[j],
        });
      }
    }

    return combinations;
  }

  // 4. Check if specific keyword exists in message
  hasKeyword(message: string, keywordToCheck: string): boolean {
    const result = this.lookupKeywords(message);
    return result.matchedKeywords.some(
      (mk) => mk.keyword.toLowerCase() === keywordToCheck.toLowerCase(),
    );
  }

  // 5. Get first matched keyword
  getFirstKeyword(message: string): MatchedKeyword | null {
    const result = this.lookupKeywords(message);
    return result.matchedKeywords.length > 0 ? result.matchedKeywords[0] : null;
  }

  // 6. Get all matched keyword IDs as array
  getKeywordIds(message: string): string[] {
    const result = this.lookupKeywords(message);
    return result.uniqueKeywordIds;
  }

  // 7. Get matched keywords as simple string array
  getMatchedKeywordStrings(message: string): string[] {
    const result = this.lookupKeywords(message);
    return result.matchedKeywords.map((mk) => mk.keyword);
  }
}

// Create singleton instance
export const messageLookup = new MessageLookupService();
