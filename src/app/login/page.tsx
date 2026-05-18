"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      window.dispatchEvent(new Event("authChange"));

      router.push("/");
    }, 1000);
  };

  return (
    <div className="container">
      <div
        className="hero-card"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            className="text-3xl font-bold"
            style={{ color: "#bbbdf6", marginBottom: "0.5rem" }}
          >
            Welcome Back
          </h1>
          <p style={{ color: "#d1d5db" }}>
            Sign in to continue your space journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="enter@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
                marginTop: "0.25rem",
              }}
            >
              Password must be at least 6 characters
            </p>
          </div>

          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="button-primary"
            style={{ width: "100%" }}
          >
            {isLoading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="spinner"
                  style={{ marginRight: "0.5rem" }}
                ></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.875rem",
              color: "#9ca3af",
            }}
          >
            <p>Demo credentials (any valid email + password works)</p>
            <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
              Email: demo@example.com | Password: demo123
            </p>
          </div>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link
            href="/"
            style={{
              color: "#bbbdf6",
              textDecoration: "none",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
