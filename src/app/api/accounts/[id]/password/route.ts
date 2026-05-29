import { NextResponse } from "next/server";
import {
  badRequest,
  getToken,
  notFound,
  serverError,
  unauthorized,
} from "../../../../lib/api-helpers";
import { changeAccountPassword } from "../../../../lib/server-functions/account-change-password";

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

  const result = await changeAccountPassword(id, current, next);
  if (!result.success) {
    if (result.error === "Account not found") return notFound(result.error);
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
