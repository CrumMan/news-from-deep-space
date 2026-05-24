import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import {
  badRequest,
  requireAdmin,
  serverError,
} from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

type KeywordRow = {
  id: string;
  keyword: string;
  synonyms: string[];
  created_at: string;
};

type CreateBody = {
  keyword?: string;
  synonyms?: string[];
};

export async function GET() {
  try {
    const rows = await sql<KeywordRow[]>`
      SELECT id, keyword, synonyms, created_at
      FROM keyword
      ORDER BY keyword ASC
    `;
    return NextResponse.json({ keywords: rows });
  } catch (error) {
    console.error("Keyword list failed", error);
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

  const keyword = body.keyword?.trim();
  const synonyms = Array.isArray(body.synonyms)
    ? body.synonyms.map((s) => String(s).trim()).filter(Boolean)
    : [];

  if (!keyword) return badRequest("Keyword is required");
  if (keyword.length > 100) return badRequest("Keyword too long (max 100)");

  try {
    const existing = await sql`SELECT id FROM keyword WHERE keyword = ${keyword}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Keyword already exists" },
        { status: 409 },
      );
    }

    const rows = await sql<KeywordRow[]>`
      INSERT INTO keyword (keyword, synonyms)
      VALUES (${keyword}, ${synonyms})
      RETURNING id, keyword, synonyms, created_at
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Keyword create failed", error);
    return serverError();
  }
}
