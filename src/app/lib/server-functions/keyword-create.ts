import { sql } from "./database";

export async function createKeywordWithSynonyms(
  keyword: string,
  synonyms: string[],
) {
  try {
    // Check if keyword already exists
    const existingKeyword = await sql`
      SELECT id FROM keyword WHERE keyword = ${keyword.toLowerCase()}
    `;

    if (existingKeyword.length > 0) {
      return {
        success: false,
        error: `Keyword "${keyword}" already exists`,
      };
    }

    // Remove duplicates and convert to lowercase
    const uniqueSynonyms = [...new Set(synonyms.map((s) => s.toLowerCase()))];

    // Insert new keyword with synonyms as array
    const result = await sql`
      INSERT INTO keyword (keyword, synonyms, created_at, updated_at) 
      VALUES (${keyword.toLowerCase()}, ${uniqueSynonyms}, NOW(), NOW()) 
      RETURNING id, keyword, synonyms, created_at, updated_at
    `;

    console.log("Saved to DB:", result[0]); // Verify saved data

    return {
      success: true,
      message: `Keyword "${keyword}" created successfully with ${uniqueSynonyms.length} synonyms`,
      data: result[0],
    };
  } catch (error) {
    console.error("Error creating keyword:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
