"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import { BotLink, Combination, newId } from "./bot-config";
import Modal from "./modal";
import LinkListEditor from "./link-list-editor";

type CombinationPanelProps = {
  combinations: Combination[];
  onChange: (combinations: Combination[]) => void;
  onNotify: (message: string) => void;
};

type DraftCombination = {
  id: string | null;
  words: string[];
  pendingWord: string;
  response: string;
  links: BotLink[];
};

const emptyDraft: DraftCombination = {
  id: null,
  words: [],
  pendingWord: "",
  response: "",
  links: [],
};

export default function CombinationPanel({
  combinations,
  onChange,
  onNotify,
}: CombinationPanelProps) {
  const [draft, setDraft] = useState<DraftCombination>(emptyDraft);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setDraft(emptyDraft);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (combination: Combination) => {
    setDraft({
      id: combination.id,
      words: [...combination.words],
      pendingWord: "",
      response: combination.response,
      links: combination.links.map((link) => ({ ...link })),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDraft(emptyDraft);
    setFormError("");
  };

  const commitPendingWord = () => {
    const word = draft.pendingWord.trim().toLowerCase();
    if (!word) return;
    if (word.includes(" ")) {
      setFormError("Each word must be a single token.");
      return;
    }
    if (draft.words.includes(word)) {
      setDraft({ ...draft, pendingWord: "" });
      return;
    }
    setDraft({
      ...draft,
      words: [...draft.words, word],
      pendingWord: "",
    });
    setFormError("");
  };

  const removeWord = (index: number) => {
    setDraft({
      ...draft,
      words: draft.words.filter((_, i) => i !== index),
    });
  };

  const handleWordKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitPendingWord();
    } else if (
      event.key === "Backspace" &&
      !draft.pendingWord &&
      draft.words.length > 0
    ) {
      removeWord(draft.words.length - 1);
    }
  };

  const handleDelete = (id: string) => {
    const target = combinations.find((item) => item.id === id);
    if (!target) return;
    const confirmed = window.confirm(
      `Delete the combination "${target.words.join(" + ")}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    onChange(combinations.filter((item) => item.id !== id));
    onNotify(`Removed combination "${target.words.join(" + ")}".`);
  };

  const handleSave = () => {
    const trimmedResponse = draft.response.trim();
    let words = [...draft.words];

    const pending = draft.pendingWord.trim().toLowerCase();
    if (pending && !words.includes(pending)) {
      words.push(pending);
    }

    if (words.length < 2) {
      setFormError("Combinations need at least two words.");
      return;
    }
    if (!trimmedResponse) {
      setFormError("Bot response is required.");
      return;
    }

    const fingerprint = [...words].sort().join("|");
    const duplicate = combinations.some((item) => {
      if (item.id === draft.id) return false;
      const otherFingerprint = [...item.words].sort().join("|");
      return otherFingerprint === fingerprint;
    });
    if (duplicate) {
      setFormError("Another entry already uses this word combination.");
      return;
    }

    const cleanedLinks = draft.links
      .map((link) => ({ text: link.text.trim(), url: link.url.trim() }))
      .filter((link) => link.text && link.url);

    if (draft.id) {
      onChange(
        combinations.map((item) =>
          item.id === draft.id
            ? {
                ...item,
                words,
                response: trimmedResponse,
                links: cleanedLinks,
              }
            : item,
        ),
      );
      onNotify(`Updated combination "${words.join(" + ")}".`);
    } else {
      const created: Combination = {
        id: newId("c"),
        words,
        response: trimmedResponse,
        links: cleanedLinks,
      };
      onChange([...combinations, created]);
      onNotify(`Added combination "${words.join(" + ")}".`);
    }

    closeModal();
  };

  return (
    <div>
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
            Word Combinations
          </h2>
          <p
            style={{
              margin: "0.25rem 0 0",
              color: "#a0a0b0",
              fontSize: "0.875rem",
            }}
          >
            The bot replies when every word in the set appears in the message.
          </p>
        </div>
        <button onClick={openCreate} className="button-primary">
          + Add Combination
        </button>
      </div>

      {combinations.length === 0 ? (
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
              onDelete={() => handleDelete(combination.id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        title={draft.id ? "Edit Word Combination" : "Add Word Combination"}
        onClose={closeModal}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="button-primary"
            >
              {draft.id ? "Save Changes" : "Add Combination"}
            </button>
          </>
        }
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Words (all must match)</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                alignItems: "center",
                padding: "8px",
                background: "rgba(59, 59, 88, 0.7)",
                border: "1px solid #7a5980",
                borderRadius: "8px",
              }}
            >
              {draft.words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "#7a5980",
                    color: "#ffffff",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                  }}
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => removeWord(index)}
                    aria-label={`Remove ${word}`}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 0,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={draft.pendingWord}
                onChange={(e) =>
                  setDraft({ ...draft, pendingWord: e.target.value })
                }
                onKeyDown={handleWordKey}
                onBlur={commitPendingWord}
                placeholder={
                  draft.words.length === 0
                    ? "Type a word and press Enter"
                    : "Add another word"
                }
                style={{
                  flex: 1,
                  minWidth: "140px",
                  border: "none",
                  background: "transparent",
                  color: "#ffffff",
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  padding: "4px",
                }}
              />
            </div>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                marginTop: "0.35rem",
              }}
            >
              Press Enter or comma to add. Order does not matter.
            </p>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Bot Response</label>
            <textarea
              value={draft.response}
              onChange={(e) =>
                setDraft({ ...draft, response: e.target.value })
              }
              placeholder="What should the bot say when all of these words appear?"
              rows={3}
              className="form-input"
              style={{ resize: "vertical" }}
            />
          </div>

          <LinkListEditor
            links={draft.links}
            onChange={(links) => setDraft({ ...draft, links })}
          />

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

function CombinationCard({
  combination,
  onEdit,
  onDelete,
}: {
  combination: Combination;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      style={{
        background: "rgba(59, 59, 88, 0.7)",
        border: "1px solid rgba(187, 189, 246, 0.15)",
        borderRadius: "12px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
          }}
        >
          {combination.words.map((word) => (
            <span
              key={word}
              className="badge"
              style={{ fontFamily: "monospace" }}
            >
              {word}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button type="button" onClick={onEdit} style={iconButtonStyle}>
            Edit
          </button>
          <button type="button" onClick={onDelete} style={dangerButtonStyle}>
            Delete
          </button>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          color: "#e0e0e0",
          fontSize: "0.9rem",
          lineHeight: 1.5,
        }}
      >
        {combination.response}
      </p>

      {combination.links.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginTop: "0.25rem",
          }}
        >
          {combination.links.map((link, index) => (
            <span
              key={index}
              style={{
                fontSize: "0.75rem",
                background: "rgba(187, 189, 246, 0.12)",
                color: "#bbbdf6",
                padding: "3px 10px",
                borderRadius: "999px",
                border: "1px solid rgba(187, 189, 246, 0.25)",
              }}
              title={link.url}
            >
              {link.text}
            </span>
          ))}
        </div>
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
        No word combinations configured yet.
      </p>
      <button onClick={onCreate} className="button-primary">
        Add your first combination
      </button>
    </div>
  );
}

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
