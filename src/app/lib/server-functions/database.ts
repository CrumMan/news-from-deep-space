import postgres from "postgres";

const sql = postgres(process.env.NETLIFY_DATABASE_URL!, {
  ssl: "require",
  idle_timeout: 10,
  max: 10,
});

export { sql };
