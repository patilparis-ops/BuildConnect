declare module "connect-pg-simple" {
  import { Store, SessionOptions } from "express-session";
  import { PoolConfig } from "pg";

  interface PgSessionOptions {
    conString?: string;
    conObject?: PoolConfig;
    pool?: any;
    tableName?: string;
    createTableIfMissing?: boolean;
    schemaName?: string;
    pruneSessionInterval?: number;
    errorLog?: (...args: any[]) => void;
  }

  function connectPgSimple(session: any): new (options?: PgSessionOptions) => Store;

  export = connectPgSimple;
}
