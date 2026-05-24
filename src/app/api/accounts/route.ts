import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import { hashPassword } from "../../lib/password";
import { signToken } from "../../lib/auth";
import { badRequest, serverError } from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

type CreateBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const username = body.username?.trim();
  const password = body.password ?? "";

  if (!username || username.length < 3 || username.length > 40) {
    return badRequest("Username must be 3-40 characters");
  }
  if (password.length < 6) {
    return badRequest("Password must be at least 6 characters");
  }

  try {
    const existing = await sql`
      SELECT id FROM account WHERE username = ${username}
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const rows = await sql<{ id: string; username: string; is_admin: boolean }[]>`
      INSERT INTO account (username, password_hash)
      VALUES (${username}, ${passwordHash})
      RETURNING id, username, is_admin
    `;
    const account = rows[0];

    const token = signToken({
      accountId: account.id,
      username: account.username,
      isAdmin: account.is_admin,
    });

    return NextResponse.json(
      {
        token,
        account: {
          id: account.id,
          username: account.username,
          isAdmin: account.is_admin,
          streak: 0,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Account create failed", error);
    return serverError("Could not create account");
  }
}
