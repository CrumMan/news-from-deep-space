"use client";

import { useMemo, useState } from "react";
import {
  Combination,
  CombinationType,
  Keyword,
  createCombination,
  deleteCombination,
  fetchCombinations,
  updateCombination,
} from "./bot-config";
import Modal from "./modal";
import ApiPanel from "./apiBuild-panel";
type CombinationPanelProps = {
  combinations: Combination[];
  keywords: Keyword[];
  onChange: (combinations: Combination[]) => void;
  onNotify: (message: string, tone?: "success" | "error") => void;
  readOnly?: boolean;
};



type Draft = {
  id: string | null;
  keywordId1: string;
  keywordId2: string;
  type: CombinationType;
  result: string;
  apiKey: string;
};

const emptyDraft: Draft = {
  id: null,
  keywordId1: "",
  keywordId2: "",
  type: "link",
  result: "",
  apiKey: "",
};

export default function CombinationPanel({
  combinations,
  keywords,
  onChange,
  onNotify,
  readOnly = false,
}: CombinationPanelProps) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [api_buildId, setapi_buildId] = useState<string | null>(null);
  
  const sortedKeywords = useMemo(
    () => [...keywords].sort((a, b) => a.keyword.localeCompare(b.keyword)),
    [keywords],
  );

  const openCreate = () => {
    if (readOnly) return;
    setDraft(emptyDraft);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (combination: Combination) => {
    setDraft({
      id: combination.id,
      keywordId1: combination.fk_keyword1,
      keywordId2: combination.fk_keyword2,
      type: combination.type,
      result: combination.result,
      apiKey: combination.api_key ?? "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDraft(emptyDraft);
    setFormError("");
  };

  const handleDelete = async (combination: Combination) => {
    const label = `${combination.keyword1} + ${combination.keyword2}`;
    const confirmed = window.confirm(
      `Delete the combination "${label}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      await deleteCombination(combination.id);
      onChange(combinations.filter((c) => c.id !== combination.id));
      onNotify(`Removed combination "${label}".`);
    } catch (error) {
      onNotify(
        error instanceof Error ? error.message : "Failed to delete combination",
        "error",
      );
    }
  };

  const handleSave = async () => {
    if (!draft.keywordId1 || !draft.keywordId2) {
      setFormError("Pick two keywords.");
      return;
    }
    if (draft.keywordId1 === draft.keywordId2) {
      setFormError("Pick two different keywords.");
      return;
    }
    if (!draft.result.trim()) {
      setFormError("Add a link or photo URL.");
      return;
    }

    setSaving(true);
    try {
      if (draft.id) {
        await updateCombination(draft.id, {
          type: draft.type,
          result: draft.result.trim(),
          apiKey: draft.type == "photo" ? draft.apiKey.trim() || null : null,
        });
        setapi_buildId(draft.id);
      } else {
        const createdCombination = await createCombination({
         keywordId1: draft.keywordId1,
         keywordId2: draft.keywordId2,
         type: draft.type,
         result: draft.result.trim(),
         apiKey: draft.type === "photo"
         ? draft.apiKey.trim() || null
         : null,
});
       setapi_buildId(createdCombination.id);
      }
      const refreshed = await fetchCombinations();
      onChange(refreshed);
      onNotify(draft.id ? "Combination updated." : "Combination created.");
      closeModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to save combination",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Word Combinations"
        description="Pair two keywords to trigger a link or live photo lookup when both appear in a user's message."
        onCreate={openCreate}
        disabled={keywords.length < 2 || readOnly}
      />

      {keywords.length < 2 ? (
        <Hint message="Add at least two keywords first, then you can pair them into combinations." />
      ) : combinations.length === 0 ? (
        <EmptyState onCreate={openCreate} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}
        >
          {combinations.map((combination) => (
            <CombinationCard
              key={combination.id}
              combination={combination}
              onEdit={() => openEdit(combination)}
              onDelete={() => handleDelete(combination)}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        title={draft.id ? "Edit Combination" : "Add Combination"}
        onClose={closeModal}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              style={secondaryButtonStyle}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="button-primary"
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : draft.id
                  ? "Save Changes"
                  : "Add Combination"}
            </button>
          </>
        }
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label className="form-label">First Keyword</label>
              <select
                value={draft.keywordId1}
                onChange={(e) =>
                  setDraft({ ...draft, keywordId1: e.target.value })
                }
                className="form-input"
                disabled={!!draft.id}
              >
                <option value="">Select a keyword…</option>
                {sortedKeywords.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.keyword}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label className="form-label">Second Keyword</label>
              <select
                value={draft.keywordId2}
                onChange={(e) =>
                  setDraft({ ...draft, keywordId2: e.target.value })
                }
                className="form-input"
                disabled={!!draft.id}
              >
                <option value="">Select a keyword…</option>
                {sortedKeywords.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.keyword}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {draft.id && (
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                margin: 0,
              }}
            >
              Keywords cannot be changed after a combination is created. Delete
              and re-add to swap keywords.
            </p>
          )}

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Type</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["link", "photo"] as const).map((type) => {
                const active = draft.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDraft({ ...draft, type })}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: active
                        ? "1px solid #bbbdf6"
                        : "1px solid rgba(187, 189, 246, 0.25)",
                      background: active
                        ? "rgba(187, 189, 246, 0.18)"
                        : "transparent",
                      color: active ? "#ffffff" : "#d1d5db",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }
                  }
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                marginTop: "0.35rem",
              }}
            >
              {draft.type === "photo"
                ? "photo combos call a remote endpoint and show the link to the user."
                : "Link combos send the user directly to a fixed URL."}
            </p>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              {draft.type === "photo" ? "API URL" : "Link URL"}
            </label>
            <input
              type="text"
              value={draft.result}
              onChange={(e) => setDraft({ ...draft, result: e.target.value })}
              className="form-input"
              placeholder={
                draft.type === "photo"
                  ? "https://photo.nasa.gov/..."
                  : "https://example.com/info"
              }
            />
          </div>

          {draft.type === "photo" && (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">API Key (optional)</label>
              <input
                type="text"
                value={draft.apiKey}
                onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
                className="form-input"
                placeholder="DEMO_KEY"
              />
            </div>
          )}

          {formError && (
            <div className="error-message" style={{ marginBottom: 0 }}>
              <span className="error-text">{formError}</span>
            </div>
          )}
        </div>
      </Modal>
      <ApiPanel
         open={!!api_buildId}
         combinationId={api_buildId}
        onClose={() => setapi_buildId(null)}
        Combinations={combinations}
        apis={[]}
        onChange={() => {}}
        onNotify={onNotify}
/>
    </div>
  );
}


function PanelHeader({
  title,
  description,
  onCreate,
  disabled,
}: {
  title: string;
  description: string;
  onCreate: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.25rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: "0.25rem 0 0",
            color: "#a0a0b0",
            fontSize: "0.875rem",
            maxWidth: "640px",
          }}
        >
          {description}
        </p>
      </div>
      <button
        onClick={onCreate}
        className="button-primary"
        disabled={disabled}
        style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
      >
        + Add Combination
      </button>
    </div>
  );
}

function CombinationCard({
  combination,
  onEdit,
  onDelete,
  readOnly,
}: {
  combination: Combination;
  onEdit: () => void;
  onDelete: () => void;
  readOnly?: boolean;
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          <span className="badge" style={{ fontFamily: "monospace" }}>
            {combination.keyword1}
          </span>
          <span style={{ color: "#9ca3af", alignSelf: "center" }}>+</span>
          <span className="badge" style={{ fontFamily: "monospace" }}>
            {combination.keyword2}
          </span>
        </div>
        {!readOnly && (
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <button type="button" onClick={onEdit} style={iconButtonStyle}>
              Edit
            </button>
            <button type="button" onClick={onDelete} style={dangerButtonStyle}>
              Delete
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            ...typePillStyle,
            background:
              combination.type === "photo"
                ? "rgba(187, 189, 246, 0.18)"
                : "rgba(122, 89, 128, 0.3)",
            color: combination.type === "photo" ? "#bbbdf6" : "#f5b7e3",
          }}
        >
          {combination.type.toUpperCase()}
        </span>
        <span
          style={{
            color: "#d1d5db",
            fontSize: "0.8rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={combination.result}
        >
          {combination.result}
        </span>
      </div>
    </div>
  );
}

function Hint({ message }: { message: string }) {
  return (
    <div
      style={{
        border: "1px dashed rgba(187, 189, 246, 0.3)",
        borderRadius: "12px",
        padding: "2rem 1.5rem",
        textAlign: "center",
        color: "#a0a0b0",
      }}
    >
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      style={{
        border: "1px dashed rgba(187, 189, 246, 0.3)",
        borderRadius: "12px",
        padding: "3rem 1.5rem",
        textAlign: "center",
        color: "#a0a0b0",
      }}
    >
      <p style={{ margin: "0 0 1rem", fontSize: "1rem" }}>
        No combinations configured yet.
      </p>
      <button onClick={onCreate} className="button-primary">
        Add your first combination
      </button>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(59, 59, 88, 0.7)",
  border: "1px solid rgba(187, 189, 246, 0.15)",
  borderRadius: "12px",
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const iconButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(187, 189, 246, 0.3)",
  color: "#bbbdf6",
  padding: "5px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontFamily: "inherit",
};

const dangerButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(239, 68, 68, 0.4)",
  color: "#fecaca",
  padding: "5px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontFamily: "inherit",
};

const secondaryButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(187, 189, 246, 0.3)",
  color: "#e0e0e0",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 500,
};

const typePillStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  padding: "2px 8px",
  borderRadius: "999px",
  letterSpacing: "0.05em",
  fontWeight: 600,
};
