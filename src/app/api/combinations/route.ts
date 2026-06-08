import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import {
  badRequest,
  requireAdmin,
  serverError,
} from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

type CombinationRow = {
  id: string;
  fk_keyword1: string;
  fk_keyword2: string;
  keyword1: string;
  keyword2: string;
  type: "api" | "link";
  result: string;
  api_key: string | null;
  created_at: string;
};

type CreateBody = {
  keywordId1?: string;
  keywordId2?: string;
  type?: string;
  result?: string;
  apiKey?: string | null;
};

export async function GET() {
  try {
    const rows = await sql<CombinationRow[]>`
      SELECT
        c.id,
        c.fk_keyword1, c.fk_keyword2,
        k1.keyword AS keyword1,
        k2.keyword AS keyword2,
        c.type, c.result, c.api_key, c.created_at
      FROM combined_keywords c
      JOIN keyword k1 ON k1.id = c.fk_keyword1
      JOIN keyword k2 ON k2.id = c.fk_keyword2
      ORDER BY c.created_at DESC
    `;
    return NextResponse.json({ combinations: rows });
  } catch (error) {
    console.error("Combinations list failed", error);
    return serverError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;

  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { keywordId1, keywordId2, type, result } = body;
  const apiKey = body.apiKey ?? null;

  if (!keywordId1 || !keywordId2) {
    return badRequest("Both keywordId1 and keywordId2 are required");
  }
  if (keywordId1 === keywordId2) {
    return badRequest("A combination requires two different keywords");
  }
  if (type !== "photo" && type !== "link") {
    return badRequest('type must be "photo" or "link"');
  }

  try {
    const keywords = await sql`
      SELECT id FROM keyword WHERE id IN (${keywordId1}, ${keywordId2})
    `;
    if (keywords.length !== 2) {
      return badRequest("One or both keyword IDs do not exist");
    }

    const rows = await sql<{ id: string }[]>`
      INSERT INTO combined_keywords (fk_keyword1, fk_keyword2, type, result, api_key)
      VALUES (${keywordId1}, ${keywordId2}, ${type}, ${result.trim()}, ${apiKey})
      RETURNING id
    `;
    return NextResponse.json({ id: rows[0].id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && /unordered_pair/i.test(error.message)) {
      return NextResponse.json(
        { error: "This combination already exists" },
        { status: 409 },
      );
    }
    console.error("Combination create failed", error);
    return serverError();
  }
}
