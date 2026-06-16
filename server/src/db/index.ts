import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Load environment variables (useful if running directly/tests outside of docker)
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing. Please define it in your .env or Docker environments.');
}

/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: DATABASE CONNECTION POOLING
 * ----------------------------------------------------------------------------
 * Creating a database connection is an expensive network operation.
 * If we open a new connection for every single HTTP request:
 *   1. It adds 50-100ms of latency per request just to perform the TCP/TLS handshake.
 *   2. The database will quickly run out of file descriptors and memory under high load.
 * 
 * To solve this, we use a Connection Pool (`pg.Pool`).
 * 
 * - The pool creates a fixed set of connections on startup (e.g., max: 20).
 * - When a request arrives, it "borrows" an idle connection from the pool.
 * - Once the query completes, the connection is returned to the pool for reuse.
 * - This drops query latency to near 0ms overhead.
 * ============================================================================
 */
const pool = new Pool({
  connectionString,
  // Maximum number of clients the pool should contain
  max: 20,
  // Number of milliseconds a client must sit idle in the pool before being closed
  idleTimeoutMillis: 30000,
  // Number of milliseconds to wait before timing out when connecting a new client
  connectionTimeoutMillis: 2000,
});

// Handle idle client connection errors (e.g., database restarts, network drops)
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
