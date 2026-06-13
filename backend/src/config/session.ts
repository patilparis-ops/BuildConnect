import session from "express-session";
import pg from "pg";

function createSessionStore() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("[session] DATABASE_URL not set — using in-memory store (sessions lost on restart)");
    return undefined;
  }

  // Allow PGSSLMODE env var to override SSL behavior.
  // Supabase connections commonly need rejectUnauthorized: false even in
  // production because their pooler's certificate may not match the
  // connection hostname.
  let ssl: pg.PoolConfig["ssl"];
  const sslMode = (process.env.PGSSLMODE || (process.env.NODE_ENV === "production" ? "require" : "prefer")).toLowerCase();

  switch (sslMode) {
    case "disable":
      ssl = false;
      break;
    case "allow":
    case "prefer":
      ssl = { rejectUnauthorized: false };
      break;
    case "require":
    case "verify-ca":
    case "verify-full":
    default:
      ssl = { rejectUnauthorized: sslMode === "verify-full" };
      break;
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl,
    max: 3,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 30000,
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PgStore = require("connect-pg-simple")(session) as new (opts: Record<string, unknown>) => session.Store;
    return new PgStore({ pool, tableName: "session", createTableIfMissing: true });
  } catch (err) {
    console.warn("[session] connect-pg-simple init failed:", (err as Error).message);
    console.warn("[session] Falling back to in-memory store (sessions lost on restart)");
    pool.end().catch(() => {});
    return undefined;
  }
}

export const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || "fallback-secret",
  name: "bc.sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
  store: createSessionStore(),
};
