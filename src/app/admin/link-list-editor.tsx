"use client";

import { BotLink } from "./bot-config";

type LinkListEditorProps = {
  links: BotLink[];
  onChange: (links: BotLink[]) => void;
};

export default function LinkListEditor({
  links,
  onChange,
}: LinkListEditorProps) {
  const updateLink = (index: number, field: keyof BotLink, value: string) => {
    const next = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    );
    onChange(next);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const addLink = () => {
    onChange([...links, { text: "", url: "" }]);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <label className="form-label" style={{ marginBottom: 0 }}>
          Links
        </label>
        <button
          type="button"
          onClick={addLink}
          style={{
            background: "transparent",
            border: "1px solid #7a5980",
            color: "#bbbdf6",
            padding: "4px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontFamily: "inherit",
          }}
        >
          + Add Link
        </button>
      </div>

      {links.length === 0 && (
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.8rem",
            fontStyle: "italic",
            margin: "0.5rem 0",
          }}
        >
          No links yet. The bot will reply with just the response text.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {links.map((link, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr auto",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={link.text}
              onChange={(e) => updateLink(index, "text", e.target.value)}
              placeholder="Label"
              className="form-input"
              style={{ padding: "8px 10px", fontSize: "0.875rem" }}
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
              placeholder="/path or https://..."
              className="form-input"
              style={{ padding: "8px 10px", fontSize: "0.875rem" }}
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              aria-label="Remove link"
              style={{
                background: "transparent",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#fecaca",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontFamily: "inherit",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
