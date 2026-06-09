import { sql } from "./database";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type AccountRow = {
  id: string;
  username: string;
  email: string;
  streak: number;
  is_admin: boolean;
};

export async function updateAccount(
  accountId: string,
  input: { username?: string; email?: string },
) {
  const username =
    input.username !== undefined ? input.username.trim() : undefined;
  const email = input.email !== undefined ? input.email.trim() : undefined;

  if (username !== undefined) {
    if (username.length < 3 || username.length > 40) {
      return {
        success: false as const,
        error: "Username must be 3-40 characters",
      };
    }
    const taken = await sql<{ id: string }[]>`
      SELECT id FROM account WHERE username = ${username} AND id <> ${accountId}
    `;
    if (taken.length > 0) {
      return { success: false as const, error: "Username already taken" };
    }
  }

  if (email !== undefined) {
    if (!EMAIL_REGEX.test(email)) {
      return { success: false as const, error: "Please enter a valid email" };
    }
    const taken = await sql<{ id: string }[]>`
      SELECT id FROM account WHERE email = ${email} AND id <> ${accountId}
    `;
    if (taken.length > 0) {
      return { success: false as const, error: "Email already in use" };
    }
  }

  if (username === undefined && email === undefined) {
    return { success: false as const, error: "Nothing to update" };
  }

  try {
    const rows = await sql<AccountRow[]>`
      UPDATE account
      SET
        username = CASE WHEN ${username !== undefined} THEN ${username ?? ""} ELSE username END,
        email = CASE WHEN ${email !== undefined} THEN ${email ?? ""} ELSE email END
      WHERE id = ${accountId}
      RETURNING id, username, email, streak, is_admin
    `;
    if (rows.length === 0) {
      return { success: false as const, error: "Account not found" };
    }
    return { success: true as const, data: rows[0] };
  } catch (error) {
    console.error("Account update failed:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Could not update account",
    };
  }
}
