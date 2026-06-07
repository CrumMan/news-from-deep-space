import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import {
  badRequest,
  notFound,
  requireAdmin,
  serverError,
} from "../../../lib/api-helpers";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

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

type UpdateBody = {
  type?: string;
  result?: string;
  apiKey?: string | null;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
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
      WHERE c.id = ${id}
    `;
    if (rows.length === 0) return notFound("Combination not found");
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Combination read failed", error);
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

  if (body.type !== undefined && body.type !== "api" && body.type !== "link") {
    return badRequest('type must be "api" or "link"');
  }
  if (body.result !== undefined && body.result.trim().length === 0) {
    return badRequest("result cannot be empty");
  }
  if (
    body.type === undefined &&
    body.result === undefined &&
    body.apiKey === undefined
  ) {
    return badRequest("Provide type, result, or apiKey to update");
  }

  try {
    const rows = await sql<{ id: string }[]>`
      UPDATE combined_keywords SET
        type = COALESCE(${body.type ?? null}, type),
        result = COALESCE(${body.result?.trim() ?? null}, result),
        api_key = CASE WHEN ${body.apiKey !== undefined} THEN ${body.apiKey ?? null} ELSE api_key END
      WHERE id = ${id}
      RETURNING id
    `;
    if (rows.length === 0) return notFound("Combination not found");
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (error) {
    console.error("Combination update failed", error);
    return serverError();
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;

  try {
    await sql` 
    DELETE FROM api_config 
    WHERE combined_id = ${id}
    `;
    const rows = await sql<{ id: string }[]>`
    DELETE FROM combined_keywords WHERE id = ${id} RETURNING id
    `;
    if (rows.length === 0) return notFound("Combination not found");
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (error) {
    console.error("Combination delete failed", error);
    return serverError();
  }
}
