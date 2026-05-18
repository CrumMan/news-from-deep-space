"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  Newspaper,
  Rocket,
  Telescope,
} from "lucide-react";

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

// Placeholder data for main article
const PLACEHOLDER_ARTICLE: Article = {
  id: "1",
  title: "NASA's Perseverance Rover Discovers Organic Matter on Mars",
  summary:
    "NASA's Perseverance rover has discovered complex organic matter in the Jezero Crater on Mars, suggesting that the planet may have once harbored microbial life. This groundbreaking discovery could reshape our understanding of Mars' potential to support life.",
  content:
    "The Perseverance rover, which landed on Mars in February 2021, has been exploring the Jezero Crater - a 45-kilometer-wide basin that scientists believe was once home to an ancient river delta. The latest findings, published in Science magazine, reveal the presence of organic molecules preserved in rocks dating back billions of years.\n\nThese carbon-based molecules are the building blocks of life as we know it, though they can also be produced through non-biological processes. What makes this discovery particularly exciting is the context of the Jezero Crater, which provides the perfect environment for preserving signs of ancient life.\n\nThe rover's SHERLOC instrument detected the organic compounds using ultraviolet light. The team is now planning further analysis to determine whether these molecules could have biological origins.",
  image_url: "/placeholder-mars.jpg",
  published_at: new Date().toISOString(),
  url: "#",
  news_site: "NASA Space News",
};

// Placeholder for related articles data
const PLACEHOLDER_RELATED_ARTICLES: Article[] = [
  {
    id: "2",
    title: "James Webb Telescope Captures Stunning Image of Star Formation",
    summary:
      "The James Webb Space Telescope has captured an unprecedented image of star formation in the Orion Nebula.",
    content: "",
    image_url: "/placeholder-webb.jpg",
    published_at: "2024-01-14T15:30:00Z",
    url: "#",
    news_site: "Space Telescope Science Institute",
  },
  {
    id: "3",
    title: "SpaceX Successfully Launches New Satellite Constellation",
    summary:
      "SpaceX has successfully deployed another batch of Starlink satellites, expanding global internet coverage.",
    content: "",
    image_url: "/placeholder-spacex.jpg",
    published_at: "2024-01-13T09:15:00Z",
    url: "#",
    news_site: "SpaceFlight Now",
  },
  {
    id: "4",
    title: "Astronomers Discover New Exoplanet in Habitable Zone",
    summary:
      "An international team has discovered a new exoplanet orbiting within the habitable zone of its star.",
    content: "",
    image_url: "/placeholder-exoplanet.jpg",
    published_at: "2024-01-12T14:45:00Z",
    url: "#",
    news_site: "Astronomy & Astrophysics",
  },
];

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDailyArticle = async () => {
      try {
        setLoading(true);

        // ******************************************************************************
        // API CALL - Uncomment when backend is ready
        // This will fetch the featured article of the day

        // const articleResponse = await fetch(`/api/articles/daily`);
        // if (!articleResponse.ok) throw new Error("Article not found");
        // const articleData = await articleResponse.json();
        // setArticle(articleData);
        //
        // // Fetch related articles
        // const relatedResponse = await fetch(`/api/articles/related`);
        // const relatedData = await relatedResponse.json();
        // setRelatedArticles(relatedData);

        // PLACEHOLDER - Remove when using API
        // *********************************************************************************
        setTimeout(() => {
          const dailyContent = {
            ...PLACEHOLDER_ARTICLE,
            published_at: new Date().toISOString(),
            title: `Daily Space Discovery - ${new Date().toLocaleDateString()}`,
          };
          setArticle(dailyContent);
          setRelatedArticles(PLACEHOLDER_RELATED_ARTICLES);
          setLoading(false);
        }, 500);

        setError(false);
      } catch (error) {
        console.error("Error fetching daily article:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchDailyArticle();
  }, []);

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
          Loading today's featured article...
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
            Article Not Available
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#d1d5db" }}>
            The daily article couldn't be loaded. Please check back later.
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

        {/* Daily Badge */}
        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              backgroundColor: "#7a5980",
              color: "white",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            Featured Article of the Day · {new Date().toLocaleDateString()}
          </span>
        </div>

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
            <Newspaper size={56} strokeWidth={1.5} color="#ffffff" />
            <div style={{ fontSize: "14px", color: "#bbbdf6" }}>
              Daily Space Feature
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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/article/${relatedArticle.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "rgba(59, 59, 88, 0.5)",
                    borderRadius: "8px",
                    padding: "1rem",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Thumbnail Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      marginBottom: "0.75rem",
                      borderRadius: "6px",
                      overflow: "hidden",
                      background:
                        "linear-gradient(135deg, #7a5980 0%, #3b3b58 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ color: "#ffffff" }}>
                      {relatedArticle.id === "2" && (
                        <Telescope size={48} strokeWidth={1.5} />
                      )}
                      {relatedArticle.id === "3" && (
                        <Rocket size={48} strokeWidth={1.5} />
                      )}
                      {relatedArticle.id === "4" && (
                        <Globe2 size={48} strokeWidth={1.5} />
                      )}
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#bbbdf6",
                      marginBottom: "0.5rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {relatedArticle.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#d1d5db",
                      marginBottom: "0.5rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {relatedArticle.summary.substring(0, 100)}...
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.7rem",
                      color: "#9ca3af",
                    }}
                  >
                    <span>{relatedArticle.news_site}</span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      Read More
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
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
          <Link href="/" style={{ color: "#bbbdf6", textDecoration: "none" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
