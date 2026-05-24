import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import {
  badRequest,
  notFound,
  requireAdmin,
  serverError,
} from "../../../lib/api-helpers";
import { deleteKeywordById } from "../../../lib/server-functions/keyword-delete";
import { updateKeywordById } from "../../../lib/server-functions/keyword-update";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type KeywordRow = {
  id: string;
  keyword: string;
  synonyms: string[];
  created_at: string;
};

type UpdateBody = {
  keyword?: string;
  synonyms?: string[];
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const rows = await sql<KeywordRow[]>`
      SELECT id, keyword, synonyms, created_at
      FROM keyword WHERE id = ${id}
    `;
    if (rows.length === 0) return notFound("Keyword not found");
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Keyword read failed", error);
    return serverError();
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const keyword = body.keyword?.trim();
  const synonyms = Array.isArray(body.synonyms)
    ? body.synonyms.map((s) => String(s).trim()).filter(Boolean)
    : undefined;

  if (!keyword && synonyms === undefined) {
    return badRequest("Provide keyword or synonyms to update");
  }
  if (keyword !== undefined && (keyword.length === 0 || keyword.length > 100)) {
    return badRequest("Keyword must be 1-100 characters");
  }

  const result = await updateKeywordById(id, { keyword, synonyms });
  if (!result.success) {
    const status = result.error === "Keyword not found" ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data);
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;

  const result = await deleteKeywordById(id);
  if (!result.success) {
    const status = result.error === "Keyword not found" ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, id, verification: result.verification });
}
