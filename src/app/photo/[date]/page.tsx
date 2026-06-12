"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStreakIncrement } from "../../components/use-streak";
import {
  DEFAULT_PHOTO_API,
  fetchContentApi,
  setContentApiCookie,
} from "../../lib/content-api-cookie";

type ApodPhoto = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
};

export default function PhotoDetailPage() {
  const { date } = useParams();
  const dateStr = typeof date === "string" ? date : "";
  const [photo, setPhoto] = useState<ApodPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  useStreakIncrement();

  const loadPhoto = useCallback(
    async (options?: { refresh?: boolean }) => {
      if (!dateStr) return;

      const isRefresh = options?.refresh === true;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const data = await fetchContentApi<ApodPhoto>("photo", "", {
          date: dateStr,
          ...(isRefresh ? { _: String(Date.now()) } : {}),
        });
        setPhoto(data);
        setError(false);
      } catch (err) {
        console.error("Photo load failed", err);
        if (!isRefresh) setError(true);
      } finally {
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
      }
    },
    [dateStr],
  );

  useEffect(() => {
    void loadPhoto();
  }, [loadPhoto]);

  const handleRefresh = () => {
    setContentApiCookie(DEFAULT_PHOTO_API, "photo");
    void loadPhoto({ refresh: true });
  };

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
        Loading space photo…
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="container">
        <div
          className="hero-card"
          style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
        >
          <h1 className="text-2xl" style={{ marginBottom: "1rem" }}>
            Photo Not Available
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#d1d5db" }}>
            Could not load the astronomy picture for this date.
          </p>
          <Link href="/recent-photos" className="button-primary">
            Browse Recent Photos
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = photo.hdurl || photo.url;

  return (
    <div className="container">
      <div
        className="hero-card"
        style={{ maxWidth: "900px", margin: "0 auto" }}
      >
        <Link
          href="/recent-photos"
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
          <span>Back to Recent Photos</span>
        </Link>

        <span
          style={{
            display: "inline-block",
            padding: "4px 12px",
            backgroundColor: "#7a5980",
            color: "white",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          NASA Astronomy Picture of the Day · {photo.date}
        </span>

        <h1
          className="text-3xl font-bold"
          style={{ color: "#bbbdf6", marginBottom: "1rem" }}
        >
          {photo.title}
        </h1>

        {photo.media_type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={photo.title}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          />
        ) : (
          <iframe
            title={photo.title}
            src={photo.url}
            style={{
              width: "100%",
              height: "480px",
              border: "none",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          />
        )}

        {photo.copyright && (
          <p style={{ fontSize: "0.875rem", color: "#d1d5db", marginBottom: "1rem" }}>
            © {photo.copyright}
          </p>
        )}

        <p style={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{photo.explanation}</p>

        <div style={{ marginTop: "2rem" }}>
          <button
            type="button"
            className="button-secondary"
            style={{ display: "inline-block" }}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "Refresh from API"}
          </button>
        </div>
      </div>
    </div>
  );
}
