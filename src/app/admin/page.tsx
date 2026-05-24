// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { MessageCircle, Puzzle, Type } from "lucide-react";
// import {
//   Combination,
//   Keyword,
//   loadCombinations,
//   loadFallback,
//   loadKeywords,
//   saveCombinations,
//   saveFallback,
//   saveKeywords,
// } from "./bot-config";
// import KeywordPanel from "./keyword-panel";
// import CombinationPanel from "./combination-panel";
// import Toast from "./toast";

// type TabId = "keywords" | "combinations" | "fallback";

// const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
//   { id: "keywords", label: "Keywords", icon: <Type size={16} /> },
//   {
//     id: "combinations",
//     label: "Word Combinations",
//     icon: <Puzzle size={16} />,
//   },
//   {
//     id: "fallback",
//     label: "Fallback Message",
//     icon: <MessageCircle size={16} />,
//   },
// ];

// export default function AdminPage() {
//   const [activeTab, setActiveTab] = useState<TabId>("keywords");
//   const [keywords, setKeywords] = useState<Keyword[]>([]);
//   const [combinations, setCombinations] = useState<Combination[]>([]);
//   const [fallback, setFallback] = useState("");
//   const [fallbackDraft, setFallbackDraft] = useState("");
//   const [hydrated, setHydrated] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);

//   useEffect(() => {
//     setKeywords(loadKeywords());
//     setCombinations(loadCombinations());
//     const storedFallback = loadFallback();
//     setFallback(storedFallback);
//     setFallbackDraft(storedFallback);
//     setHydrated(true);
//   }, []);

//   const handleKeywordsChange = (next: Keyword[]) => {
//     setKeywords(next);
//     saveKeywords(next);
//   };

//   const handleCombinationsChange = (next: Combination[]) => {
//     setCombinations(next);
//     saveCombinations(next);
//   };

//   const handleSaveFallback = () => {
//     const trimmed = fallbackDraft.trim();
//     if (!trimmed) {
//       setToast("Fallback message cannot be empty.");
//       return;
//     }
//     setFallback(trimmed);
//     saveFallback(trimmed);
//     setToast("Fallback message updated.");
//   };

//   return (
//     <>
//       <section
//         style={{
//           background:
//             "linear-gradient(135deg, rgba(59, 59, 88, 0.95) 0%, rgba(42, 42, 66, 0.95) 100%)",
//           borderBottom: "1px solid rgba(187, 189, 246, 0.15)",
//         }}
//       >
//         <div
//           className="container"
//           style={{ paddingTop: "3rem", paddingBottom: "2.5rem" }}
//         >
//           <span
//             style={{
//               display: "inline-block",
//               padding: "4px 12px",
//               borderRadius: "999px",
//               background: "rgba(187, 189, 246, 0.15)",
//               border: "1px solid rgba(187, 189, 246, 0.3)",
//               color: "#bbbdf6",
//               fontSize: "0.75rem",
//               fontWeight: 600,
//               letterSpacing: "0.05em",
//               textTransform: "uppercase",
//               marginBottom: "0.75rem",
//             }}
//           >
//             Admin Dashboard
//           </span>
//           <h1
//             style={{
//               fontSize: "2.25rem",
//               fontWeight: 700,
//               margin: "0 0 0.5rem",
//               background: "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//             }}
//           >
//             Chat Assistant Controls
//           </h1>
//           <p
//             style={{
//               margin: 0,
//               color: "#d1d5db",
//               maxWidth: "640px",
//               fontSize: "1rem",
//             }}
//           >
//             Configure the deterministic chat assistant. Customize the words and
//             word combinations the bot recognizes, and set the response it falls
//             back to when nothing matches.
//           </p>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//               gap: "0.75rem",
//               marginTop: "2rem",
//             }}
//           >
//             <StatTile label="Keywords" value={keywords.length} />
//             <StatTile label="Combinations" value={combinations.length} />
//             <StatTile
//               label="Fallback Message"
//               value={fallback ? "Custom" : "Default"}
//             />
//           </div>
//         </div>
//       </section>

