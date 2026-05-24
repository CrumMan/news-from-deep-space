import { NextResponse } from "next/server";
import { sql } from "./db";
import { extractToken, verifyToken, TokenPayload } from "./auth";

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Not authenticated") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Admin access required") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function getToken(request: Request): TokenPayload | null {
  const token = extractToken(request.headers.get("authorization"));
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(request: Request): Promise<
  | { ok: true; user: TokenPayload }
  | { ok: false; response: ReturnType<typeof unauthorized> }
> {
  const user = getToken(request);
  if (!user) return { ok: false, response: unauthorized() };

  const rows = await sql<{ is_admin: boolean }[]>`
    SELECT is_admin FROM account WHERE id = ${user.accountId}
  `;
  if (rows.length === 0 || !rows[0].is_admin) {
    return { ok: false, response: forbidden() };
  }
  return { ok: true, user };
}
