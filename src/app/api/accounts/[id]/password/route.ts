import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";
import { hashPassword, verifyPassword } from "../../../../lib/password";
import {
  badRequest,
  getToken,
  notFound,
  serverError,
  unauthorized,
} from "../../../../lib/api-helpers";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type Body = { currentPassword?: string; newPassword?: string };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const user = getToken(request);
  if (!user || user.accountId !== id) return unauthorized();

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const current = body.currentPassword ?? "";
  const next = body.newPassword ?? "";

  if (next.length < 6) {
    return badRequest("New password must be at least 6 characters");
  }

  try {
    const rows = await sql<{ password_hash: string }[]>`
      SELECT password_hash FROM account WHERE id = ${id}
    `;
    if (rows.length === 0) return notFound("Account not found");

    const matches = await verifyPassword(current, rows[0].password_hash);
    if (!matches) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const nextHash = await hashPassword(next);
    await sql`
      UPDATE account SET password_hash = ${nextHash} WHERE id = ${id}
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password change failed", error);
    return serverError();
  }
}
