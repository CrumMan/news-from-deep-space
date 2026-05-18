"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const PLACEHOLDER_PHOTO = {
  title: "The Majestic Andromeda Galaxy",
  url: "/placeholder-space.jpg",
  explanation:
    "The Andromeda Galaxy is a barred spiral galaxy approximately 2.5 million light-years from Earth. It's the nearest major galaxy to the Milky Way and contains about one trillion stars.",
  date: "2024-01-15",
};

const PLACEHOLDER_ARTICLE = {
  id: "1",
  title: "NASA's Perseverance Rover Discovers Organic Matter on Mars",
  summary:
    "NASA's Perseverance rover has discovered complex organic matter in the Jezero Crater on Mars, suggesting that the planet may have once harbored microbial life.",
  imageUrl: "/placeholder-mars.jpg",
  content: "Full article content would go here...",
  published_at: "2024-01-15",
  news_site: "Space News Daily",
  url: "#",
};

export default function HomePage() {
  const [dailyPhoto, setDailyPhoto] = useState(PLACEHOLDER_PHOTO);
  const [dailyArticle, setDailyArticle] = useState(PLACEHOLDER_ARTICLE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
  };

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
              "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
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
            <Link href="/article" className="button-primary">
              Read Daily Article
            </Link>
            <Link href="/recent-photos" className="button-secondary">
              View Space Photos
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero-card">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {/* {isLoggedIn ? (
              <button onClick={handleLogout} className="button-secondary">
                Logout
              </button>
            ) : (
              <Link href="/login" className="button-secondary">
                Login
              </Link>
            )} */}
          </div>

          <div className="grid-2">
            <div className="card">
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#bbbdf6", marginBottom: "1rem" }}
              >
                Daily Space Photo
              </h2>
              <Link href={`/photo/${dailyPhoto.date}`}>
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    marginBottom: "1rem",
                    backgroundColor: "#2a2a4a",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <span style={{ color: "#000", fontSize: "14px" }}>
                      Space Image Placeholder
                    </span>
                  </div>
                </div>
              </Link>
              <h3 className="card-title">{dailyPhoto.title}</h3>
              <p className="card-description">
                {dailyPhoto.explanation.substring(0, 150)}...
              </p>
              <Link
                href={`/photo/${dailyPhoto.date}`}
                className="card-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>View Description</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="card">
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#bbbdf6", marginBottom: "1rem" }}
              >
                Featured Article
              </h2>
              <Link href="/article">
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    marginBottom: "1rem",
                    backgroundColor: "#2a2a4a",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    }}
                  >
                    <span style={{ color: "black", fontSize: "14px" }}>
                      Article Image Placeholder
                    </span>
                  </div>
                </div>
              </Link>
              <h3 className="card-title">{dailyArticle.title}</h3>
              <p className="card-description">
                {dailyArticle.summary.substring(0, 150)}...
              </p>
              <Link
                href="/article"
                className="card-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>Read Full Article</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
