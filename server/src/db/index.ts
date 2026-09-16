import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Load environment variables (useful if running directly/tests outside of docker)
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[Database Warning] DATABASE_URL environment variable is missing. Database operations will be mocked or throw on query.');
}

const pool = new Pool({
  connectionString: connectionString || 'postgres://localhost:5432/creatoriq_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

/**
 * Helper utility to execute query queries.
 * This automatically acquires a client from the pool, runs the query,
 * and releases it back to the pool, ensuring no connection leaks.
 * 
 * @param text The SQL query string
 * @param params The query parameters (to prevent SQL injection)
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Performance logging to identify slow queries in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Database Query] executed in ${duration}ms | Rows: ${res.rowCount}`);
    }
    return res;
  } catch (error: any) {
    console.error(`[Database Error] Query: "${text}" | Message:`, error.message);
    throw error;
  }
}

/**
 * Helper utility to acquire a single dedicated client from the pool.
 * Use this ONLY when you need to run TRANSACTIONS (BEGIN, COMMIT, ROLLBACK).
 * 
 * IMPORTANT: You must call `client.release()` in a `finally` block when done,
 * otherwise the connection is permanently lost to the pool (Connection Leak).
 */
export async function getTransactionClient(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}

export default pool;
