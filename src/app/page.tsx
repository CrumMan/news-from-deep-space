"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStreakIncrement } from "./components/use-streak";
import ContentApiLink from "./components/content-api-link";
import {
  DEFAULT_ARTICLE_API,
  DEFAULT_PHOTO_API,
} from "./lib/content-api-cookie";

type ApodPhoto = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: string;
};

type ArticlePreview = {
  id: string;
  title: string;
  summary: string;
  image_url: string | null;
};

export default function HomePage() {
  const [dailyPhoto, setDailyPhoto] = useState<ApodPhoto | null>(null);
  const [dailyArticle, setDailyArticle] = useState<ArticlePreview | null>(null);
  useStreakIncrement();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [photoRes, articleRes] = await Promise.all([
          fetch("/api/apod"),
          fetch("/api/articles?limit=1"),
        ]);
        if (cancelled) return;
        if (photoRes.ok) {
          setDailyPhoto((await photoRes.json()) as ApodPhoto);
        }
        if (articleRes.ok) {
          const data = (await articleRes.json()) as {
            daily: ArticlePreview | null;
          };
          setDailyArticle(data.daily);
        }
      } catch (err) {
        console.error("Home feed load failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              dailyPhoto?.media_type === "image"
                ? `url('${dailyPhoto.url}')`
                : "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
            padding: "0 20px",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ color: "#bbbdf6" }}>News From</span>{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Deep Space
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              maxWidth: "600px",
              marginBottom: "2rem",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Discover the wonders of the universe through daily astronomy photos
            and the latest space articles
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <ContentApiLink
              href="/article"
              apiUrl={DEFAULT_ARTICLE_API}
              kind="article"
              className="button-primary"
            >
              Read Daily Article
            </ContentApiLink>
            <ContentApiLink
              href="/recent-photos"
              apiUrl={DEFAULT_PHOTO_API}
              kind="photo"
              className="button-secondary"
            >
              View Space Photos
            </ContentApiLink>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero-card">
          <div className="grid-2">
            <div className="card">
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#bbbdf6", marginBottom: "1rem" }}
              >
                Daily Space Photo
              </h2>
              {dailyPhoto ? (
                <>
                  <ContentApiLink
                    href={`/photo/${dailyPhoto.date}`}
                    apiUrl={DEFAULT_PHOTO_API}
                    kind="photo"
                  >
                    <div
                      style={{
                        position: "relative",
                        height: "200px",
                        marginBottom: "1rem",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#2a2a4a",
                      }}
                    >
                      {dailyPhoto.media_type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={dailyPhoto.url}
                          alt={dailyPhoto.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#bbbdf6",
                          }}
                        >
                          Video APOD
                        </div>
                      )}
                    </div>
                  </ContentApiLink>
                  <h3 className="card-title">{dailyPhoto.title}</h3>
                  <p className="card-description">
                    {dailyPhoto.explanation.substring(0, 150)}…
                  </p>
                  <ContentApiLink
                    href={`/photo/${dailyPhoto.date}`}
                    apiUrl={DEFAULT_PHOTO_API}
                    kind="photo"
                    className="card-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span>View Description</span>
                    <ArrowRight size={14} />
                  </ContentApiLink>
                </>
              ) : (
                <p className="card-description">Loading today&apos;s photo…</p>
              )}
            </div>

            <div className="card">
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#bbbdf6", marginBottom: "1rem" }}
              >
                Featured Article
              </h2>
              {dailyArticle ? (
                <>
                  <ContentApiLink
                    href={`/article/${dailyArticle.id}`}
                    apiUrl={DEFAULT_ARTICLE_API}
                    kind="article"
                  >
                    <div
                      style={{
                        position: "relative",
                        height: "200px",
                        marginBottom: "1rem",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#2a2a4a",
                      }}
                    >
                      {dailyArticle.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={dailyArticle.image_url}
                          alt={dailyArticle.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            color: "#111",
                          }}
                        >
                          Space News
                        </div>
                      )}
                    </div>
                  </ContentApiLink>
                  <h3 className="card-title">{dailyArticle.title}</h3>
                  <p className="card-description">
                    {dailyArticle.summary.substring(0, 150)}…
                  </p>
                  <ContentApiLink
                    href={`/article/${dailyArticle.id}`}
                    apiUrl={DEFAULT_ARTICLE_API}
                    kind="article"
                    className="card-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span>Read Full Article</span>
                    <ArrowRight size={14} />
                  </ContentApiLink>
                </>
              ) : (
                <p className="card-description">Loading featured article…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
