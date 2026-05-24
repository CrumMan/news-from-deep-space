// "use client";

// import { useState } from "react";
// import { BotLink, Keyword, newId } from "./bot-config";
// import Modal from "./modal";
// import LinkListEditor from "./link-list-editor";

// type KeywordPanelProps = {
//   keywords: Keyword[];
//   onChange: (keywords: Keyword[]) => void;
//   onNotify: (message: string) => void;
// };

// type DraftKeyword = {
//   id: string | null;
//   keyword: string;
//   response: string;
//   links: BotLink[];
// };

// const emptyDraft: DraftKeyword = {
//   id: null,
//   keyword: "",
//   response: "",
//   links: [],
// };

// export default function KeywordPanel({
//   keywords,
//   onChange,
//   onNotify,
// }: KeywordPanelProps) {
//   const [draft, setDraft] = useState<DraftKeyword>(emptyDraft);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formError, setFormError] = useState("");

//   const openCreate = () => {
//     setDraft(emptyDraft);
//     setFormError("");
//     setIsModalOpen(true);
//   };

//   const openEdit = (keyword: Keyword) => {
//     setDraft({
//       id: keyword.id,
//       keyword: keyword.keyword,
//       response: keyword.response,
//       links: keyword.links.map((link) => ({ ...link })),
//     });
//     setFormError("");
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setDraft(emptyDraft);
//     setFormError("");
//   };

//   const handleDelete = (id: string) => {
//     const target = keywords.find((item) => item.id === id);
//     if (!target) return;
//     const confirmed = window.confirm(
//       `Delete the keyword "${target.keyword}"? This cannot be undone.`,
//     );
//     if (!confirmed) return;
//     onChange(keywords.filter((item) => item.id !== id));
//     onNotify(`Removed keyword "${target.keyword}".`);
//   };

//   const handleSave = () => {
//     const trimmedKeyword = draft.keyword.trim().toLowerCase();
//     const trimmedResponse = draft.response.trim();

//     if (!trimmedKeyword) {
//       setFormError("Keyword is required.");
//       return;
//     }
//     if (trimmedKeyword.includes(" ")) {
//       setFormError("A keyword must be a single word. Use combinations instead.");
//       return;
//     }
//     if (!trimmedResponse) {
//       setFormError("Bot response is required.");
//       return;
//     }

//     const duplicate = keywords.some(
//       (item) =>
//         item.keyword.toLowerCase() === trimmedKeyword && item.id !== draft.id,
//     );
//     if (duplicate) {
//       setFormError("Another entry already uses this keyword.");
//       return;
//     }

//     const cleanedLinks = draft.links
//       .map((link) => ({ text: link.text.trim(), url: link.url.trim() }))
//       .filter((link) => link.text && link.url);

//     if (draft.id) {
//       onChange(
//         keywords.map((item) =>
//           item.id === draft.id
//             ? {
//                 ...item,
//                 keyword: trimmedKeyword,
//                 response: trimmedResponse,
//                 links: cleanedLinks,
//               }
//             : item,
//         ),
//       );
//       onNotify(`Updated keyword "${trimmedKeyword}".`);
//     } else {
//       const created: Keyword = {
//         id: newId("k"),
//         keyword: trimmedKeyword,
//         response: trimmedResponse,
//         links: cleanedLinks,
//       };
//       onChange([...keywords, created]);
//       onNotify(`Added keyword "${trimmedKeyword}".`);
//     }

//     closeModal();
//   };

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "1.25rem",
//           flexWrap: "wrap",
//           gap: "1rem",
//         }}
//       >
//         <div>
//           <h2
//             style={{
//               margin: 0,
//               fontSize: "1.25rem",
//               fontWeight: 600,
//               color: "#ffffff",
//             }}
//           >
//             Keyword Triggers
//           </h2>
//           <p
//             style={{
//               margin: "0.25rem 0 0",
//               color: "#a0a0b0",
//               fontSize: "0.875rem",
//             }}
//           >
//             The bot replies when a single word appears in the user message.
//           </p>
//         </div>
//         <button onClick={openCreate} className="button-primary">
//           + Add Keyword
//         </button>
//       </div>

//       {keywords.length === 0 ? (
//         <EmptyState onCreate={openCreate} />
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//             gap: "1rem",
//           }}
//         >
//           {keywords.map((keyword) => (
//             <KeywordCard
//               key={keyword.id}
//               keyword={keyword}
//               onEdit={() => openEdit(keyword)}
//               onDelete={() => handleDelete(keyword.id)}
//             />
//           ))}
//         </div>
//       )}

