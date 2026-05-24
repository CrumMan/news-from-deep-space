import { NextResponse } from "next/server";
import { sql } from "../../lib/server-functions/database";

export async function GET() {
  try {
    const keywords = await sql`
      SELECT id, keyword, synonyms, created_at, updated_at 
      FROM keyword 
      ORDER BY keyword ASC
    `;

    return NextResponse.json({
      success: true,
      count: keywords.length,
      data: keywords,
    });
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
