import { Pool } from 'pg';

const pool = new Pool();

export const logPrincipalRequest = async (principal: string): Promise<void> => {
  try {
    await pool.query(
      'INSERT INTO request_wors (principal) VALUES ($1)',
      [principal]
    );
  } catch (error) {
    console.error('Error logging principal request:', error);
    throw error;
  }
};

export default pool;
