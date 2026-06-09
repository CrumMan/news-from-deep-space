// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { ArrowRight, MessageSquare, Rocket, Send, X } from "lucide-react";
// import {
//   Combination,
//   Keyword,
//   fetchCombinations,
//   fetchKeywords,
//   loadFallback,
// } from "../admin/bot-config";

// type BotLink = {
//   text: string;
//   url: string;
// };

// type Message = {
//   id: number;
//   text: string;
//   isUser: boolean;
//   links?: BotLink[];
// };

// const WELCOME_MESSAGE: Message = {
//   id: 1,
//   text: "Hello! I'm your space assistant. Mention two topics you want to combine — e.g. 'James Webb' and 'telescope' — and I'll find a link or live data for you.",
//   isUser: false,
// };

// function escapeRegex(text: string): string {
//   return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

// function keywordMatches(message: string, keyword: Keyword): boolean {
//   const lowered = message.toLowerCase();
//   const candidates = [keyword.keyword, ...keyword.synonyms];
//   return candidates.some((candidate) => {
//     const term = candidate.trim().toLowerCase();
//     if (!term) return false;
//     const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, "i");
//     return pattern.test(lowered);
//   });
// }

// function findMatches(
//   message: string,
//   keywords: Keyword[],
//   combinations: Combination[],
// ): { combination: Combination | null; matchedKeywords: Keyword[] } {
//   const matchedKeywords = keywords.filter((k) => keywordMatches(message, k));
//   const matchedIds = new Set(matchedKeywords.map((k) => k.id));
//   const combination =
//     combinations.find(
//       (combo) =>
//         matchedIds.has(combo.fk_keyword1) && matchedIds.has(combo.fk_keyword2),
//     ) ?? null;
//   return { combination, matchedKeywords };
// }

// function buildLinkForCombination(combination: Combination): BotLink {
//   const label = `${combination.keyword1} + ${combination.keyword2}`;
//   if (combination.type === "api") {
//     const separator = combination.result.includes("?") ? "&" : "?";
//     const url = combination.api_key
//       ? `${combination.result}${separator}api_key=${encodeURIComponent(combination.api_key)}`
//       : combination.result;
//     return { text: `Live data: ${label}`, url };
//   }
//   return { text: `Open ${label}`, url: combination.result };
// }

// export default function ChatBot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const keywordsRef = useRef<Keyword[]>([]);
//   const combinationsRef = useRef<Combination[]>([]);
//   const fallbackRef = useRef<string>("");
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     fallbackRef.current = loadFallback();

//     let cancelled = false;
//     const loadData = async () => {
//       try {
//         const [k, c] = await Promise.all([
//           fetchKeywords(),
//           fetchCombinations(),
//         ]);
//         if (cancelled) return;
//         keywordsRef.current = k;
//         combinationsRef.current = c;
//       } catch {
//         // The chat still works with empty data; we'll just fall back.
//       }
//     };
//     loadData();

//     const refresh = () => {
//       fallbackRef.current = loadFallback();
//       loadData();
//     };
//     window.addEventListener("focus", refresh);
//     window.addEventListener("storage", refresh);

//     return () => {
//       cancelled = true;
//       window.removeEventListener("focus", refresh);
//       window.removeEventListener("storage", refresh);
//     };
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isLoading]);

//   const buildResponse = (userMessage: string): Message => {
//     const { combination, matchedKeywords } = findMatches(
//       userMessage,
//       keywordsRef.current,
//       combinationsRef.current,
//     );

//     if (combination) {
//       const link = buildLinkForCombination(combination);
//       return {
//         id: Date.now(),
//         text:
//           combination.type === "api"
//             ? `Here's today's data for "${combination.keyword1}" and "${combination.keyword2}":`
//             : `Here's the resource for "${combination.keyword1}" and "${combination.keyword2}":`,
//         isUser: false,
//         links: [link],
//       };
//     }

