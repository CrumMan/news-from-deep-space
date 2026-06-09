import { NextResponse } from "next/server";
import { nasaApodUrl, type ApodPhoto } from "../../lib/nasa";
import { badRequest, serverError } from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

export type { ApodPhoto };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date")?.trim();

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return badRequest("date must be YYYY-MM-DD");
  }

  try {
    const res = await fetch(nasaApodUrl({ date: date ?? undefined }), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text || "NASA APOD request failed" },
        { status: res.status },
      );
    }
    const data = (await res.json()) as ApodPhoto;
    return NextResponse.json({
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      hdurl: data.hdurl,
      media_type: data.media_type,
      copyright: data.copyright,
    });
  } catch (error) {
    console.error("APOD fetch failed", error);
    return serverError(error instanceof Error ? error.message : "APOD fetch failed");
  }
}
