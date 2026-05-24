"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import {
  Keyword,
  createKeyword,
  deleteKeyword,
  updateKeyword,
} from "./bot-config";
import Modal from "./modal";

type KeywordPanelProps = {
  keywords: Keyword[];
  onChange: (keywords: Keyword[]) => void;
  onNotify: (message: string, tone?: "success" | "error") => void;
  readOnly?: boolean;
};

type Draft = {
  id: string | null;
  keyword: string;
  synonyms: string[];
  pendingSynonym: string;
};

const emptyDraft: Draft = {
  id: null,
  keyword: "",
  synonyms: [],
  pendingSynonym: "",
};

export default function KeywordPanel({
  keywords,
  onChange,
  onNotify,
  readOnly = false,
}: KeywordPanelProps) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    if (readOnly) return;
    setDraft(emptyDraft);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (keyword: Keyword) => {
    setDraft({
      id: keyword.id,
      keyword: keyword.keyword,
      synonyms: [...keyword.synonyms],
      pendingSynonym: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDraft(emptyDraft);
    setFormError("");
  };

  const commitPendingSynonym = () => {
    const next = draft.pendingSynonym.trim();
    if (!next) return;
    if (draft.synonyms.includes(next)) {
      setDraft({ ...draft, pendingSynonym: "" });
      return;
    }
    setDraft({
      ...draft,
      synonyms: [...draft.synonyms, next],
      pendingSynonym: "",
    });
  };

  const handleSynonymKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitPendingSynonym();
    } else if (
      event.key === "Backspace" &&
      !draft.pendingSynonym &&
      draft.synonyms.length > 0
    ) {
      setDraft({ ...draft, synonyms: draft.synonyms.slice(0, -1) });
    }
  };

  const removeSynonym = (idx: number) => {
    setDraft({
      ...draft,
      synonyms: draft.synonyms.filter((_, i) => i !== idx),
    });
  };

  const handleDelete = async (keyword: Keyword) => {
    const confirmed = window.confirm(
      `Delete "${keyword.keyword}"? Combinations using it will also be removed.`,
    );
    if (!confirmed) return;
    try {
      await deleteKeyword(keyword.id);
      onChange(keywords.filter((k) => k.id !== keyword.id));
      onNotify(`Removed "${keyword.keyword}".`);
    } catch (error) {
      onNotify(
        error instanceof Error ? error.message : "Failed to delete keyword",
        "error",
      );
    }
  };

  const handleSave = async () => {
    const trimmed = draft.keyword.trim();
    const pending = draft.pendingSynonym.trim();
    const synonyms = pending
      ? Array.from(new Set([...draft.synonyms, pending]))
      : draft.synonyms;

    if (!trimmed) {
      setFormError("Keyword is required.");
      return;
    }
    if (trimmed.length > 100) {
      setFormError("Keyword must be 100 characters or fewer.");
      return;
    }

    setSaving(true);
    try {
      if (draft.id) {
        const updated = await updateKeyword(draft.id, {
          keyword: trimmed,
          synonyms,
        });
        onChange(keywords.map((k) => (k.id === draft.id ? updated : k)));
        onNotify(`Updated "${updated.keyword}".`);
      } else {
        const created = await createKeyword({ keyword: trimmed, synonyms });
        onChange([...keywords, created]);
        onNotify(`Added "${created.keyword}".`);
      }
      closeModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to save keyword",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Keywords"
        description='Phrases the bot recognizes (e.g. "James Webb", "Mars Rover"). Add synonyms so different wordings still match.'
        onCreate={openCreate}
        disabled={readOnly}
      />

      {keywords.length === 0 ? (
        <EmptyState onCreate={openCreate} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {keywords.map((keyword) => (
            <KeywordCard
              key={keyword.id}
              keyword={keyword}
              onEdit={() => openEdit(keyword)}
              onDelete={() => handleDelete(keyword)}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        title={draft.id ? "Edit Keyword" : "Add Keyword"}
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
                  : "Add Keyword"}
            </button>
          </>
        }
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Keyword</label>
            <input
              type="text"
              value={draft.keyword}
              onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
              placeholder="e.g. James Webb"
              className="form-input"
            />
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                marginTop: "0.35rem",
              }}
            >
              Can be one or more words. Matching is case-insensitive.
            </p>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Synonyms (optional)</label>
            <div style={chipBoxStyle}>
              {draft.synonyms.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  style={chipStyle}
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => removeSynonym(index)}
                    aria-label={`Remove ${word}`}
                    style={chipRemoveButtonStyle}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={draft.pendingSynonym}
                onChange={(e) =>
                  setDraft({ ...draft, pendingSynonym: e.target.value })
                }
                onKeyDown={handleSynonymKey}
                onBlur={commitPendingSynonym}
                placeholder={
                  draft.synonyms.length === 0
                    ? "Type a synonym and press Enter"
                    : "Add another synonym"
                }
                style={chipInputStyle}
              />
            </div>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                marginTop: "0.35rem",
              }}
            >
              Press Enter or comma to add. e.g. JWST, Webb Telescope
            </p>
          </div>

          {formError && (
            <div className="error-message" style={{ marginBottom: 0 }}>
              <span className="error-text">{formError}</span>
            </div>
          )}
        </div>
      </Modal>
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
        + Add Keyword
      </button>
    </div>
  );
}

function KeywordCard({
  keyword,
  onEdit,
  onDelete,
  readOnly,
}: {
  keyword: Keyword;
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
        <span className="badge" style={{ fontFamily: "monospace" }}>
          {keyword.keyword}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {!readOnly && (
            <>
              <button type="button" onClick={onEdit} style={iconButtonStyle}>
                Edit
              </button>
              <button type="button" onClick={onDelete} style={dangerButtonStyle}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {keyword.synonyms.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
          }}
        >
          {keyword.synonyms.map((word) => (
            <span key={word} style={synonymStyle}>
              {word}
            </span>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.8rem" }}>
          No synonyms added.
        </p>
      )}
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
        No keywords configured yet.
      </p>
      <button onClick={onCreate} className="button-primary">
        Add your first keyword
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

const chipBoxStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
  alignItems: "center",
  padding: "8px",
  background: "rgba(59, 59, 88, 0.7)",
  border: "1px solid #7a5980",
  borderRadius: "8px",
};

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  background: "#7a5980",
  color: "#ffffff",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "0.8rem",
};

const chipRemoveButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#ffffff",
  cursor: "pointer",
  padding: 0,
  lineHeight: 0,
  display: "inline-flex",
  alignItems: "center",
};

const chipInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: "140px",
  border: "none",
  background: "transparent",
  color: "#ffffff",
  outline: "none",
  fontFamily: "inherit",
  fontSize: "0.875rem",
  padding: "4px",
};

const synonymStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  background: "rgba(187, 189, 246, 0.12)",
  color: "#bbbdf6",
  padding: "3px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(187, 189, 246, 0.25)",
};