//     if (matchedKeywords.length === 1) {
//       const matched = matchedKeywords[0];
//       const partners = combinationsRef.current
//         .filter(
//           (c) => c.fk_keyword1 === matched.id || c.fk_keyword2 === matched.id,
//         )
//         .map((c) => (c.fk_keyword1 === matched.id ? c.keyword2 : c.keyword1));
//       const suggestion = partners.length
//         ? ` Try pairing it with: ${partners.slice(0, 3).join(", ")}.`
//         : "";
//       return {
//         id: Date.now(),
//         text: `I recognize "${matched.keyword}", but I need a second topic to give you something useful.${suggestion}`,
//         isUser: false,
//       };
//     }

//     return {
//       id: Date.now(),
//       text: fallbackRef.current || "I can't help you with your issue.",
//       isUser: false,
//     };
//   };

//   const handleSendMessage = () => {
//     const trimmed = input.trim();
//     if (!trimmed) return;

//     const userMessage: Message = {
//       id: Date.now(),
//       text: trimmed,
//       isUser: true,
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     window.setTimeout(() => {
//       const response = buildResponse(trimmed);
//       setMessages((prev) => [...prev, response]);
//       setIsLoading(false);
//     }, 400);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           position: "fixed",
//           bottom: "20px",
//           right: "20px",
//           width: "60px",
//           height: "60px",
//           borderRadius: "50%",
//           backgroundColor: "#7a5980",
//           color: "white",
//           border: "none",
//           cursor: "pointer",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
//           transition: "all 0.3s ease",
//           zIndex: 1000,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: "24px",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = "scale(1.1)";
//           e.currentTarget.style.backgroundColor = "#9b73a3";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "scale(1)";
//           e.currentTarget.style.backgroundColor = "#7a5980";
//         }}
//         aria-label={isOpen ? "Close chat" : "Open chat"}
//       >
//         {isOpen ? (
//           <X size={22} strokeWidth={2.5} />
//         ) : (
//           <MessageSquare size={24} />
//         )}
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "100px",
//             right: "20px",
//             width: "380px",
//             height: "500px",
//             backgroundColor: "#2a2a42",
//             borderRadius: "12px",
//             boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
//             display: "flex",
//             flexDirection: "column",
//             zIndex: 1000,
//             border: "1px solid rgba(187, 189, 246, 0.2)",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               padding: "1rem",
//               backgroundColor: "#3b3b58",
//               borderBottom: "1px solid #7a5980",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <div
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 borderRadius: "10px",
//                 background: "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#1a1a2e",
//                 flexShrink: 0,
//               }}
//             >
//               <Rocket size={20} strokeWidth={2.2} />
//             </div>
//             <div>
//               <h3 style={{ color: "#bbbdf6", margin: 0, fontSize: "1rem" }}>
//                 Space Assistant
//               </h3>
//               <p style={{ color: "#d1d5db", margin: 0, fontSize: "0.75rem" }}>
//                 Online • Ready to help
//               </p>
//             </div>
//           </div>

//           <div
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               padding: "1rem",
//               display: "flex",
//               flexDirection: "column",
//               gap: "0.75rem",
//             }}
//           >
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 style={{
//                   display: "flex",
//                   justifyContent: message.isUser ? "flex-end" : "flex-start",
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: "80%",
//                     padding: "0.75rem",
//                     borderRadius: "12px",
//                     backgroundColor: message.isUser ? "#7a5980" : "#3b3b58",
//                     color: message.isUser ? "white" : "#e0e0e0",
//                     border: message.isUser
//                       ? "none"
//                       : "1px solid rgba(187, 189, 246, 0.2)",
//                   }}
//                 >
//                   <p
//                     style={{
//                       margin: 0,
//                       fontSize: "0.875rem",
//                       lineHeight: "1.5",
//                       whiteSpace: "pre-wrap",
//                     }}
//                   >
//                     {message.text}
//                   </p>
//                   {message.links && message.links.length > 0 && (
//                     <div
//                       style={{
//                         marginTop: "0.75rem",
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "0.5rem",
//                       }}
//                     >
//                       {message.links.map((link, idx) => {
//                         const isExternal = /^https?:\/\//i.test(link.url);
//                         const linkStyle: React.CSSProperties = {
//                           color: message.isUser ? "#bbbdf6" : "#9b73a3",
//                           textDecoration: "none",
//                           fontSize: "0.875rem",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: "0.35rem",
//                         };
//                         if (isExternal) {
//                           return (
//                             <a
//                               key={idx}
//                               href={link.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               style={linkStyle}
//                             >
//                               <span>{link.text}</span>
//                               <ArrowRight size={14} />
//                             </a>
//                           );
//                         }
//                         return (
//                           <Link
//                             key={idx}
//                             href={link.url}
//                             style={linkStyle}
//                             onClick={() => setIsOpen(false)}
//                           >
//                             <span>{link.text}</span>
//                             <ArrowRight size={14} />
//                           </Link>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div style={{ display: "flex", justifyContent: "flex-start" }}>
//                 <div
//                   style={{
//                     padding: "0.75rem",
//                     borderRadius: "12px",
//                     backgroundColor: "#3b3b58",
//                     display: "flex",
//                     gap: "4px",
//                   }}
//                 >
//                   <span className="chat-dot" style={dotStyle} />
//                   <span className="chat-dot" style={dotStyle} />
//                   <span className="chat-dot" style={dotStyle} />
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <div
//             style={{
//               padding: "1rem",
//               borderTop: "1px solid rgba(187, 189, 246, 0.2)",
//               display: "flex",
//               gap: "0.5rem",
//             }}
//           >
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Ask about space..."
//               style={{
//                 flex: 1,
//                 padding: "0.5rem 0.75rem",
//                 backgroundColor: "#3b3b58",
//                 border: "1px solid #7a5980",
//                 borderRadius: "8px",
//                 color: "white",
//                 fontFamily: "inherit",
//                 fontSize: "0.875rem",
//               }}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isLoading || !input.trim()}
//               aria-label="Send message"
//               style={{
//                 padding: "0.5rem 0.85rem",
//                 backgroundColor: "#7a5980",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
//                 opacity: isLoading || !input.trim() ? 0.5 : 1,
//                 transition: "all 0.2s ease",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Send size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// const dotStyle: React.CSSProperties = {
//   width: "8px",
//   height: "8px",
//   borderRadius: "50%",
//   backgroundColor: "#bbbdf6",
//   display: "inline-block",
// };

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Rocket, Send, X } from "lucide-react";
import {
  Combination,
  Keyword,
  fetchCombinations,
  fetchKeywords,
  loadFallback,
} from "../admin/bot-config";

type BotLink = {
  text: string;
  url: string;
};

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  links?: BotLink[];
};

interface KeywordDictionary {
  [word: string]: string; // word -> keyword_id
}

class KeywordDictionaryService {
  private dictionary: KeywordDictionary = {};
  private keywords: Keyword[] = [];

  // 1. Read All call Returns List of Keywords
  async loadKeywords(keywords: Keyword[]): Promise<void> {
    this.keywords = keywords;
    this.buildDictionary();
  }

  // 2. Build Dictionary: Map each word to Keyword ID
  //    For each Keyword_Entity:
  //      ND.Add(Keyword_Entity, Keyword_Keyword_Entity)
  //      For each Synonym in Keyword_Entity.Synonyms:
  //        ND.Add(synonym, Keyword_Entity.Id)
  buildDictionary(): void {
    const dict: KeywordDictionary = {};

    for (const entry of this.keywords) {
      // Add the main keyword
      dict[entry.keyword.toLowerCase()] = entry.id;

      // Add each synonym
      if (entry.synonyms && entry.synonyms.length > 0) {
        for (const synonym of entry.synonyms) {
          const synonymLower = synonym.toLowerCase().trim();
          if (synonymLower) {
            dict[synonymLower] = entry.id;
          }
        }
      }
    }

    this.dictionary = dict;

    // 3. Stringify and save Keyword dictionary into session storage
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "keyword_dictionary",
        JSON.stringify(this.dictionary),
      );
      console.log(
        `Saved ${Object.keys(this.dictionary).length} keyword mappings to sessionStorage`,
      );
    }
  }

  // Load dictionary from session storage
  loadFromSessionStorage(): KeywordDictionary | null {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("keyword_dictionary");
      if (stored) {
        this.dictionary = JSON.parse(stored);
        return this.dictionary;
      }
    }
    return null;
  }

  // Get keyword ID by word (with synonym matching)
  getKeywordId(word: string): string | null {
    const normalizedWord = word.toLowerCase().trim();
    return this.dictionary[normalizedWord] || null;
  }

  // Get keyword object by ID
  getKeywordById(id: string): Keyword | null {
    return this.keywords.find((k) => k.id === id) || null;
  }

  // Search user message for matching keywords
  // Returns matching keyword IDs with their positions
  searchMessageForKeywords(
    message: string,
  ): { keywordId: string; matchedWord: string; position: number }[] {
    const words = message.toLowerCase().split(/\s+/);
    const matches: {
      keywordId: string;
      matchedWord: string;
      position: number;
    }[] = [];
    const matchedIds = new Set<string>();

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const keywordId = this.getKeywordId(word);
      if (keywordId && !matchedIds.has(keywordId)) {
        matchedIds.add(keywordId);
        matches.push({
          keywordId,
          matchedWord: word,
          position: i,
        });
      }
    }

    return matches;
  }

  // Get statistics
  getStats() {
    return {
      totalKeywords: this.keywords.length,
      totalMappings: Object.keys(this.dictionary).length,
    };
  }
}

