"use client";

import { useState } from "react";
import { BotLink, Keyword, newId } from "./bot-config";
import Modal from "./modal";
import LinkListEditor from "./link-list-editor";

type KeywordPanelProps = {
  keywords: Keyword[];
  onChange: (keywords: Keyword[]) => void;
  onNotify: (message: string) => void;
};

type DraftKeyword = {
  id: string | null;
  keyword: string;
  response: string;
  links: BotLink[];
};

const emptyDraft: DraftKeyword = {
  id: null,
  keyword: "",
  response: "",
  links: [],
};

export default function KeywordPanel({
  keywords,
  onChange,
  onNotify,
}: KeywordPanelProps) {
  const [draft, setDraft] = useState<DraftKeyword>(emptyDraft);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setDraft(emptyDraft);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (keyword: Keyword) => {
    setDraft({
      id: keyword.id,
      keyword: keyword.keyword,
      response: keyword.response,
      links: keyword.links.map((link) => ({ ...link })),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDraft(emptyDraft);
    setFormError("");
  };

  const handleDelete = (id: string) => {
    const target = keywords.find((item) => item.id === id);
    if (!target) return;
    const confirmed = window.confirm(
      `Delete the keyword "${target.keyword}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    onChange(keywords.filter((item) => item.id !== id));
    onNotify(`Removed keyword "${target.keyword}".`);
  };

  const handleSave = () => {
    const trimmedKeyword = draft.keyword.trim().toLowerCase();
    const trimmedResponse = draft.response.trim();

    if (!trimmedKeyword) {
      setFormError("Keyword is required.");
      return;
    }
    if (trimmedKeyword.includes(" ")) {
      setFormError("A keyword must be a single word. Use combinations instead.");
      return;
    }
    if (!trimmedResponse) {
      setFormError("Bot response is required.");
      return;
    }

    const duplicate = keywords.some(
      (item) =>
        item.keyword.toLowerCase() === trimmedKeyword && item.id !== draft.id,
    );
    if (duplicate) {
      setFormError("Another entry already uses this keyword.");
      return;
    }

    const cleanedLinks = draft.links
      .map((link) => ({ text: link.text.trim(), url: link.url.trim() }))
      .filter((link) => link.text && link.url);

    if (draft.id) {
      onChange(
        keywords.map((item) =>
          item.id === draft.id
            ? {
                ...item,
                keyword: trimmedKeyword,
                response: trimmedResponse,
                links: cleanedLinks,
              }
            : item,
        ),
      );
      onNotify(`Updated keyword "${trimmedKeyword}".`);
    } else {
      const created: Keyword = {
        id: newId("k"),
        keyword: trimmedKeyword,
        response: trimmedResponse,
        links: cleanedLinks,
      };
      onChange([...keywords, created]);
      onNotify(`Added keyword "${trimmedKeyword}".`);
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
            Keyword Triggers
          </h2>
          <p
            style={{
              margin: "0.25rem 0 0",
              color: "#a0a0b0",
              fontSize: "0.875rem",
            }}
          >
            The bot replies when a single word appears in the user message.
          </p>
        </div>
        <button onClick={openCreate} className="button-primary">
          + Add Keyword
        </button>
      </div>

      {keywords.length === 0 ? (
        <EmptyState onCreate={openCreate} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {keywords.map((keyword) => (
            <KeywordCard
              key={keyword.id}
              keyword={keyword}
              onEdit={() => openEdit(keyword)}
              onDelete={() => handleDelete(keyword.id)}
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
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="button-primary"
            >
              {draft.id ? "Save Changes" : "Add Keyword"}
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
              placeholder="e.g. mars"
              className="form-input"
            />
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                marginTop: "0.35rem",
              }}
            >
              Use one word. Matching is case-insensitive.
            </p>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Bot Response</label>
            <textarea
              value={draft.response}
              onChange={(e) =>
                setDraft({ ...draft, response: e.target.value })
              }
              placeholder="What should the bot say?"
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

function KeywordCard({
  keyword,
  onEdit,
  onDelete,
}: {
  keyword: Keyword;
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
        <span className="badge" style={{ fontFamily: "monospace" }}>
          {keyword.keyword}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={onEdit}
            style={iconButtonStyle}
            aria-label="Edit keyword"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            style={dangerButtonStyle}
            aria-label="Delete keyword"
          >
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
        {keyword.response}
      </p>

      {keyword.links.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginTop: "0.25rem",
          }}
        >
          {keyword.links.map((link, index) => (
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
        No keywords configured yet.
      </p>
      <button onClick={onCreate} className="button-primary">
        Add your first keyword
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