//       <div
//         style={{
//           position: "sticky",
//           top: "72px",
//           zIndex: 50,
//           background: "rgba(42, 42, 66, 0.92)",
//           backdropFilter: "blur(8px)",
//           borderBottom: "1px solid rgba(187, 189, 246, 0.1)",
//         }}
//       >
//         <div
//           className="container"
//           style={{
//             display: "flex",
//             gap: "0.5rem",
//             overflowX: "auto",
//             padding: "0.75rem 20px",
//           }}
//         >
//           {TABS.map((tab) => {
//             const isActive = tab.id === activeTab;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: "0.5rem",
//                   padding: "8px 16px",
//                   borderRadius: "8px",
//                   border: isActive
//                     ? "1px solid rgba(187, 189, 246, 0.4)"
//                     : "1px solid transparent",
//                   background: isActive
//                     ? "rgba(187, 189, 246, 0.15)"
//                     : "transparent",
//                   color: isActive ? "#ffffff" : "#d1d5db",
//                   fontFamily: "inherit",
//                   fontSize: "0.875rem",
//                   fontWeight: isActive ? 600 : 500,
//                   cursor: "pointer",
//                   transition: "all 0.2s ease",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <span>{tab.icon}</span>
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <div
//         className="container"
//         style={{ paddingTop: "2rem", paddingBottom: "3rem" }}
//       >
//         {!hydrated ? (
//           <div
//             style={{
//               textAlign: "center",
//               color: "#a0a0b0",
//               padding: "3rem 0",
//             }}
//           >
//             Loading configuration…
//           </div>
//         ) : (
//           <>
//             {activeTab === "keywords" && (
//               <KeywordPanel
//                 keywords={keywords}
//                 onChange={handleKeywordsChange}
//                 onNotify={setToast}
//               />
//             )}

//             {activeTab === "combinations" && (
//               <CombinationPanel
//                 combinations={combinations}
//                 onChange={handleCombinationsChange}
//                 onNotify={setToast}
//               />
//             )}

//             {activeTab === "fallback" && (
//               <div
//                 style={{
//                   maxWidth: "640px",
//                   background: "rgba(59, 59, 88, 0.7)",
//                   border: "1px solid rgba(187, 189, 246, 0.15)",
//                   borderRadius: "12px",
//                   padding: "1.5rem",
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: "0 0 0.5rem",
//                     fontSize: "1.25rem",
//                     fontWeight: 600,
//                     color: "#ffffff",
//                   }}
//                 >
//                   Fallback Message
//                 </h2>
//                 <p
//                   style={{
//                     margin: "0 0 1.25rem",
//                     color: "#a0a0b0",
//                     fontSize: "0.875rem",
//                   }}
//                 >
//                   Shown to the user when no keyword or combination matches the
//                   message.
//                 </p>
//                 <div className="form-group">
//                   <label className="form-label">Message</label>
//                   <textarea
//                     value={fallbackDraft}
//                     onChange={(e) => setFallbackDraft(e.target.value)}
//                     rows={4}
//                     className="form-input"
//                     style={{ resize: "vertical" }}
//                   />
//                 </div>
//                 <div style={{ display: "flex", gap: "0.75rem" }}>
//                   <button
//                     type="button"
//                     onClick={handleSaveFallback}
//                     className="button-primary"
//                   >
//                     Save Message
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setFallbackDraft(fallback)}
//                     style={{
//                       background: "transparent",
//                       border: "1px solid rgba(187, 189, 246, 0.3)",
//                       color: "#e0e0e0",
//                       padding: "10px 20px",
//                       borderRadius: "8px",
//                       cursor: "pointer",
//                       fontFamily: "inherit",
//                       fontWeight: 500,
//                     }}
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
//     </>
//   );
// }

// function StatTile({ label, value }: { label: string; value: string | number }) {
//   return (
//     <div
//       style={{
//         background: "rgba(42, 42, 66, 0.6)",
//         border: "1px solid rgba(187, 189, 246, 0.15)",
//         borderRadius: "10px",
//         padding: "0.85rem 1rem",
//       }}
//     >
//       <p
//         style={{
//           margin: 0,
//           fontSize: "0.7rem",
//           color: "#a0a0b0",
//           textTransform: "uppercase",
//           letterSpacing: "0.06em",
//         }}
//       >
//         {label}
//       </p>
//       <p
//         style={{
//           margin: "0.25rem 0 0",
//           fontSize: "1.4rem",
//           fontWeight: 700,
//           color: "#bbbdf6",
//         }}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// ********************************Admin page with keyword create, update and delete functions integrated with DB. These functions are used in the API route for keywords.********************************

"use client";

