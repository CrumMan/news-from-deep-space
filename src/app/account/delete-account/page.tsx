"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  apiFetch,
  clearSession,
  getCurrentAccount,
} from "../../admin/bot-config";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const session = getCurrentAccount();
    if (!session) {
      router.replace("/login");
      return;
    }
    setAccountId(session.id);
  }, [router]);

  const handleDelete = async () => {
    if (!accountId) return;
    if (confirmText !== "DELETE") {
      setError("Type DELETE in capital letters to confirm.");
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await apiFetch(`/api/accounts/${accountId}`, { method: "DELETE" });
      clearSession();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#2e3156",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#3a3d5c",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "560px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1>Delete Account</h1>
        <p style={{ marginTop: "1rem", color: "#c7c7e6" }}>
          This permanently removes your profile and streak. It cannot be undone.
        </p>

        <div
          className="form-group"
          style={{ textAlign: "left", marginTop: "2rem" }}
        >
          <label className="form-label">
            Type <strong>DELETE</strong> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="form-input"
            disabled={isDeleting}
          />
        </div>

        {error && (
          <p style={{ color: "#fecaca", marginTop: "0.5rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <Link
            href="/account"
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#8b7cf6",
              color: "white",
              textDecoration: "none",
            }}
          >
            Cancel
          </Link>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "#ff5f8a",
              color: "white",
              cursor: isDeleting ? "not-allowed" : "pointer",
              opacity: isDeleting ? 0.7 : 1,
              fontWeight: 600,
            }}
          >
            {isDeleting ? "Deleting…" : "Confirm Delete"}
          </button>
        </div>
      </div>
    </main>
  );
}
