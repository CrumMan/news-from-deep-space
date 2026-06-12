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
import {
  buildKeywordDictionary,
  loadKeywordDictionaryFromStorage,
  type KeywordDictionary,
} from "./chat/keyword-dictionary";
import {
  processUserMessage,
  type ChatMessage,
} from "./chat/process-message";
import { saveLinkCookie } from "./chat/combination-response";
import { createChatMessageId } from "./chat/message-id";

const WELCOME_MESSAGE: ChatMessage = {
  id: 1,
  text: "Hello! I'm your space assistant. Try asking for the daily photo or article of the day — use the keyword pairs configured in admin (e.g. \"Daily\" + \"Photo\").",
  isUser: false,
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

const imageStyle: React.CSSProperties = {
  width: "100%",
  maxHeight: "160px",
  objectFit: "cover",
  borderRadius: "8px",
  border: "1px solid rgba(187, 189, 246, 0.25)",
  cursor: "pointer",
};

function ChatAttachments({
  message,
  onNavigate,
}: {
  message: ChatMessage;
  onNavigate?: () => void;
}) {
  if (!message.attachments?.length && !message.links?.length) return null;

  const linkStyle: React.CSSProperties = {
    color: "#9b73a3",
    textDecoration: "none",
    fontSize: "0.875rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
  };

  return (
    <div
      style={{
        marginTop: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {message.attachments?.map((attachment, idx) => (
        <div key={`att-${idx}`}>
          {attachment.type === "image" && attachment.imageUrl && (
            isExternalHref(attachment.href) ? (
              <a
                href={attachment.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", textDecoration: "none" }}
                onClick={() => saveLinkCookie(attachment.href)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.imageUrl}
                  alt={attachment.alt ?? "Space photo"}
                  style={imageStyle}
                />
              </a>
            ) : (
              <Link
                href={attachment.href}
                style={{ display: "block", textDecoration: "none" }}
                onClick={() => {
                  saveLinkCookie(attachment.href);
                  onNavigate?.();
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.imageUrl}
                  alt={attachment.alt ?? "Space photo"}
                  style={imageStyle}
                />
              </Link>
            )
          )}
          {attachment.linkText && (
            attachment.type === "image" && isExternalHref(attachment.href) ? (
              <a
                href={attachment.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, marginTop: attachment.imageUrl ? "0.5rem" : 0 }}
                onClick={() => saveLinkCookie(attachment.href)}
              >
                <span>{attachment.linkText}</span>
                <ArrowRight size={14} />
              </a>
            ) : (
              <Link
                href={attachment.href}
                style={{ ...linkStyle, marginTop: attachment.imageUrl ? "0.5rem" : 0 }}
                onClick={() => {
                  saveLinkCookie(attachment.href);
                  onNavigate?.();
                }}
              >
                <span>{attachment.linkText}</span>
                <ArrowRight size={14} />
              </Link>
            )
          )}
        </div>
      ))}

      {message.links
        ?.filter(
          (link) =>
            !message.attachments?.some((a) => a.href === link.url),
        )
        .map((link, idx) => {
          if (isExternalHref(link.url)) {
            return (
              <a
                key={`link-${idx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onClick={() => saveLinkCookie(link.url)}
              >
                <span>{link.text}</span>
                <ArrowRight size={14} />
              </a>
            );
          }
          return (
            <Link
              key={`link-${idx}`}
              href={link.url}
              style={linkStyle}
              onClick={() => {
                saveLinkCookie(link.url);
                onNavigate?.();
              }}
            >
              <span>{link.text}</span>
              <ArrowRight size={14} />
            </Link>
          );
        })}
    </div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dictionaryReady, setDictionaryReady] = useState(false);

  const keywordsRef = useRef<Keyword[]>([]);
  const combinationsRef = useRef<Combination[]>([]);
  const dictionaryRef = useRef<KeywordDictionary>({});
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
        dictionaryRef.current = buildKeywordDictionary(k);
        setDictionaryReady(true);
      } catch (error) {
        console.error("Error loading chat data:", error);
        const cached = loadKeywordDictionaryFromStorage();
        if (cached) {
          dictionaryRef.current = cached;
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

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: createChatMessageId(),
      text: trimmed,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { message } = await processUserMessage(
        trimmed,
        keywordsRef.current,
        combinationsRef.current,
        dictionaryRef.current,
        fallbackRef.current,
      );
      setMessages((prev) => [...prev, message]);
    } catch (err) {
      console.error("Chat response failed", err);
      setMessages((prev) => [
        ...prev,
        {
          id: createChatMessageId(),
          text: "Something went wrong building the response. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
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
                  {dictionaryReady ? "Ready" : "Loading…"}
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
                    maxWidth: "85%",
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
                  {!message.isUser && (
                    <ChatAttachments
                      message={message}
                      onNavigate={() => setIsOpen(false)}
                    />
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
              placeholder="Ask about space…"
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
              onClick={() => void handleSendMessage()}
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
