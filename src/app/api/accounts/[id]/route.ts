import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import {
  badRequest,
  getToken,
  notFound,
  serverError,
  unauthorized,
} from "../../../lib/api-helpers";
import { deleteAccountById } from "../../../lib/server-functions/account-delete";
import { updateAccount } from "../../../lib/server-functions/account-update";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type AccountRow = {
  id: string;
  username: string;
  email:string;
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
      SELECT id, username,email, streak, last_active, is_admin, created_at
      FROM account WHERE id = ${id}
    `;
    if (rows.length === 0) return notFound("Account not found");
    const account = rows[0];
    return NextResponse.json({
      id: account.id,
      username: account.username,
      email:account.email,
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

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const user = getToken(request);
  if (!user || user.accountId !== id) return unauthorized();

  let body: { username?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  try {
    const result = await updateAccount(id, body);
    if (!result.success) return badRequest(result.error);
    const account = result.data;
    return NextResponse.json({
      id: account.id,
      username: account.username,
      email: account.email,
      streak: account.streak,
      isAdmin: account.is_admin,
    });
  } catch (error) {
    console.error("Account update failed", error);
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
