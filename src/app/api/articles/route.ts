import { NextResponse } from "next/server";
import { serverError } from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

const SFN_BASE = "https://api.spaceflightnewsapi.net/v4/articles";

export type ArticleSummary = {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  published_at: string;
  url: string;
  news_site: string;
};

type SfnArticle = {
  id: number;
  title: string;
  summary: string;
  image_url: string | null;
  published_at: string;
  url: string;
  news_site: string;
};

function mapArticle(a: SfnArticle): ArticleSummary {
  return {
    id: String(a.id),
    title: a.title,
    summary: a.summary,
    content: a.summary,
    image_url: a.image_url,
    published_at: a.published_at,
    url: a.url,
    news_site: a.news_site,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 10), 1), 50);

  try {
    const res = await fetch(`${SFN_BASE}/?limit=${limit}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not load articles" },
        { status: res.status },
      );
    }
    const data = (await res.json()) as { results: SfnArticle[] };
    const articles = (data.results ?? []).map(mapArticle);
    return NextResponse.json({ articles, daily: articles[0] ?? null });
  } catch (error) {
    console.error("Articles list failed", error);
    return serverError(error instanceof Error ? error.message : "Articles failed");
  }
}
