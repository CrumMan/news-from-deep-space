"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe2, Mountain, Rocket, Telescope } from "lucide-react";
import { useStreakIncrement } from "../../components/use-streak";

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  published_at: string;
  url: string;
  news_site: string;
}

// Placeholder articles database
const PLACEHOLDER_ARTICLES: Record<string, Article> = {
  "1": {
    id: "1",
    title: "NASA's Perseverance Rover Discovers Organic Matter on Mars",
    summary:
      "NASA's Perseverance rover has discovered complex organic matter in the Jezero Crater on Mars.",
    content: "Full content for Mars article...",
    image_url: "/placeholder-mars.jpg",
    published_at: "2024-01-15T10:00:00Z",
    url: "#",
    news_site: "NASA Space News",
  },
  "2": {
    id: "2",
    title: "James Webb Telescope Captures Stunning Image of Star Formation",
    summary:
      "The James Webb Space Telescope has captured an unprecedented image of star formation in the Orion Nebula.",
    content: "Full content for Webb telescope article...",
    image_url: "/placeholder-webb.jpg",
    published_at: "2024-01-14T15:30:00Z",
    url: "#",
    news_site: "Space Telescope Science Institute",
  },
  "3": {
    id: "3",
    title: "SpaceX Successfully Launches New Satellite Constellation",
    summary:
      "SpaceX has successfully deployed another batch of Starlink satellites.",
    content: "Full content for SpaceX article...",
    image_url: "/placeholder-spacex.jpg",
    published_at: "2024-01-13T09:15:00Z",
    url: "#",
    news_site: "SpaceFlight Now",
  },
  "4": {
    id: "4",
    title: "Astronomers Discover New Exoplanet in Habitable Zone",
    summary:
      "An international team has discovered a new exoplanet orbiting within the habitable zone.",
    content: "Full content for exoplanet article...",
    image_url: "/placeholder-exoplanet.jpg",
    published_at: "2024-01-12T14:45:00Z",
    url: "#",
    news_site: "Astronomy & Astrophysics",
  },
};

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useStreakIncrement();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);

        // **********************************************************************
        // API CALL - Uncomment when backend is ready

        // const response = await fetch(`/api/articles/${id}`);
        // if (!response.ok) throw new Error("Article not found");
        // const data = await response.json();
        // setArticle(data);

        // PLACEHOLDER - Remove when using API
        // ********************************************************************************
        setTimeout(() => {
          const articleData = PLACEHOLDER_ARTICLES[id as string];
          setArticle(articleData || null);
          setLoading(false);
        }, 500);

        setError(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(true);
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ color: "white", fontSize: "1.25rem" }}>
          Loading article...
        </div>
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
            The article you're looking for doesn't exist or couldn't be loaded.
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

        <div
          style={{
            width: "100%",
            height: "400px",
            marginBottom: "1.5rem",
            borderRadius: "8px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #7a5980 0%, #3b3b58 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div style={{ color: "#ffffff" }}>
              {article.id === "1" && (
                <Mountain size={56} strokeWidth={1.5} />
              )}
              {article.id === "2" && (
                <Telescope size={56} strokeWidth={1.5} />
              )}
              {article.id === "3" && <Rocket size={56} strokeWidth={1.5} />}
              {article.id === "4" && <Globe2 size={56} strokeWidth={1.5} />}
            </div>
            <div style={{ fontSize: "14px", color: "#bbbdf6" }}>
              {article.title}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>Article Image</div>
          </div>
        </div>

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
          }}
        >
          <span>Source: {article.news_site}</span>
          <span>
            Published: {new Date(article.published_at).toLocaleDateString()}
          </span>
        </div>

        <div>
          <p
            style={{
              fontSize: "1.125rem",
              marginBottom: "1.5rem",
              lineHeight: "1.6",
            }}
          >
            {article.summary}
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #7a5980",
            }}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: "#bbbdf6", marginBottom: "1rem" }}
            >
              Full Content
            </h2>
            <p style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
              {article.content}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #7a5980",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link href="/article" className="button-secondary">
            Back to Daily Article
          </Link>
        </div>
      </div>
    </div>
  );
}
