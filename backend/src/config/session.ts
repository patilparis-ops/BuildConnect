import session from "express-session";
import pgSimple from "connect-pg-simple";

const PgSession = pgSimple(session);

export const sessionConfig: session.SessionOptions = {
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: "session",
    createTableIfMissing: true,
  }),
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
};
