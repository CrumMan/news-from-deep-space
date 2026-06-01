import { sql } from "./database";
import { hashPassword } from "../password";

type AccountRow = {
  id: string;
  username: string;
  is_admin: boolean;
};

export async function createAccount(username: string, password: string, email:string) {
  const trimmed = username.trim();
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const trimmedEmail = email.trim();
  if (trimmed.length < 3 || trimmed.length > 40) {
    return { success: false as const, error: "Username must be 3-40 characters" };
  }
  if (password.length < 6) {
    return { success: false as const, error: "Password must be at least 6 characters" };
  }
if(!emailRegex.test(trimmedEmail)){
      return{success:false as const, error: "Please enter an email"}
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
      INSERT INTO account (username, password_hash,email)
      VALUES (${trimmed}, ${passwordHash},${email})
      RETURNING id, username,email, is_admin
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