// Singleton instance
const keywordDictionary = new KeywordDictionaryService();

const WELCOME_MESSAGE: Message = {
  id: 1,
  text: "Hello! I'm your space assistant. I can help you find space content. Try asking about Mars, photos, articles, or combine two topics like 'James Webb' and 'telescope'!",
  isUser: false,
};

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordMatches(message: string, keyword: Keyword): boolean {
  const lowered = message.toLowerCase();
  const candidates = [keyword.keyword, ...(keyword.synonyms || [])];
  return candidates.some((candidate) => {
    const term = candidate.trim().toLowerCase();
    if (!term) return false;
    const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, "i");
    return pattern.test(lowered);
  });
}

function findMatches(
  message: string,
  keywords: Keyword[],
  combinations: Combination[],
): { combination: Combination | null; matchedKeywords: Keyword[] } {
  const matchedKeywords = keywords.filter((k) => keywordMatches(message, k));
  const matchedIds = new Set(matchedKeywords.map((k) => k.id));
  const combination =
    combinations.find(
      (combo) =>
        matchedIds.has(combo.fk_keyword1) && matchedIds.has(combo.fk_keyword2),
    ) ?? null;
  return { combination, matchedKeywords };
}

function buildLinkForCombination(combination: Combination): BotLink {
  const label = `${combination.keyword1} + ${combination.keyword2}`;
  if (combination.type === "photo") {
    const separator = combination.result.includes("?") ? "&" : "?";
    const url = combination.api_key
      ? `${combination.result}${separator}api_key=${encodeURIComponent(combination.api_key)}`
      : combination.result;
    return { text: `Live data: ${label}`, url };
  }
  return { text: `Open ${label}`, url: combination.result };
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dictionaryReady, setDictionaryReady] = useState(false);

  const keywordsRef = useRef<Keyword[]>([]);
  const combinationsRef = useRef<Combination[]>([]);
  const fallbackRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fallbackRef.current = loadFallback();

    let cancelled = false;
    const loadData = async () => {
      try {
        const [k, c] = await Promise.all([
          fetchKeywords(),
          fetchCombinations(),
        ]);
        if (cancelled) return;
        keywordsRef.current = k;
        combinationsRef.current = c;

        // Load keywords into dictionary for fast lookup
        await keywordDictionary.loadKeywords(k);
        setDictionaryReady(true);

        console.log(
          `📚 Dictionary ready: ${keywordDictionary.getStats().totalMappings} mappings from ${k.length} keywords`,
        );
      } catch (error) {
        console.error("Error loading data:", error);
        // Try to load from session storage as fallback
        const cached = keywordDictionary.loadFromSessionStorage();
        if (cached) {
          console.log(
            `📦 Loaded ${Object.keys(cached).length} mappings from cache`,
          );
          setDictionaryReady(true);
        }
      }
    };
    loadData();

    const refresh = () => {
      fallbackRef.current = loadFallback();
      loadData();
    };
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const buildResponse = (userMessage: string): Message => {
    // First, try to find combination matches (two keywords together)
    const { combination, matchedKeywords } = findMatches(
      userMessage,
      keywordsRef.current,
      combinationsRef.current,
    );

    if (combination) {
      const link = buildLinkForCombination(combination);
      return {
        id: Date.now(),
        text:
          combination.type === "photo"
            ? `Here's today's data for "${combination.keyword1}" and "${combination.keyword2}":`
            : `Here's the resource for "${combination.keyword1}" and "${combination.keyword2}":`,
        isUser: false,
        links: [link],
      };
    }

    // If only one keyword matched, suggest pairing it
    if (matchedKeywords.length === 1) {
      const matched = matchedKeywords[0];
      const partners = combinationsRef.current
        .filter(
          (c) => c.fk_keyword1 === matched.id || c.fk_keyword2 === matched.id,
        )
        .map((c) => (c.fk_keyword1 === matched.id ? c.keyword2 : c.keyword1));
      const suggestion = partners.length
        ? ` Try pairing it with: ${partners.slice(0, 3).join(", ")}.`
        : " Try adding another topic like 'photos', 'articles', or a specific planet.";
      return {
        id: Date.now(),
        text: `I recognize "${matched.keyword}", but I need a second topic to give you something useful.${suggestion}`,
        isUser: false,
      };
    }

    // If no matches, use fallback
    return {
      id: Date.now(),
      text:
        fallbackRef.current ||
        "I can't help you with your issue. Try asking about Mars, photos, or articles!",
      isUser: false,
    };
  };

  const handleSendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      text: trimmed,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    window.setTimeout(() => {
      const response = buildResponse(trimmed);
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#7a5980",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "#9b73a3";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#7a5980";
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={22} strokeWidth={2.5} />
        ) : (
          <MessageSquare size={24} />
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "380px",
            height: "500px",
            backgroundColor: "#2a2a42",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            border: "1px solid rgba(187, 189, 246, 0.2)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#3b3b58",
              borderBottom: "1px solid #7a5980",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1a1a2e",
                  flexShrink: 0,
                }}
              >
                <Rocket size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h3 style={{ color: "#bbbdf6", margin: 0, fontSize: "1rem" }}>
                  Space Assistant
                </h3>
                <p style={{ color: "#d1d5db", margin: 0, fontSize: "0.75rem" }}>
                  {dictionaryReady ? " Ready" : "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: message.isUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    backgroundColor: message.isUser ? "#7a5980" : "#3b3b58",
                    color: message.isUser ? "white" : "#e0e0e0",
                    border: message.isUser
                      ? "none"
                      : "1px solid rgba(187, 189, 246, 0.2)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.text}
                  </p>
                  {message.links && message.links.length > 0 && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {message.links.map((link, idx) => {
                        const isExternal = /^https?:\/\//i.test(link.url);
                        const linkStyle: React.CSSProperties = {
                          color: message.isUser ? "#bbbdf6" : "#9b73a3",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        };
                        if (isExternal) {
                          return (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={linkStyle}
                            >
                              <span>{link.text}</span>
                              <ArrowRight size={14} />
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={idx}
                            href={link.url}
                            style={linkStyle}
                            onClick={() => setIsOpen(false)}
                          >
                            <span>{link.text}</span>
                            <ArrowRight size={14} />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "12px",
                    backgroundColor: "#3b3b58",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <span className="chat-dot" style={dotStyle} />
                  <span
                    className="chat-dot"
                    style={{ ...dotStyle, animationDelay: "-0.32s" }}
                  />
                  <span
                    className="chat-dot"
                    style={{ ...dotStyle, animationDelay: "-0.16s" }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid rgba(187, 189, 246, 0.2)",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about space..."
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                backgroundColor: "#3b3b58",
                border: "1px solid #7a5980",
                borderRadius: "8px",
                color: "white",
                fontFamily: "inherit",
                fontSize: "0.875rem",
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              style={{
                padding: "0.5rem 0.85rem",
                backgroundColor: "#7a5980",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                opacity: isLoading || !input.trim() ? 0.5 : 1,
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        .chat-dot {
          animation: bounce 1.4s infinite ease-in-out both;
        }
      `}</style>
    </>
  );
}

const dotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#bbbdf6",
  display: "inline-block",
};
