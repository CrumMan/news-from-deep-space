"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiFetch, Account, saveSession } from "../admin/bot-config";

type LoginResponse = {
  token: string;
  account: Account;
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: { username: username.trim(), password },
      });
      saveSession(data.token, data.account);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setIsLoading(false);
    }
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
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="your-handle"
              autoComplete="username"
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
              autoComplete="current-password"
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
            <p>
              New here?{" "}
              <Link href="/signup" style={{ color: "#bbbdf6" }}>
                Create an account
              </Link>
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
