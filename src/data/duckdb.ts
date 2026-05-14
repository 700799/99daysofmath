import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;
let parquetRegistered = false;

async function bootstrap(): Promise<duckdb.AsyncDuckDB> {
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
  const worker = new Worker(eh_worker, { type: 'module' });
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(duckdb_wasm);
  return db;
}

export async function getDB(): Promise<duckdb.AsyncDuckDB> {
  if (!dbPromise) {
    dbPromise = bootstrap();
  }
  return dbPromise;
}

export async function registerProblemsParquet(): Promise<string> {
  const db = await getDB();
  const fileName = 'problems.parquet';
  if (!parquetRegistered) {
    const url = `${import.meta.env.BASE_URL}data/problems.parquet`;
    await db.registerFileURL(
      fileName,
      url,
      duckdb.DuckDBDataProtocol.HTTP,
      false,
    );
    parquetRegistered = true;
  }
  return fileName;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
): Promise<T[]> {
  const db = await getDB();
  const conn = await db.connect();
  try {
    const result = await conn.query(sql);
    return result.toArray().map((row: { toJSON: () => T }) => row.toJSON());
  } finally {
    await conn.close();
  }
}
