import { NextResponse } from "next/server";
import { signToken } from "../../lib/auth";
import { badRequest, serverError } from "../../lib/api-helpers";
import { createAccount } from "../../lib/server-functions/account-create";

export const dynamic = "force-dynamic";

type CreateBody = {
  username?: string;
  password?: string;
  email?:string;
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
  const email = body.email?.trim();

  if (!username || !password) {
    return badRequest("Username and password are required");
  }

  const result = await createAccount(username, password, email);
  if (!result.success) {
    const status = result.error === "Username already taken" ? 409 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const account = result.data;
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
}
