import { NextResponse } from "next/server";
import { badRequest, serverError } from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  if (!target) return badRequest("url query parameter is required");

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return badRequest("Invalid url");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return badRequest("Only http(s) URLs are allowed");
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: text || `Upstream error (${res.status})` },
        { status: res.status },
      );
    }
    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ raw: text });
    }
  } catch (error) {
    console.error("Proxy fetch failed", error);
    return serverError(error instanceof Error ? error.message : "Proxy failed");
  }
}
