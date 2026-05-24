import fs from "fs/promises";
import path from "path";
import { sql } from "../../db";

export async function runMigrations(): Promise<{ ok: true; applied: string[] }> {
  const schemaPath = path.join(process.cwd(), "src/app/lib/schema.sql");
  const schema = await fs.readFile(schemaPath, "utf-8");
  await sql.unsafe(schema);
  return { ok: true, applied: ["schema.sql"] };
}
