import Modal from "./modal";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import{
    api_build,
    Combination,
    CombinationType,
    updateApi_details,
    getApibyId,
    createApi_Details,
    fetchCombinations,
    fetchCombination,
    } from "./bot-config";
import { patchFetch } from "next/dist/server/app-render/entry-base";



type ApiPanelProps = {
  combinationId: string | null;
  open: boolean;
  onClose: () => void;

  Combinations: Combination[];
  apis: api_build[];
  readOnly?: boolean;
  onChange: (apis: api_build[]) => void;
  onNotify: (message: string, tone?: "success" | "error") => void;
};


export type Draft = {
  id: string | null;
  type: CombinationType;

  subtitle:string | null;
  text:string|null;
  //this will be used if the type is a photo or a link
  title:string | null;

  imageLinkWord:string|null;
};

const emptyDraft: Draft = {
  id: null,
  type: "" as CombinationType,
  subtitle: null,
  title: null,
  text: null,
  imageLinkWord: null,
}
const runApiAndGetResult = async (combinationId: string) => {
  console.log("combinationId being used:", combinationId);
  
  const data = await fetchCombination(combinationId);
   console.log("DB DATA:", data);
  if (!data) {
  throw new Error("No API build found for this combinationId");
}

  const apiUrl = data.api_key
    ? `${data.result}?${data.api_key}`
    : data.result;

   console.log("API URL:", apiUrl);
  const response = await fetch(apiUrl);
   console.log("response:", response.status);
  if (!response.ok) {
    throw new Error("External API failed or is loading... Please reload API manually after ten seconds.");
  }

  const result = await response.json();
  console.log("FINAL RESULT:", result);
  return result;
};

export default function ApiPanel({
  combinationId,
  open,
  onClose,
  Combinations,
  apis,
  readOnly,
  onChange,
  onNotify,

}: ApiPanelProps) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);

  useEffect(() => {
  if (!open || !combinationId) return;

  const load = async () => {
    try {
      const result = await runApiAndGetResult(combinationId);
      setApiResult(result);
    } catch (err) {
      setApiResult({ error: "Failed to load API" });
    }
  };

  load();
}, [open, combinationId]);

if (!open || !combinationId) return null;


  // const openEdit = (api_build: api_build) => {
  //   setDraft({
  //     id: api_build.id,
  //     type: api_build.type as CombinationType,
  //     subtitle: api_build.subtitle ?? null,
  //     text: api_build.text ?? null,
  //     title: api_build.title ?? null,
  //     imageLinkWord: api_build.imageLinkWord ?? null,
  //   });
  //   setFormError("");;
  // };


  // const openCreate = (id:string, type:string) => {
  //   if (readOnly) return;
  //   setDraft({
  //     id: id,
  //     type: type as CombinationType,
  //     subtitle: "",
  //     text: "",
  //     title: "",
  //     imageLinkWord: "",
  //   });
  //   setFormError("");
  // };

const closeModal = () => {
  setDraft(emptyDraft);
  setFormError("");
  onClose();
};

  const handleSave = async () => {
      // add validation here
      setSaving(true);
      try {
        if (!combinationId) {
          throw Error("no combinationId passed to ApiPanel");
        }

        const existingApi = await getApibyId(combinationId);
        const isUpdate = !!existingApi;
        const combination = Combinations.find((c) => c.id === combinationId);
        if (!combination) {
          throw Error("Combination not found");
        }

        const payload = {
          type: combination.type,
          title: draft.title?.trim() ?? "",
          subtitle: draft.subtitle?.trim() ?? null,
          text: draft.text?.trim() ?? null,
          imageLinkWord: draft.imageLinkWord?.trim() ?? null,
        };
        if (isUpdate) {
          await updateApi_details(combinationId, payload);
        } else {
          await createApi_Details(combinationId, payload);
        }

        
        onNotify(isUpdate ? "Updated API build." : "Created API build.");
        
        closeModal();
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : "Failed to save api_config",
        );
      } finally {
        setSaving(false);
      }
    };
    const handleRunApi = async () => {
setLoadingApi(true);
try {
  if (!draft.id) return;
const result = await runApiAndGetResult(draft.id);
  setApiResult(result);
} finally {
  setLoadingApi(false);
}
};


return (
  <Modal
    open={open}
    title="API Builder"
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
        <button
          type="button"
          onClick={async () => {
            if (!combinationId) return;
            const result = await runApiAndGetResult(combinationId);
            setApiResult(result);
          }}
        >
          Load API Response
        </button>
      </>
    }
  >
 <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
  <div className="form-group">
    <label className="form-label">API Response</label>

    <textarea
      className="form-input"
      value={
        apiResult
          ? JSON.stringify(apiResult, null, 2)
          : "No response loaded"
      }
      readOnly
      style={{ minHeight: "200px", fontFamily: "monospace" }}
    />
  </div>
  <div className="form-group">
    <label className="form-label">Title</label>
    <input
      value={draft.title ?? ""}
      onChange={(e) =>
        setDraft({ ...draft, title: e.target.value })
      }
      className="form-input"
    />
  </div>

  <div className="form-group">
    <label className="form-label">Subtitle</label>
    <input
      value={draft.subtitle ?? ""}
      onChange={(e) =>
        setDraft({ ...draft, subtitle: e.target.value })
      }
      className="form-input"
    />
  </div>

  <div className="form-group">
    <label className="form-label">Text</label>
    <textarea
      value={draft.text ?? ""}
      onChange={(e) =>
        setDraft({ ...draft, text: e.target.value })
      }
      className="form-input"
    />
  </div>

  <div className="form-group">
    <label className="form-label">Image Link Word</label>
    <input
      value={draft.imageLinkWord ?? ""}
      onChange={(e) =>
        setDraft({ ...draft, imageLinkWord: e.target.value })
      }
      className="form-input"
    />
  </div>

  {formError && (
    <div className="error-message">
      <span className="error-text">{formError}</span>
    </div>
  )}

</div>

  </Modal>
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