import { ReactNode, useEffect, useState } from "react";
import { MessageCircle, Puzzle, Type } from "lucide-react";
import {
  Combination,
  Keyword,
  loadCombinations,
  loadFallback,
  loadKeywords,
  saveCombinations,
  saveFallback,
  saveKeywords,
} from "./bot-config";
import KeywordPanel from "./keyword-panel";
import CombinationPanel from "./combination-panel";
import Toast from "./toast";

type TabId = "keywords" | "combinations" | "fallback";

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "keywords", label: "Keywords", icon: <Type size={16} /> },
  {
    id: "combinations",
    label: "Word Combinations",
    icon: <Puzzle size={16} />,
  },
  {
    id: "fallback",
    label: "Fallback Message",
    icon: <MessageCircle size={16} />,
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("keywords");
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [fallback, setFallback] = useState("");
  const [fallbackDraft, setFallbackDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Create keyword with synonyms
  const handleCreateKeyword = async (word: string, synonyms: string[]) => {
    try {
      const response = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: word, synonyms: synonyms }),
      });

      const result = await response.json();

      if (result.success) {
        await loadKeywordsFromAPI();
        setToast(`Keyword "${word}" created successfully!`);
        return { success: true };
      } else {
        setToast(result.error || "Failed to create keyword");
        return { success: false, error: result.error };
      }
    } catch (error) {
      setToast("Network error while creating keyword");
      return { success: false, error: error.message };
    }
  };

  // Remove synonym form keyword
  const handleRemoveSynonym = async (
    keyword: string,
    synonymToRemove: string,
  ) => {
    try {
      const response = await fetch("/api/keywords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, synonymToRemove }),
      });

      const result = await response.json();

      if (result.success) {
        await loadKeywordsFromAPI();
        setToast(`Synonym removed from "${keyword}"`);
        return { success: true };
      } else {
        setToast(result.error || "Failed to remove synonym");
        return { success: false, error: result.error };
      }
    } catch (error) {
      setToast("Network error while removing synonym");
      return { success: false, error: error.message };
    }
  };

  // Delete keyword with cascade effect
  const handleDeleteKeyword = async (keyword: string) => {
    try {
      const response = await fetch("/api/keywords", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      const result = await response.json();

      if (result.success) {
        await loadKeywordsFromAPI();
        setToast(`Keyword "${keyword}" deleted with cascade effect!`);
        return { success: true };
      } else {
        setToast(result.error || "Failed to delete keyword");
        return { success: false, error: result.error };
      }
    } catch (error) {
      setToast("Network error while deleting keyword");
      return { success: false, error: error.message };
    }
  };

  // Helper function to load keywords from API
  const loadKeywordsFromAPI = async () => {
    try {
      const response = await fetch("/api/keywords/combined");
      const data = await response.json();

      if (data.success && data.data) {
        const apiKeywords: Keyword[] = data.data.map((item: any) => ({
          id: item.id,
          word: item.keyword,
          synonyms: item.synonyms || [],
        }));
        setKeywords(apiKeywords);
        saveKeywords(apiKeywords);
      }
    } catch (error) {
      console.error("Error loading keywords from API:", error);
    }
  };

  useEffect(() => {
    // Load keywords from API on mount
    loadKeywordsFromAPI();
    setCombinations(loadCombinations());
    const storedFallback = loadFallback();
    setFallback(storedFallback);
    setFallbackDraft(storedFallback);
    setHydrated(true);
  }, []);

  const handleKeywordsChange = (next: Keyword[]) => {
    setKeywords(next);
    saveKeywords(next);
  };

  const handleCombinationsChange = (next: Combination[]) => {
    setCombinations(next);
    saveCombinations(next);
  };

  const handleSaveFallback = () => {
    const trimmed = fallbackDraft.trim();
    if (!trimmed) {
      setToast("Fallback message cannot be empty.");
      return;
    }
    setFallback(trimmed);
    saveFallback(trimmed);
    setToast("Fallback message updated.");
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
            Configure the deterministic chat assistant. Customize the words and
            word combinations the bot recognizes, and set the response it falls
            back to when nothing matches.
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
                onChange={handleKeywordsChange}
                onNotify={setToast}
                onCreateKeyword={handleCreateKeyword}
                onRemoveSynonym={handleRemoveSynonym}
                onDeleteKeyword={handleDeleteKeyword}
              />
            )}

            {activeTab === "combinations" && (
              <CombinationPanel
                combinations={combinations}
                onChange={handleCombinationsChange}
                onNotify={setToast}
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
                  Shown to the user when no keyword or combination matches the
                  message.
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

      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
    </>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
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
