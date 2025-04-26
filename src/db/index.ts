import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Export query function
export const query = async (text: string, params?: any[]) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Log principal request to database
export const logPrincipalRequest = async (principal: string): Promise<void> => {
  try {
    await query(
      'INSERT INTO request_logs (principal) VALUES ($1)',
      [principal]
    );
  } catch (error) {
    console.error('Error logging principal request:', error);
    throw error;
  }
};

// Initialize database by creating tables if they don't exist
export const initDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS request_logs (
        id SERIAL PRIMARY KEY,
        principal TEXT NOT NULL,
        called_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_request_logs_principal ON request_logs(principal);
    `;
    
    await query(createTableQuery);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
};

// Export pool for transaction support
export default pool;
