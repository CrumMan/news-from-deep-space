import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";
import { requireAdmin, serverError } from "../../../../lib/api-helpers";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ keywordId: string }> };

export async function DELETE(request: Request, { params }: Params) {
  const { keywordId } = await params;
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;

  try {
    const rows = await sql<{ id: string }[]>`
      DELETE FROM combined_keywords
      WHERE fk_keyword1 = ${keywordId}
         OR fk_keyword2 = ${keywordId}
      RETURNING id
    `;
    return NextResponse.json({
      ok: true,
      deleted: rows.length,
      ids: rows.map((r) => r.id),
    });
  } catch (error) {
    console.error("Combination delete by keyword failed", error);
    return serverError();
  }
}
