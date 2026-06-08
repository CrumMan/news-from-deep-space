"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Puzzle, Type } from "lucide-react";
import {
  Combination,
  Keyword,
  fetchCombinations,
  fetchKeywords,
  getCurrentAccount,
  loadFallback,
  saveFallback,
} from "./bot-config";
import KeywordPanel from "./keyword-panel";
import CombinationPanel from "./combination-panel";
import ApiPanel from "./apiBuild-panel";
import Toast from "./toast";

type TabId = "keywords" | "combinations" | "fallback";

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "keywords", label: "Keywords", icon: <Type size={16} /> },
  { id: "combinations", label: "Word Combinations", icon: <Puzzle size={16} /> },
  { id: "fallback", label: "Fallback Message", icon: <MessageCircle size={16} /> },
];

type ToastState = { message: string; tone: "success" | "error" } | null;

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("keywords");
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [fallback, setFallback] = useState("");
  const [fallbackDraft, setFallbackDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const account = getCurrentAccount();
    if (!account) {
      router.replace("/login");
      return;
    }
    setIsAdmin(account.isAdmin);

    const storedFallback = loadFallback();
    setFallback(storedFallback);
    setFallbackDraft(storedFallback);

    Promise.all([fetchKeywords(), fetchCombinations()])
      .then(([k, c]) => {
        setKeywords(k);
        setCombinations(c);
      })
      .catch((err: Error) =>
        setLoadError(err.message || "Failed to load configuration"),
      )
      .finally(() => setHydrated(true));
  }, [router]);

  const notify = (
    message: string,
    tone: "success" | "error" = "success",
  ) => setToast({ message, tone });

  const handleSaveFallback = () => {
    const trimmed = fallbackDraft.trim();
    if (!trimmed) {
      notify("Fallback message cannot be empty.", "error");
      return;
    }
    setFallback(trimmed);
    saveFallback(trimmed);
    notify("Fallback message updated.");
  };

  return (
    <>
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(59, 59, 88, 0.95) 0%, rgba(42, 42, 66, 0.95) 100%)",
          borderBottom: "1px solid rgba(187, 189, 246, 0.15)",
        }}
      >
        <div
          className="container"
          style={{ paddingTop: "3rem", paddingBottom: "2.5rem" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "999px",
              background: "rgba(187, 189, 246, 0.15)",
              border: "1px solid rgba(187, 189, 246, 0.3)",
              color: "#bbbdf6",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Admin Dashboard
          </span>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
              background: "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Chat Assistant Controls
          </h1>
          <p
            style={{
              margin: 0,
              color: "#d1d5db",
              maxWidth: "640px",
              fontSize: "1rem",
            }}
          >
            Manage the keywords and keyword combinations the deterministic chat
            assistant recognizes. Changes go live immediately.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
              marginTop: "2rem",
            }}
          >
            <StatTile label="Keywords" value={keywords.length} />
            <StatTile label="Combinations" value={combinations.length} />
            <StatTile
              label="Fallback Message"
              value={fallback ? "Custom" : "Default"}
            />
          </div>
        </div>
      </section>

      <div
        style={{
          position: "sticky",
          top: "72px",
          zIndex: 50,
          background: "rgba(42, 42, 66, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(187, 189, 246, 0.1)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            padding: "0.75rem 20px",
          }}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: isActive
                    ? "1px solid rgba(187, 189, 246, 0.4)"
                    : "1px solid transparent",
                  background: isActive
                    ? "rgba(187, 189, 246, 0.15)"
                    : "transparent",
                  color: isActive ? "#ffffff" : "#d1d5db",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "3rem" }}
      >
        {!isAdmin && hydrated && (
          <div
            style={{
              padding: "1rem 1.25rem",
              marginBottom: "1.25rem",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "10px",
              color: "#fecaca",
              background: "rgba(239, 68, 68, 0.08)",
              fontSize: "0.9rem",
            }}
          >
            You are signed in but do not have admin permissions. You can view
            but not modify configuration.
          </div>
        )}

        {loadError && (
          <div
            style={{
              padding: "1rem 1.25rem",
              marginBottom: "1.25rem",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "10px",
              color: "#fecaca",
              background: "rgba(239, 68, 68, 0.08)",
              fontSize: "0.9rem",
            }}
          >
            {loadError}
          </div>
        )}

        {!hydrated ? (
          <div
            style={{
              textAlign: "center",
              color: "#a0a0b0",
              padding: "3rem 0",
            }}
          >
            Loading configuration…
          </div>
        ) : (
          <>
            {activeTab === "keywords" && (
              <KeywordPanel
                keywords={keywords}
                onChange={setKeywords}
                onNotify={notify}
                readOnly={!isAdmin}
              />
            )}

            {activeTab === "combinations" && (
              <CombinationPanel
                combinations={combinations}
                keywords={keywords}
                onChange={setCombinations}
                onNotify={notify}
                readOnly={!isAdmin}
              />
            )}

            {activeTab === "fallback" && (
              <div
                style={{
                  maxWidth: "640px",
                  background: "rgba(59, 59, 88, 0.7)",
                  border: "1px solid rgba(187, 189, 246, 0.15)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  Fallback Message
                </h2>
                <p
                  style={{
                    margin: "0 0 1.25rem",
                    color: "#a0a0b0",
                    fontSize: "0.875rem",
                  }}
                >
                  Shown when no keyword or combination matches the message.
                  Stored locally so each admin can preview tweaks before
                  publishing.
                </p>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    value={fallbackDraft}
                    onChange={(e) => setFallbackDraft(e.target.value)}
                    rows={4}
                    className="form-input"
                    style={{ resize: "vertical" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={handleSaveFallback}
                    className="button-primary"
                  >
                    Save Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setFallbackDraft(fallback)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(187, 189, 246, 0.3)",
                      color: "#e0e0e0",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 500,
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Toast
        message={toast?.message ?? null}
        tone={toast?.tone ?? "success"}
        onDismiss={() => setToast(null)}
      />
    </>
  );
}

function StatTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: "rgba(42, 42, 66, 0.6)",
        border: "1px solid rgba(187, 189, 246, 0.15)",
        borderRadius: "10px",
        padding: "0.85rem 1rem",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.7rem",
          color: "#a0a0b0",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#bbbdf6",
        }}
      >
        {value}
      </p>
    </div>
  );
}
