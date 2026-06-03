"use client";

import { useEffect, useState } from "react";
import { Keyword } from "../admin/bot-config";

interface KeywordDictionary {
  [word: string]: string; // word -> keyword_id
}

interface KeywordEntry {
  id: string;
  keyword: string;
  synonyms: string[];
}

class KeywordDictionaryService {
  private dictionary: KeywordDictionary = {};
  private keywords: KeywordEntry[] = [];

  // 1. Read All Call Returns List of Keywords
  async loadKeywordsFromAPI(): Promise<KeywordEntry[]> {
    try {
      const response = await fetch("/api/keywords");
      const data = await response.json();

      if (data.success && data.data) {
        this.keywords = data.data.map((item: any) => ({
          id: item.id,
          keyword: item.keyword,
          synonyms: item.synonyms || [],
        }));
        return this.keywords;
      }
      return [];
    } catch (error) {
      console.error("Error loading keywords:", error);
      return [];
    }
  }

  // 2. Build Dictionary: Map each word to Keyword ID
  // For each Keyword Entity:
  //   - Add keyword -> keyword_id
  //   - Split synonyms by ";" and add each synonym -> keyword_id
  buildDictionary(keywords: KeywordEntry[]): KeywordDictionary {
    const dict: KeywordDictionary = {};

    for (const entry of keywords) {
      // Add the main keyword
      dict[entry.keyword.toLowerCase()] = entry.id;

      // Split synonyms by ";" and add each synonym
      if (entry.synonyms && entry.synonyms.length > 0) {
        for (const synonym of entry.synonyms) {
          // Handle synonyms that might be comma or semicolon separated
          const splitSynonyms = synonym
            .split(/[;,]/)
            .map((s) => s.trim().toLowerCase());
          for (const splitSyn of splitSynonyms) {
            if (splitSyn) {
              dict[splitSyn] = entry.id;
            }
          }
        }
      }
    }

    this.dictionary = dict;
    return dict;
  }

  // 3. Stringify and Save Keyword Dictionary to Session Storage
  saveToSessionStorage(): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "keyword_dictionary",
        JSON.stringify(this.dictionary),
      );
      sessionStorage.setItem("keywords_data", JSON.stringify(this.keywords));
      console.log(
        `Saved ${Object.keys(this.dictionary).length} keyword mappings to sessionStorage`,
      );
    }
  }

  // Load dictionary from session storage
  loadFromSessionStorage(): KeywordDictionary | null {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("keyword_dictionary");
      if (stored) {
        this.dictionary = JSON.parse(stored);
        return this.dictionary;
      }
    }
    return null;
  }

  // Get keyword ID by word (with synonym matching)
  getKeywordId(word: string): string | null {
    const normalizedWord = word.toLowerCase().trim();
    return this.dictionary[normalizedWord] || null;
  }

  // Get full keyword object by ID
  getKeywordById(id: string): KeywordEntry | null {
    return this.keywords.find((k) => k.id === id) || null;
  }

  // Search user message for matching keywords
  // Returns matching keyword IDs with their positions
  searchMessageForKeywords(
    message: string,
  ): { keywordId: string; matchedWord: string; position: number }[] {
    const words = message.toLowerCase().split(/\s+/);
    const matches: {
      keywordId: string;
      matchedWord: string;
      position: number;
    }[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const keywordId = this.getKeywordId(word);
      if (keywordId) {
        matches.push({
          keywordId,
          matchedWord: word,
          position: i,
        });
      }
    }

    return matches;
  }

  // Initialize: Load, Build, Save
  async initialize(): Promise<KeywordDictionary> {
    // Try to load from session storage first
    const cached = this.loadFromSessionStorage();
    if (cached && Object.keys(cached).length > 0) {
      console.log(
        `Loaded ${Object.keys(cached).length} keyword mappings from cache`,
      );
      return cached;
    }

    // If not cached, fetch from API
    console.log("🔄 Fetching keywords from API...");
    const keywords = await this.loadKeywordsFromAPI();
    const dictionary = this.buildDictionary(keywords);
    this.saveToSessionStorage();

    console.log(
      `Built dictionary with ${Object.keys(dictionary).length} mappings from ${keywords.length} keywords`,
    );
    return dictionary;
  }

  // Get statistics
  getStats() {
    return {
      totalKeywords: this.keywords.length,
      totalMappings: Object.keys(this.dictionary).length,
      averageSynonymsPerKeyword:
        this.keywords.length > 0
          ? (
              this.keywords.reduce(
                (acc, k) => acc + (k.synonyms?.length || 0),
                0,
              ) / this.keywords.length
            ).toFixed(2)
          : 0,
    };
  }
}

// Singleton instance
const keywordDictionary = new KeywordDictionaryService();

// React Component for initializing and displaying the dictionary
export function KeywordDictionaryInitializer() {
  const [stats, setStats] = useState<{
    totalKeywords: number;
    totalMappings: number;
    averageSynonymsPerKeyword: string | number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDictionary = async () => {
      try {
        setLoading(true);
        await keywordDictionary.initialize();
        setStats(keywordDictionary.getStats());
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize dictionary",
        );
        console.error("Dictionary initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initDictionary();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "1rem", color: "#a0a0b0" }}>
        Building keyword dictionary...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "#f87171" }}>❌ Error: {error}</div>
    );
  }

  return (
    <div
      style={{
        padding: "0.75rem",
        background: "rgba(59, 59, 88, 0.5)",
        borderRadius: "8px",
        fontSize: "0.75rem",
        color: "#a0a0b0",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <span> {stats?.totalKeywords} keywords</span>
        <span> {stats?.totalMappings} word mappings</span>
        <span> {stats?.averageSynonymsPerKeyword} avg synonyms/keyword</span>
        <span> Cached in session storage</span>
      </div>
    </div>
  );
}

// Export the singleton instance for use in chatbot
export { keywordDictionary };
