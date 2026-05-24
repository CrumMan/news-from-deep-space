import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";
import {
  getToken,
  notFound,
  serverError,
  unauthorized,
} from "../../../../lib/api-helpers";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type StreakRow = {
  id: string;
  streak: number;
  last_active: string | null;
};

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const user = getToken(request);
  if (!user || user.accountId !== id) return unauthorized();

  try {
    const rows = await sql<StreakRow[]>`
      SELECT id, streak, last_active FROM account WHERE id = ${id}
    `;
    if (rows.length === 0) return notFound("Account not found");

    const updated = await sql<StreakRow[]>`
      UPDATE account
      SET
        streak = CASE
          WHEN last_active = CURRENT_DATE THEN streak
          WHEN last_active = CURRENT_DATE - INTERVAL '1 day' THEN streak + 1
          ELSE 1
        END,
        last_active = CURRENT_DATE
      WHERE id = ${id}
      RETURNING id, streak, last_active
    `;

    return NextResponse.json({
      streak: updated[0].streak,
      lastActive: updated[0].last_active,
    });
  } catch (error) {
    console.error("Streak update failed", error);
    return serverError();
  }
}
