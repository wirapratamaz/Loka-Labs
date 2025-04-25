import { Router, Request, Response } from 'express';
import { getUserData } from '../services/icp/userDataService';
import { getTokenMetadata } from '../services/solana/tokenService';
import { logPrincipalRequest } from '../db';

const router = Router();

router.get('/getUserData', async (req: Request, res: Response) => {
  try {
    const { principal } = req.query;
    
    if (!principal || typeof principal !== 'string') {
      return res.status(400).json({ error: 'Principal ID is required' });
    }

    // I think need log the request to PostgreSQL
    await logPrincipalRequest(principal);
    
    // Call the ICP canister
    const userData = await getUserData(principal);
    
    return res.json(userData);
  } catch (error) {
    console.error('Error in getUserData endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch user data',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/getMemecoinPrice', async (req: Request, res: Response) => {
  try {
    const { contract } = req.query;
    
    if (!contract || typeof contract !== 'string') {
      return res.status(400).json({ error: 'Token contract address is required' });
    }
    
    // Fetch token metadata from Solana
    const tokenData = await getTokenMetadata(contract);
    
    return res.json(tokenData);
  } catch (error) {
    console.error('Error in getMemecoinPrice endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch token metadata',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;
