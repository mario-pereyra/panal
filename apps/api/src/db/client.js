import { mkdir } from "node:fs/promises";
import pg from "pg";

const PG_DATE_OID = 1082;

export async function createDb({ url, dataDir } = {}) {
  return url ? createPostgresDb(url) : createPgliteDb(dataDir);
}

async function createPostgresDb(url) {
  const pool = new pg.Pool({
    connectionString: url.replace(/([?&]sslmode=)require\b/, "$1verify-full"),
    max: 10,
    types: {
      getTypeParser: (oid, format) =>
        oid === PG_DATE_OID ? (value) => value : pg.types.getTypeParser(oid, format),
    },
  });
  pool.on("error", (error) => console.error("Idle PostgreSQL client error:", error));
  await pool.query("select 1");

  const createExecutor = (client) => ({
    query: async (sql, params = []) => (await client.query(sql, params)).rows,
    queryOne: async (sql, params = []) => (await client.query(sql, params)).rows[0],
    exec: async (sql) => {
      await client.query(sql);
    },
  });

  return {
    engine: "postgres",
    ...createExecutor(pool),
    async transaction(work) {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const result = await work(createExecutor(client));
        await client.query("commit");
        return result;
      } catch (error) {
        try {
          await client.query("rollback");
        } catch (rollbackError) {
          console.error("PostgreSQL rollback error:", rollbackError);
        }
        throw error;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

async function createPgliteDb(dataDir) {
  const { PGlite, types: pgliteTypes } = await import("@electric-sql/pglite");
  if (dataDir) await mkdir(dataDir, { recursive: true });
  const db = new PGlite({
    dataDir,
    parsers: { [pgliteTypes.DATE]: (value) => value },
  });
  await db.waitReady;

  const createExecutor = (conn) => ({
    query: async (sql, params = []) => (await conn.query(sql, params)).rows,
    queryOne: async (sql, params = []) => (await conn.query(sql, params)).rows[0],
    exec: async (sql) => {
      await conn.exec(sql);
    },
  });

  return {
    engine: "pglite",
    ...createExecutor(db),
    transaction: (work) => db.transaction((tx) => work(createExecutor(tx))),
    close: () => db.close(),
  };
}

export function isUniqueViolation(error, constraint) {
  const { code, constraint: errorConstraint } = error ?? {};
  return code === "23505" && (!constraint || errorConstraint === constraint);
}

export function buildUpdateSet(allowedColumns, changes) {
  const columns = allowedColumns.filter(
    (column) => column in changes && changes[column] !== undefined,
  );
  if (columns.length === 0) return null;
  return {
    clause: columns.map((column, index) => `${column} = $${index + 2}`).join(", "),
    values: columns.map((column) => changes[column]),
  };
}
