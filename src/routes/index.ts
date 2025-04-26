import express, { Router, Request, Response, NextFunction } from 'express';
import { getUserData } from '../services/icp/userDataService';
import { getTokenMetadata } from '../services/solana/tokenService';
import { logPrincipalRequest } from '../db';
import { isValidPrincipal, isValidSolanaAddress } from '../utils/validation';
import { cacheUserData, cacheTokenMetadata } from '../middleware/cache';

// Initialize router
const router = express.Router();

// Debug route - only accessible in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/debug', (req: express.Request, res: express.Response) => {
    res.json({
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        SOLANA_RPC_URL: process.env.SOLANA_RPC_URL ? '***configured***' : 'not configured',
        DATABASE_URL: process.env.DATABASE_URL ? '***configured***' : 'not configured'
      }
    });
  });
}

// Define routes
router.get('/getUserData', 
  cacheUserData(), // Add caching middleware with 5-minute cache
  async function(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { principal } = req.query;
      
      if (!principal || typeof principal !== 'string') {
        res.status(400).json({ error: 'Principal ID is required' });
        return;
      }

      if (!isValidPrincipal(principal)) {
        res.status(400).json({ error: 'Invalid Principal ID format' });
        return;
      }

      // I think need Log the request to PostgreSQL
      try {
        await logPrincipalRequest(principal);
      } catch (dbError) {
        console.error('Warning: Failed to log request to database:', dbError);
      }
      
      // Call the ICP canister
      const userData = await getUserData(principal);
      
      res.json(userData);
    } catch (error) {
      console.error('Error in getUserData endpoint:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user data',
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
);

router.get('/getMemecoinPrice', 
  cacheTokenMetadata(), // Add caching middleware with 1-hour cache
  async function(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { contract } = req.query;
      
      if (!contract || typeof contract !== 'string') {
        res.status(400).json({ error: 'Token contract address is required' });
        return;
      }
      
      if (!isValidSolanaAddress(contract)) {
        res.status(400).json({ error: 'Invalid Solana token address format' });
        return;
      }
      
      // Fetch token metadata from Solana
      const tokenData = await getTokenMetadata(contract);
      
      res.json(tokenData);
    } catch (error) {
      console.error('Error in getMemecoinPrice endpoint:', error);
      res.status(500).json({ 
        error: 'Failed to fetch token metadata',
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
);

export default router;
