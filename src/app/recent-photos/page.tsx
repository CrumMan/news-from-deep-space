"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ContentApiLink from "../components/content-api-link";
import { DEFAULT_PHOTO_API } from "../lib/content-api-cookie";

type ApodPhoto = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
};

export default function RecentPhotosPage() {
  const [photos, setPhotos] = useState<ApodPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/apod/recent?count=12");
        if (!res.ok) throw new Error("Failed to load photos");
        const data = (await res.json()) as { photos: ApodPhoto[] };
        if (!cancelled) {
          setPhotos(data.photos ?? []);
          setError(false);
        }
      } catch (err) {
        console.error(err);
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
        Loading recent space photos…
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hero-card" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            color: "#bbbdf6",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "1.5rem",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold" style={{ color: "#bbbdf6", marginBottom: "0.5rem" }}>
          Recent Space Photos
        </h1>
        <p style={{ color: "#d1d5db", marginBottom: "2rem" }}>
          NASA Astronomy Pictures of the Day from the last two weeks
        </p>

        {error || photos.length === 0 ? (
          <p style={{ color: "#fecaca" }}>No photos could be loaded right now.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {photos.map((photo) => (
              <ContentApiLink
                key={photo.date}
                href={`/photo/${photo.date}`}
                apiUrl={DEFAULT_PHOTO_API}
                kind="photo"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "rgba(59, 59, 88, 0.5)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "100%",
                    transition: "transform 0.2s ease",
                  }}
                >
                  {photo.media_type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.url}
                      alt={photo.title}
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "180px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#3b3b58",
                        color: "#bbbdf6",
                      }}
                    >
                      Video APOD
                    </div>
                  )}
                  <div style={{ padding: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "#bbbdf6", marginBottom: "0.35rem" }}>
                      {photo.date}
                    </p>
                    <h3 style={{ color: "white", fontSize: "1rem", margin: 0 }}>
                      {photo.title}
                    </h3>
                    <p
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.8rem",
                        marginTop: "0.5rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {photo.explanation.slice(0, 100)}…
                    </p>
                  </div>
                </div>
              </ContentApiLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
