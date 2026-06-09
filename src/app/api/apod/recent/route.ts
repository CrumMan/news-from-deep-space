import { NextResponse } from "next/server";
import { nasaApodUrl } from "../../../lib/nasa";
import { serverError } from "../../../lib/api-helpers";
import type { ApodPhoto } from "../../../lib/nasa";

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(Math.max(Number(searchParams.get("count") ?? 12), 1), 30);

  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - (count - 1));

  try {
    const res = await fetch(
      nasaApodUrl({
        startDate: formatDate(start),
        endDate: formatDate(end),
      }),
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text || "NASA APOD request failed" },
        { status: res.status },
      );
    }
    const data = (await res.json()) as ApodPhoto | ApodPhoto[];
    const photos = Array.isArray(data) ? data : [data];
    return NextResponse.json({
      photos: photos
        .filter((p) => p.media_type === "image")
        .map((p) => ({
          date: p.date,
          title: p.title,
          explanation: p.explanation,
          url: p.url,
          hdurl: p.hdurl,
          media_type: p.media_type,
          copyright: p.copyright,
        }))
        .reverse(),
    });
  } catch (error) {
    console.error("Recent APOD fetch failed", error);
    return serverError(error instanceof Error ? error.message : "Recent APOD failed");
  }
}
