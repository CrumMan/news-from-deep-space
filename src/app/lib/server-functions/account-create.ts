import { sql } from "./database";
import { hashPassword } from "../password";

type AccountRow = {
  id: string;
  username: string;
  is_admin: boolean;
};

export async function createAccount(username: string, password: string) {
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 40) {
    return { success: false as const, error: "Username must be 3-40 characters" };
  }
  if (password.length < 6) {
    return { success: false as const, error: "Password must be at least 6 characters" };
  }

  try {
    const existing = await sql`
      SELECT id FROM account WHERE username = ${trimmed}
    `;
    if (existing.length > 0) {
      return { success: false as const, error: "Username already taken" };
    }

    const passwordHash = await hashPassword(password);
    const rows = await sql<AccountRow[]>`
      INSERT INTO account (username, password_hash)
      VALUES (${trimmed}, ${passwordHash})
      RETURNING id, username, is_admin
    `;

    return { success: true as const, data: rows[0] };
  } catch (error) {
    console.error("Account create failed:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Could not create account",
    };
  }
}
