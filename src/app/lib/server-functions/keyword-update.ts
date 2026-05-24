import { sql } from "./database";

type KeywordRow = {
  id: string;
  keyword: string;
  synonyms: string[];
  created_at: string;
};

export async function updateKeywordById(
  id: string,
  updates: { keyword?: string; synonyms?: string[] },
) {
  try {
    const keyword = updates.keyword?.trim();
    const synonyms = updates.synonyms
      ? [...new Set(updates.synonyms.map((s) => s.trim()).filter(Boolean))]
      : undefined;

    if (!keyword && synonyms === undefined) {
      return {
        success: false as const,
        error: "Provide keyword or synonyms to update",
      };
    }

    const rows = await sql<KeywordRow[]>`
      UPDATE keyword SET
        keyword = COALESCE(${keyword ?? null}, keyword),
        synonyms = COALESCE(${synonyms ?? null}, synonyms)
      WHERE id = ${id}
      RETURNING id, keyword, synonyms, created_at
    `;

    if (rows.length === 0) {
      return { success: false as const, error: "Keyword not found" };
    }

    return {
      success: true as const,
      message: `Keyword "${rows[0].keyword}" updated successfully`,
      data: rows[0],
    };
  } catch (error) {
    console.error("Error updating keyword:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function removeSynonymFromKeyword(
  keyword: string,
  synonymToRemove: string,
) {
  try {
    const result = await sql<{ id: string; keyword: string; synonyms: string[] }[]>`
      SELECT id, keyword, synonyms
      FROM keyword
      WHERE keyword = ${keyword.trim()}
    `;

    if (result.length === 0) {
      return {
        success: false as const,
        error: `Keyword "${keyword}" not found`,
      };
    }

    const currentSynonyms = result[0].synonyms || [];
    const synonymLower = synonymToRemove.trim().toLowerCase();

    if (!currentSynonyms.some((s) => s.toLowerCase() === synonymLower)) {
      return {
        success: false as const,
        error: `Synonym "${synonymToRemove}" not found for keyword "${keyword}"`,
      };
    }

    const updatedSynonyms = currentSynonyms.filter(
      (s) => s.toLowerCase() !== synonymLower,
    );

    const updateResult = await sql<KeywordRow[]>`
      UPDATE keyword
      SET synonyms = ${updatedSynonyms}
      WHERE id = ${result[0].id}
      RETURNING id, keyword, synonyms, created_at
    `;

    return {
      success: true as const,
      message: `Synonym "${synonymToRemove}" removed from keyword "${keyword}"`,
      data: updateResult[0],
    };
  } catch (error) {
    console.error("Error removing synonym:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
