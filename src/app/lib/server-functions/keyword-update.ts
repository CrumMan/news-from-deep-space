import { sql } from "./database";

export async function removeSynonymFromKeyword(
  keyword: string,
  synonymToRemove: string,
) {
  try {
    // Get current keyword
    const result = await sql`
      SELECT id, keyword, synonyms 
      FROM keyword 
      WHERE keyword = ${keyword.toLowerCase()}
    `;

    if (result.length === 0) {
      return {
        success: false,
        error: `Keyword "${keyword}" not found`,
      };
    }

    const currentSynonyms = result[0].synonyms || [];
    const synonymLower = synonymToRemove.toLowerCase();

    // Check if synonym exists
    if (!currentSynonyms.includes(synonymLower)) {
      return {
        success: false,
        error: `Synonym "${synonymToRemove}" not found for keyword "${keyword}"`,
        currentSynonyms: currentSynonyms,
      };
    }

    // Remove the synonym using array operations
    const updatedSynonyms = currentSynonyms.filter(
      (s: string) => s !== synonymLower,
    );

    // Update the keyword
    const updateResult = await sql`
      UPDATE keyword 
      SET synonyms = ${updatedSynonyms}, updated_at = NOW() 
      WHERE keyword = ${keyword.toLowerCase()} 
      RETURNING id, keyword, synonyms, updated_at
    `;

    return {
      success: true,
      message: `Synonym "${synonymToRemove}" removed from keyword "${keyword}"`,
      data: updateResult[0],
      verification: {
        removedSynonym: synonymToRemove,
        remainingSynonyms: updatedSynonyms,
      },
    };
  } catch (error) {
    console.error("Error removing synonym:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
