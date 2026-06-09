import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sqlClient: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __sqlClientUrl: string | undefined;
}

const DIRECT_SUPABASE_HOST = /^db\.([a-z0-9]+)\.supabase\.co$/;

/**
 * Supabase direct hosts (db.*.supabase.co) are often IPv6-only. Node on IPv4-only
 * networks fails with ENOTFOUND. Use the Session pooler URL from the dashboard
 * (Connect → Session) or set SUPABASE_POOLER_HOST to rewrite a direct URL.
 */
export function resolveDatabaseUrl(): string {
  const raw =
    process.env.DATABASE_POOLER_URL ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_NETLIFY_URL;

  if (!raw?.trim()) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (use the Supabase Session pooler string on port 5432, not the direct db.*.supabase.co host).",
    );
  }

  return normalizeSupabaseUrl(raw.trim());
}

function normalizeSupabaseUrl(url: string): string {
  const poolerHost = process.env.SUPABASE_POOLER_HOST?.trim();
  if (!poolerHost) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const match = parsed.hostname.match(DIRECT_SUPABASE_HOST);
    if (!match) {
      return url;
    }

    const projectRef = match[1];
    if (parsed.username === "postgres") {
      parsed.username = `postgres.${projectRef}`;
    }
    parsed.hostname = poolerHost;
    return parsed.toString();
  } catch {
    return url;
  }
}

function warnIfDirectSupabaseHost(connectionString: string) {
  try {
    const { hostname } = new URL(connectionString);
    if (DIRECT_SUPABASE_HOST.test(hostname)) {
      console.warn(
        "[db] DATABASE_URL uses Supabase direct host (IPv6). On IPv4-only networks this causes ENOTFOUND. " +
          "Use the Session pooler URL from Supabase Dashboard → Connect, or set SUPABASE_POOLER_HOST.",
      );
    }
  } catch {
    /* ignore invalid URL; postgres will surface the error */
  }
}

function createClient(connectionString: string) {
  warnIfDirectSupabaseHost(connectionString);
  return postgres(connectionString, { ssl: "require" });
}

function getSqlClient() {
  const connectionString = resolveDatabaseUrl();

  if (
    process.env.NODE_ENV !== "production" &&
    global.__sqlClient &&
    global.__sqlClientUrl !== connectionString
  ) {
    void global.__sqlClient.end({ timeout: 0 });
    global.__sqlClient = undefined;
  }

  if (!global.__sqlClient) {
    global.__sqlClient = createClient(connectionString);
    global.__sqlClientUrl = connectionString;
  }

  return global.__sqlClient;
}

export const sql = new Proxy((() => {}) as unknown as ReturnType<typeof postgres>, {
  apply(_target, _thisArg, args) {
    return Reflect.apply(getSqlClient() as unknown as Function, undefined, args);
  },
  get(_target, prop, receiver) {
    const client = getSqlClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
