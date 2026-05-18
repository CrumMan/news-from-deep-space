"use client";

import { useEffect } from "react";

export type ToastTone = "success" | "info" | "error";

type ToastProps = {
  message: string | null;
  tone?: ToastTone;
  onDismiss: () => void;
};

const TONE_COLORS: Record<ToastTone, { bg: string; border: string }> = {
  success: { bg: "rgba(34, 94, 70, 0.95)", border: "#34d399" },
  info: { bg: "rgba(59, 59, 88, 0.95)", border: "#bbbdf6" },
  error: { bg: "rgba(127, 29, 29, 0.95)", border: "#ef4444" },
};

export default function Toast({
  message,
  tone = "success",
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const colors = TONE_COLORS[tone];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: colors.bg,
        color: "#ffffff",
        border: `1px solid ${colors.border}`,
        borderRadius: "10px",
        padding: "0.75rem 1.25rem",
        fontSize: "0.875rem",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
        zIndex: 2500,
        maxWidth: "90vw",
      }}
      role="status"
    >
      {message}
    </div>
  );
}
