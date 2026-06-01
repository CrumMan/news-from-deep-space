"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, Account, saveSession } from "../admin/bot-config";

type CreateResponse = {
  token: string;
  account: Account;
};

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!trimmedUsername || !password || !confirmPassword || !trimmedEmail) {
      setError("Please fill in all fields");
      return;
    }
    if (trimmedUsername.length < 3 || trimmedUsername.length > 40) {
      setError("Username must be 3-40 characters");
      return;
    }

    if(!emailRegex.test(trimmedEmail)){
      setError("Please enter an email")
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<CreateResponse>("/api/accounts", {
        method: "POST",
        body: { username: trimmedUsername,email:trimmedEmail, password },
      });
      saveSession(data.token, data.account);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
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
        <h1
          style={{
            color: "#bbbdf6",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Sign Up
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#d1d5db",
          }}
        >
          Create your NFDS account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={isLoading}
            />
          </div>
            
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="button-primary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "0.875rem",
          }}
        >
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#bbbdf6" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
