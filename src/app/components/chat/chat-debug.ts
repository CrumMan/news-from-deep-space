/** Set NEXT_PUBLIC_CHAT_DEBUG=true in .env.local to show keyword IDs in chat (testing only). */
export function isChatDebugEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHAT_DEBUG === "true";
}

export function logChatDebug(lines: string[]): void {
  if (lines.length === 0) return;
  if (isChatDebugEnabled()) {
    console.debug("[chat debug]\n" + lines.join("\n"));
  }
}

export function formatDebugBlock(lines: string[]): string {
  logChatDebug(lines);
  if (!isChatDebugEnabled() || lines.length === 0) return "";
  return `${lines.join("\n")}\n\n`;
}
