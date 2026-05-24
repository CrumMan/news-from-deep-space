"use client";

import { useEffect } from "react";
import { apiFetch, getCurrentAccount, saveSession } from "../admin/bot-config";

export function useStreakIncrement() {
  useEffect(() => {
    const account = getCurrentAccount();
    if (!account) return;

    let cancelled = false;
    apiFetch<{ streak: number }>(`/api/accounts/${account.id}/streak`, {
      method: "POST",
    })
      .then((res) => {
        if (cancelled) return;
        const token = localStorage.getItem("authToken");
        if (!token) return;
        saveSession(token, { ...account, streak: res.streak });
      })
      .catch(() => {
        // Streak is best-effort; ignore failures.
      });

    return () => {
      cancelled = true;
    };
  }, []);
}
