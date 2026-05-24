import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { verifyPassword } from "../../../lib/password";
import { signToken } from "../../../lib/auth";
import { badRequest, serverError } from "../../../lib/api-helpers";

export const dynamic = "force-dynamic";

type Body = { username?: string; password?: string };

type AccountRow = {
  id: string;
  username: string;
  password_hash: string;
  streak: number;
  is_admin: boolean;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const username = body.username?.trim();
  const password = body.password ?? "";

  if (!username || !password) {
    return badRequest("Username and password are required");
  }

  try {
    const rows = await sql<AccountRow[]>`
      SELECT id, username, password_hash, streak, is_admin
      FROM account WHERE username = ${username}
    `;
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const account = rows[0];
    const ok = await verifyPassword(password, account.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = signToken({
      accountId: account.id,
      username: account.username,
      isAdmin: account.is_admin,
    });

    return NextResponse.json({
      token,
      account: {
        id: account.id,
        username: account.username,
        streak: account.streak,
        isAdmin: account.is_admin,
      },
    });
  } catch (error) {
    console.error("Login failed", error);
    return serverError();
  }
}
