import { sql } from "./database";

export async function deleteAccountById(id: string) {
  try {
    const rows = await sql<{ id: string }[]>`
      DELETE FROM account WHERE id = ${id} RETURNING id
    `;
    if (rows.length === 0) {
      return { success: false as const, error: "Account not found" };
    }
    return { success: true as const, id: rows[0].id };
  } catch (error) {
    console.error("Account delete failed:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Could not delete account",
    };
  }
}
