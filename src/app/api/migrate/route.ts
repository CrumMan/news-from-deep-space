import { NextResponse } from "next/server";
import { runMigrations } from "../../lib/server-functions/table-create-functions/table-create";
import { serverError } from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = request.headers.get("x-migrate-secret");
  if (process.env.MIGRATE_SECRET && secret !== process.env.MIGRATE_SECRET) {
    return NextResponse.json(
      { error: "Migration secret required" },
      { status: 401 },
    );
  }

  try {
    const result = await runMigrations();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Migration failed", error);
    return serverError(
      error instanceof Error ? error.message : "Migration failed",
    );
  }
}
