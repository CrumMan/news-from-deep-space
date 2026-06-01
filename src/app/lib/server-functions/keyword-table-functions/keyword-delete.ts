import { sql } from "../database";

export async function deleteKeywordById(id: string) {
  try {
    const keywordResult = await sql<
      { id: string; keyword: string; synonyms: string[] }[]
    >`
      SELECT id, keyword, synonyms FROM keyword WHERE id = ${id}
    `;

    if (keywordResult.length === 0) {
      return { success: false as const, error: "Keyword not found" };
    }

    const keywordId = keywordResult[0].id;
    const keywordName = keywordResult[0].keyword;

    const combinedWordsBefore = await sql<{ count: string }[]>`
      SELECT COUNT(*)::text AS count FROM combined_keywords
      WHERE fk_keyword1 = ${keywordId} OR fk_keyword2 = ${keywordId}
    `;

    const combinedWordsCount = parseInt(combinedWordsBefore[0].count, 10);

    await sql`DELETE FROM keyword WHERE id = ${keywordId}`;

    const verifyKeywordDeleted = await sql`
      SELECT id FROM keyword WHERE id = ${keywordId}
    `;

    if (verifyKeywordDeleted.length > 0) {
      return {
        success: false as const,
        error: `Keyword "${keywordName}" was not deleted successfully`,
      };
    }

    const combinedWordsAfter = await sql<{ count: string }[]>`
      SELECT COUNT(*)::text AS count FROM combined_keywords
      WHERE fk_keyword1 = ${keywordId} OR fk_keyword2 = ${keywordId}
    `;

    const cascadeSuccess = parseInt(combinedWordsAfter[0].count, 10) === 0;

    if (!cascadeSuccess) {
      return {
        success: false as const,
        error: `Combined keywords still exist for keyword "${keywordName}"`,
      };
    }

    return {
      success: true as const,
      message: `Keyword "${keywordName}" and associated combinations deleted`,
      verification: {
        keywordDeleted: true,
        keywordId,
        keywordName,
        combinedWordsDeleted: combinedWordsCount,
        cascadeEffectConfirmed: cascadeSuccess,
      },
    };
  } catch (error) {
    console.error("Error deleting keyword:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteKeywordWithCascade(keyword: string) {
  try {
    const keywordResult = await sql<{ id: string }[]>`
      SELECT id FROM keyword WHERE keyword = ${keyword.trim()}
    `;

    if (keywordResult.length === 0) {
      return {
        success: false as const,
        error: `Keyword "${keyword}" not found`,
      };
    }

    return deleteKeywordById(keywordResult[0].id);
  } catch (error) {
    console.error("Error deleting keyword:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
