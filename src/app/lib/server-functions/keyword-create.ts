import { sql } from "./database";

type KeywordRow = {
  id: string;
  keyword: string;
  synonyms: string[];
  created_at: string;
};

export async function createKeywordWithSynonyms(
  keyword: string,
  synonyms: string[],
) {
  try {
    const normalized = keyword.trim();
    if (!normalized) {
      return { success: false as const, error: "Keyword is required" };
    }

    const existingKeyword = await sql`
      SELECT id FROM keyword WHERE keyword = ${normalized}
    `;

    if (existingKeyword.length > 0) {
      return {
        success: false as const,
        error: `Keyword "${normalized}" already exists`,
      };
    }

    const uniqueSynonyms = [
      ...new Set(synonyms.map((s) => s.trim()).filter(Boolean)),
    ];

    const result = await sql<KeywordRow[]>`
      INSERT INTO keyword (keyword, synonyms)
      VALUES (${normalized}, ${uniqueSynonyms})
      RETURNING id, keyword, synonyms, created_at
    `;

    return {
      success: true as const,
      message: `Keyword "${normalized}" created successfully`,
      data: result[0],
    };
  } catch (error) {
    console.error("Error creating keyword:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
