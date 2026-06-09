"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, KeyRound, LogOut, Trash2 } from "lucide-react";
import {
  apiFetch,
  getCurrentAccount,
  saveSession,
  updateAccountProfile,
} from "../admin/bot-config";

type AccountDetails = {
  id: string;
  username: string;
  email:string;
  streak: number;
  lastActive: string | null;
  isAdmin: boolean;
  createdAt: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const session = getCurrentAccount();
    if (!session) {
      router.replace("/login");
      return;
    }
    apiFetch<AccountDetails>(`/api/accounts/${session.id}`)
      .then((details) => {
        setAccount(details);
        setEditUsername(details.username);
        setEditEmail(details.email);
        saveSession(localStorage.getItem("authToken") ?? "", {
          id: details.id,
          username: details.username,
          email:details.email,
          streak: details.streak,
          isAdmin: details.isAdmin,
        });
      })
      .catch((err: Error) => setError(err.message || "Could not load account"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }
    if (!account) return;

    setPwLoading(true);
    try {
      await apiFetch(`/api/accounts/${account.id}/password`, {
        method: "PUT",
        body: { currentPassword, newPassword },
      });
      setPwSuccess("Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(
        err instanceof Error ? err.message : "Could not change password",
      );
    } finally {
      setPwLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    if (!account) return;

    setProfileLoading(true);
    try {
      const updated = await updateAccountProfile(account.id, {
        username: editUsername.trim(),
        email: editEmail.trim(),
      });
      setAccount({ ...account, username: updated.username, email: updated.email });
      saveSession(localStorage.getItem("authToken") ?? "", {
        id: account.id,
        username: updated.username,
        email: updated.email,
        streak: account.streak,
        isAdmin: account.isAdmin,
      });
      setProfileSuccess("Profile updated.");
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Could not update profile",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={{ color: "#c7c7e6" }}>Loading account…</div>
      </main>
    );
  }

  if (error || !account) {
    return (
      <main style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ marginBottom: "1rem" }}>Account unavailable</h1>
          <p style={{ color: "#fecaca" }}>{error ?? "Please sign in again."}</p>
          <Link
            href="/login"
            className="button-primary"
            style={{ display: "inline-block", marginTop: "1.5rem" }}
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const memberSince = new Date(account.createdAt).toLocaleDateString();

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem", textAlign: "center" }}>
          My Account
        </h1>
        <p style={{ textAlign: "center", color: "#c7c7e6", marginBottom: "2rem" }}>
          Manage your profile and space activity
        </p>

        <div style={sectionStyle}>
          <h2 style={{ margin: 0, marginBottom: "1rem" }}>Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                disabled={profileLoading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                disabled={profileLoading}
              />
            </div>
            {profileError && (
              <div className="error-message">
                <p className="error-text">{profileError}</p>
              </div>
            )}
            {profileSuccess && (
              <p style={{ color: "#86efac", marginBottom: "1rem" }}>{profileSuccess}</p>
            )}
            <button type="submit" className="button-primary" disabled={profileLoading}>
              {profileLoading ? "Saving…" : "Save Profile"}
            </button>
          </form>
          <div style={{ lineHeight: 1.8, marginTop: "1.25rem" }}>
            <p style={rowStyle}>
              <strong>Role:</strong>
              <span>{account.isAdmin ? "Admin" : "Member"}</span>
            </p>
            <p style={rowStyle}>
              <strong>Member since:</strong>
              <span>{memberSince}</span>
            </p>
          </div>
        </div>

        <div style={streakCardStyle}>
          <Flame size={36} color="#ffb347" />
          <div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#c7c7e6" }}>
              Smart Streak
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "2rem",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {account.streak} {account.streak === 1 ? "day" : "days"}
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#c7c7e6" }}>
              {account.lastActive
                ? `Last active ${new Date(account.lastActive).toLocaleDateString()}`
                : "No activity yet — view an article or photo to start your streak."}
            </p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ margin: 0, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <KeyRound size={20} /> Change Password
          </h2>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                disabled={pwLoading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={pwLoading}
              />
            </div>
            {pwError && (
              <div className="error-message">
                <p className="error-text">{pwError}</p>
              </div>
            )}
            {pwSuccess && (
              <p style={{ color: "#86efac", marginBottom: "1rem" }}>{pwSuccess}</p>
            )}
            <button type="submit" className="button-primary" disabled={pwLoading}>
              {pwLoading ? "Saving…" : "Change Password"}
            </button>
          </form>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <Link
            href="/account/delete-account"
            style={{ ...actionButtonStyle, background: "#8b7cf6" }}
          >
            <Trash2 size={16} />
            <span>Delete Account</span>
          </Link>
          <Link
            href="/logout"
            style={{ ...actionButtonStyle, background: "#ff5f8a" }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#2e3156",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const cardStyle: React.CSSProperties = {
  background: "#3a3d5c",
  padding: "40px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "720px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  color: "white",
};

const sectionStyle: React.CSSProperties = {
  background: "#4a4d73",
  padding: "1.5rem",
  borderRadius: "14px",
  marginBottom: "1.5rem",
};

const rowStyle: React.CSSProperties = {
  margin: 0,
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
};

const streakCardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255, 179, 71, 0.15) 0%, rgba(255, 95, 138, 0.15) 100%)",
  border: "1px solid rgba(255, 179, 71, 0.25)",
  padding: "1.25rem",
  borderRadius: "14px",
  marginBottom: "1.5rem",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const actionButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "14px",
  borderRadius: "12px",
  color: "white",
  fontSize: "16px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  fontWeight: 500,
};
