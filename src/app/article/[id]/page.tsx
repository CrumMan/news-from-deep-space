"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStreakIncrement } from "../../components/use-streak";
import { fetchContentApi } from "../../lib/content-api-cookie";

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

export default function ArticleDetailPage() {
  const { id } = useParams();
  const articleId = typeof id === "string" ? id : "";
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useStreakIncrement();

  useEffect(() => {
    if (!articleId) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchContentApi<Article>("article", articleId);
        if (!cancelled) {
          setArticle(data);
          setError(false);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

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
        Loading article…
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
            Article Not Found
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#d1d5db" }}>
            The article you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
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
        style={{ maxWidth: "800px", margin: "0 auto" }}
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

        <p
          style={{
            fontSize: "1.125rem",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
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
            Read full story on {article.news_site}
            <ArrowRight size={14} />
          </a>
        )}

        <div style={{ marginTop: "2rem" }}>
          <Link href="/article" className="button-secondary">
            Back to Daily Article
          </Link>
        </div>
      </div>
    </div>
  );
}