//       <Modal
//         open={isModalOpen}
//         title={draft.id ? "Edit Keyword" : "Add Keyword"}
//         onClose={closeModal}
//         footer={
//           <>
//             <button
//               type="button"
//               onClick={closeModal}
//               style={secondaryButtonStyle}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSave}
//               className="button-primary"
//             >
//               {draft.id ? "Save Changes" : "Add Keyword"}
//             </button>
//           </>
//         }
//       >
//         <div
//           style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
//         >
//           <div className="form-group" style={{ margin: 0 }}>
//             <label className="form-label">Keyword</label>
//             <input
//               type="text"
//               value={draft.keyword}
//               onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
//               placeholder="e.g. mars"
//               className="form-input"
//             />
//             <p
//               style={{
//                 color: "#9ca3af",
//                 fontSize: "0.75rem",
//                 marginTop: "0.35rem",
//               }}
//             >
//               Use one word. Matching is case-insensitive.
//             </p>
//           </div>

//           <div className="form-group" style={{ margin: 0 }}>
//             <label className="form-label">Bot Response</label>
//             <textarea
//               value={draft.response}
//               onChange={(e) =>
//                 setDraft({ ...draft, response: e.target.value })
//               }
//               placeholder="What should the bot say?"
//               rows={3}
//               className="form-input"
//               style={{ resize: "vertical" }}
//             />
//           </div>

//           <LinkListEditor
//             links={draft.links}
//             onChange={(links) => setDraft({ ...draft, links })}
//           />

//           {formError && (
//             <div className="error-message" style={{ marginBottom: 0 }}>
//               <span className="error-text">{formError}</span>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// }

// function KeywordCard({
//   keyword,
//   onEdit,
//   onDelete,
// }: {
//   keyword: Keyword;
//   onEdit: () => void;
//   onDelete: () => void;
// }) {
//   return (
//     <div
//       style={{
//         background: "rgba(59, 59, 88, 0.7)",
//         border: "1px solid rgba(187, 189, 246, 0.15)",
//         borderRadius: "12px",
//         padding: "1.25rem",
//         display: "flex",
//         flexDirection: "column",
//         gap: "0.75rem",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: "0.75rem",
//         }}
//       >
//         <span className="badge" style={{ fontFamily: "monospace" }}>
//           {keyword.keyword}
//         </span>
//         <div style={{ display: "flex", gap: "0.5rem" }}>
//           <button
//             type="button"
//             onClick={onEdit}
//             style={iconButtonStyle}
//             aria-label="Edit keyword"
//           >
//             Edit
//           </button>
//           <button
//             type="button"
//             onClick={onDelete}
//             style={dangerButtonStyle}
//             aria-label="Delete keyword"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       <p
//         style={{
//           margin: 0,
//           color: "#e0e0e0",
//           fontSize: "0.9rem",
//           lineHeight: 1.5,
//         }}
//       >
//         {keyword.response}
//       </p>

//       {keyword.links.length > 0 && (
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "0.4rem",
//             marginTop: "0.25rem",
//           }}
//         >
//           {keyword.links.map((link, index) => (
//             <span
//               key={index}
//               style={{
//                 fontSize: "0.75rem",
//                 background: "rgba(187, 189, 246, 0.12)",
//                 color: "#bbbdf6",
//                 padding: "3px 10px",
//                 borderRadius: "999px",
//                 border: "1px solid rgba(187, 189, 246, 0.25)",
//               }}
//               title={link.url}
//             >
//               {link.text}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function EmptyState({ onCreate }: { onCreate: () => void }) {
//   return (
//     <div
//       style={{
//         border: "1px dashed rgba(187, 189, 246, 0.3)",
//         borderRadius: "12px",
//         padding: "3rem 1.5rem",
//         textAlign: "center",
//         color: "#a0a0b0",
//       }}
//     >
//       <p style={{ margin: "0 0 1rem", fontSize: "1rem" }}>
//         No keywords configured yet.
//       </p>
//       <button onClick={onCreate} className="button-primary">
//         Add your first keyword
//       </button>
//     </div>
//   );
// }

// const iconButtonStyle: React.CSSProperties = {
//   background: "transparent",
//   border: "1px solid rgba(187, 189, 246, 0.3)",
//   color: "#bbbdf6",
//   padding: "5px 12px",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "0.8rem",
//   fontFamily: "inherit",
// };

// const dangerButtonStyle: React.CSSProperties = {
//   background: "transparent",
//   border: "1px solid rgba(239, 68, 68, 0.4)",
//   color: "#fecaca",
//   padding: "5px 12px",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "0.8rem",
//   fontFamily: "inherit",
// };

// const secondaryButtonStyle: React.CSSProperties = {
//   background: "transparent",
//   border: "1px solid rgba(187, 189, 246, 0.3)",
//   color: "#e0e0e0",
//   padding: "8px 16px",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontFamily: "inherit",
//   fontWeight: 500,
// };

// ****************************************************************************

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
    setSynonymInput("");
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
    setSynonymInput("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDraft(emptyDraft);
    setFormError("");
    setSynonymInput("");
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
          {/* Keyword Field */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Keyword</label>
            <input
              type="text"
              value={draft.keyword}
              onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
              placeholder="e.g. James Webb"
              className="form-input"
              disabled={loading}
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

          {/* Bot Response Field */}
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
  // Combine all synonyms for display
  const allSynonyms = [...(keyword.synonyms || [])];

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
