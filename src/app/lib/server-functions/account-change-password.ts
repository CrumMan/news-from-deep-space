import { sql } from "./database";
import { hashPassword, verifyPassword } from "../password";

export async function changeAccountPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
) {
  if (newPassword.length < 6) {
    return {
      success: false as const,
      error: "New password must be at least 6 characters",
    };
  }

  try {
    const rows = await sql<{ password_hash: string }[]>`
      SELECT password_hash FROM account WHERE id = ${id}
    `;
    if (rows.length === 0) {
      return { success: false as const, error: "Account not found" };
    }

    const matches = await verifyPassword(currentPassword, rows[0].password_hash);
    if (!matches) {
      return { success: false as const, error: "Current password is incorrect" };
    }

    const nextHash = await hashPassword(newPassword);
    await sql`UPDATE account SET password_hash = ${nextHash} WHERE id = ${id}`;

    return { success: true as const };
  } catch (error) {
    console.error("Password change failed:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Could not change password",
    };
  }
}
