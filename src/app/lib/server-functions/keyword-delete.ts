import { sql } from "./database";

export async function deleteKeywordWithCascade(keyword: string) {
  try {
    //  get the keyword to verify it exists and get its ID
    const keywordResult = await sql`
      SELECT id, keyword, synonyms FROM keyword WHERE keyword = ${keyword.toLowerCase()}
    `;

    if (keywordResult.length === 0) {
      return {
        success: false,
        error: `Keyword "${keyword}" not found`,
      };
    }

    const keywordId = keywordResult[0].id;
    const keywordName = keywordResult[0].keyword;

    // Check how many combined words exist before deletion
    const combinedWordsBefore = await sql`
      SELECT COUNT(*) as count FROM combined_keywords 
      WHERE fk_keyword1 = ${keywordId} OR fk_keyword2 = ${keywordId}
    `;

    const combinedWordsCount = parseInt(combinedWordsBefore[0].count);

    // Delete the keyword
    await sql`
      DELETE FROM keyword WHERE id = ${keywordId}
    `;

    // VERIFICATION 1: Keyword is deleted from keyword table
    const verifyKeywordDeleted = await sql`
      SELECT id FROM keyword WHERE id = ${keywordId}
    `;

    if (verifyKeywordDeleted.length > 0) {
      return {
        success: false,
        error: `Keyword "${keyword}" was not deleted successfully`,
        verification: { keywordStillExists: true },
      };
    }

    // VERIFICATION 2: Combined words are also deleted (ON CASCADE effect)
    const combinedWordsAfter = await sql`
      SELECT COUNT(*) as count FROM combined_keywords 
      WHERE fk_keyword1 = ${keywordId} OR fk_keyword2 = ${keywordId}
    `;

    const cascadeSuccess = parseInt(combinedWordsAfter[0].count) === 0;

    if (!cascadeSuccess) {
      return {
        success: false,
        error: `Combined words still exist for keyword "${keyword}" - CASCADE failed`,
        verification: {
          combinedWordsRemaining: combinedWordsAfter[0].count,
        },
      };
    }

    return {
      success: true,
      message: `Keyword "${keywordName}" and all associated combined words have been deleted`,
      verification: {
        keywordDeleted: true,
        keywordId: keywordId,
        keywordName: keywordName,
        combinedWordsDeleted: combinedWordsCount,
        cascadeEffectConfirmed: cascadeSuccess,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error deleting keyword:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
