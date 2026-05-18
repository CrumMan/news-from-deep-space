"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Rocket, Send, X } from "lucide-react";
import {
  BotLink,
  Combination,
  COMBINATIONS_STORAGE_KEY,
  FALLBACK_STORAGE_KEY,
  Keyword,
  KEYWORDS_STORAGE_KEY,
  loadCombinations,
  loadFallback,
  loadKeywords,
} from "../admin/bot-config";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  links?: BotLink[];
};

const WELCOME_MESSAGE: Message = {
  id: 1,
  text: "Hello! I'm your space assistant. Ask me about recent photos, articles, or specific topics like Mars and Jupiter.",
  isUser: false,
};

function tokenize(message: string): string[] {
  return message.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function findCombinationMatch(
  tokens: string[],
  combinations: Combination[],
): Combination | null {
  const tokenSet = new Set(tokens);
  const matches = combinations.filter((combination) =>
    combination.words.every((word) => tokenSet.has(word.toLowerCase())),
  );
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.words.length - a.words.length)[0];
}

function findKeywordMatch(
  tokens: string[],
  keywords: Keyword[],
): Keyword | null {
  const tokenSet = new Set(tokens);
  return (
    keywords.find((keyword) =>
      tokenSet.has(keyword.keyword.toLowerCase()),
    ) ?? null
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const keywordsRef = useRef<Keyword[]>([]);
  const combinationsRef = useRef<Combination[]>([]);
  const fallbackRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    keywordsRef.current = loadKeywords();
    combinationsRef.current = loadCombinations();
    fallbackRef.current = loadFallback();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === KEYWORDS_STORAGE_KEY) {
        keywordsRef.current = loadKeywords();
      } else if (event.key === COMBINATIONS_STORAGE_KEY) {
        combinationsRef.current = loadCombinations();
      } else if (event.key === FALLBACK_STORAGE_KEY) {
        fallbackRef.current = loadFallback();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const buildResponse = (userMessage: string): Message => {
    const tokens = tokenize(userMessage);

    const combinationMatch = findCombinationMatch(
      tokens,
      combinationsRef.current,
    );
    if (combinationMatch) {
      return {
        id: Date.now(),
        text: combinationMatch.response,
        isUser: false,
        links: combinationMatch.links,
      };
    }

    const keywordMatch = findKeywordMatch(tokens, keywordsRef.current);
    if (keywordMatch) {
      return {
        id: Date.now(),
        text: keywordMatch.response,
        isUser: false,
        links: keywordMatch.links,
      };
    }

    return {
      id: Date.now(),
      text: fallbackRef.current || "I can't help you with your issue.",
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
        {isOpen ? <X size={22} strokeWidth={2.5} /> : <MessageSquare size={24} />}
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
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
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
                Online • Ready to help
              </p>
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
                      {message.links.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.url}
                          style={{
                            color: message.isUser ? "#bbbdf6" : "#9b73a3",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{link.text}</span>
                          <ArrowRight size={14} />
                        </Link>
                      ))}
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
                  <span className="chat-dot" style={dotStyle} />
                  <span className="chat-dot" style={dotStyle} />
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
