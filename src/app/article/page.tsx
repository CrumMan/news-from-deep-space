"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ContentApiLink from "../components/content-api-link";
import { useStreakIncrement } from "../components/use-streak";
import {
  DEFAULT_ARTICLE_API,
  fetchContentApi,
} from "../lib/content-api-cookie";

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  published_at: string;
  url: string;
  news_site: string;
}

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useStreakIncrement();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchContentApi<{ articles: Article[]; daily: Article | null }>(
          "article",
          "",
          { limit: "10" },
        );
        if (cancelled) return;
        const featured = data.daily ?? data.articles[0] ?? null;
        setArticle(featured);
        setRelatedArticles(
          data.articles.filter((a) => a.id !== featured?.id).slice(0, 3),
        );
        setError(!featured);
      } catch (err) {
        console.error("Error fetching daily article:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "white",
        }}
      >
        Loading today&apos;s featured article…
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container">
        <div
          className="hero-card"
          style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
        >
          <h1 className="text-2xl" style={{ marginBottom: "1rem" }}>
            Article Not Available
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#d1d5db" }}>
            The daily article couldn&apos;t be loaded. Please check back later.
          </p>
          <Link href="/" className="button-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        className="hero-card"
        style={{ maxWidth: "900px", margin: "0 auto" }}
      >
        <Link
          href="/"
          style={{
            color: "#bbbdf6",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              backgroundColor: "#7a5980",
              color: "white",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Featured Article · {new Date(article.published_at).toLocaleDateString()}
          </span>
        </div>

        {article.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          />
        )}

        <h1
          className="text-3xl font-bold"
          style={{ color: "#bbbdf6", marginBottom: "1rem" }}
        >
          {article.title}
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
            color: "#d1d5db",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span>Source: {article.news_site}</span>
          <span>
            Published: {new Date(article.published_at).toLocaleDateString()}
          </span>
        </div>

        <p style={{ fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          {article.summary}
        </p>

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="button-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            Read on {article.news_site}
            <ArrowRight size={14} />
          </a>
        )}

        {relatedArticles.length > 0 && (
          <div
            style={{
              marginTop: "3rem",
              paddingTop: "2rem",
              borderTop: "2px solid #7a5980",
            }}
          >
            <h2
              className="text-2xl font-semibold"
              style={{ color: "#bbbdf6", marginBottom: "1.5rem" }}
            >
              More Articles You Might Like
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {relatedArticles.map((related) => (
                <ContentApiLink
                  key={related.id}
                  href={`/article/${related.id}`}
                  apiUrl={DEFAULT_ARTICLE_API}
                  kind="article"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "rgba(59, 59, 88, 0.5)",
                      borderRadius: "8px",
                      padding: "1rem",
                      height: "100%",
                    }}
                  >
                    {related.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={related.image_url}
                        alt={related.title}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginBottom: "0.75rem",
                        }}
                      />
                    )}
                    <h3 style={{ color: "#bbbdf6", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      {related.title}
                    </h3>
                    <p style={{ color: "#d1d5db", fontSize: "0.8rem" }}>
                      {related.summary.slice(0, 100)}…
                    </p>
                  </div>
                </ContentApiLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
