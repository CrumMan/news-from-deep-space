import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sqlClient: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local or Netlify environment variables.",
    );
  }
  return postgres(connectionString, { ssl: "require" });
}

export const sql = global.__sqlClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  global.__sqlClient = sql;
}
