import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import {
  getToken,
  notFound,
  serverError,
  unauthorized,
} from "../../../lib/api-helpers";
import { deleteAccountById } from "../../../lib/server-functions/account-delete";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type AccountRow = {
  id: string;
  username: string;
  streak: number;
  last_active: string | null;
  is_admin: boolean;
  created_at: string;
};

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = getToken(request);
  if (!user || user.accountId !== id) return unauthorized();

  try {
    const rows = await sql<AccountRow[]>`
      SELECT id, username, streak, last_active, is_admin, created_at
      FROM account WHERE id = ${id}
    `;
    if (rows.length === 0) return notFound("Account not found");
    const account = rows[0];
    return NextResponse.json({
      id: account.id,
      username: account.username,
      streak: account.streak,
      lastActive: account.last_active,
      isAdmin: account.is_admin,
      createdAt: account.created_at,
    });
  } catch (error) {
    console.error("Account read failed", error);
    return serverError();
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const user = getToken(request);
  if (!user || user.accountId !== id) return unauthorized();

  try {
    const result = await deleteAccountById(id);
    if (!result.success) return notFound(result.error);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Account delete failed", error);
    return serverError();
  }
}
