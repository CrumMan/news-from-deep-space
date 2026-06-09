import { NextResponse } from "next/server";
import { notFound, serverError } from "../../../lib/api-helpers";
import type { ArticleSummary } from "../route";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type SfnArticle = {
  id: number;
  title: string;
  summary: string;
  image_url: string | null;
  published_at: string;
  url: string;
  news_site: string;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const res = await fetch(
      `https://api.spaceflightnewsapi.net/v4/articles/${encodeURIComponent(id)}`,
      { next: { revalidate: 600 } },
    );
    if (res.status === 404) return notFound("Article not found");
    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not load article" },
        { status: res.status },
      );
    }
    const a = (await res.json()) as SfnArticle;
    const article: ArticleSummary = {
      id: String(a.id),
      title: a.title,
      summary: a.summary,
      content: a.summary,
      image_url: a.image_url,
      published_at: a.published_at,
      url: a.url,
      news_site: a.news_site,
    };
    return NextResponse.json(article);
  } catch (error) {
    console.error("Article read failed", error);
    return serverError(error instanceof Error ? error.message : "Article failed");
  }
}
