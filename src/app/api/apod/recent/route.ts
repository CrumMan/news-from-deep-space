import { NextResponse } from "next/server";
import { nasaApodUrl, type ApodPhoto } from "../../../lib/nasa";
import { serverError } from "../../../lib/api-helpers";

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function recentDates(count: number): string[] {
  const dates: string[] = [];
  const end = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

async function fetchApodForDate(date: string): Promise<ApodPhoto | null> {
  try {
    const res = await fetch(nasaApodUrl({ date }), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as ApodPhoto;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(Math.max(Number(searchParams.get("count") ?? 12), 1), 30);

  try {
    const results = await Promise.all(
      recentDates(count).map((date) => fetchApodForDate(date)),
    );

    const photos = results
      .filter((p): p is ApodPhoto => p !== null && p.media_type === "image")
      .map((p) => ({
        date: p.date,
        title: p.title,
        explanation: p.explanation,
        url: p.url,
        hdurl: p.hdurl,
        media_type: p.media_type,
        copyright: p.copyright,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    if (photos.length === 0) {
      return NextResponse.json(
        { error: "No recent photos could be loaded from NASA" },
        { status: 502 },
      );
    }

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Recent APOD fetch failed", error);
    return serverError(error instanceof Error ? error.message : "Recent APOD failed");
  }
}
