import request from 'supertest';
import express from 'express';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import routes from '../routes';
import { getUserData } from '../services/icp/userDataService';
import { getTokenMetadata } from '../services/solana/tokenService';
import { logPrincipalRequest } from '../db';

// Define types for our mocked functions
type UserData = {
  referralCode: string;
  referrerCode: string;
  queueIdx: number;
  rank: (string | number)[][];
  referralsLevel1: number;
  referralsLevel2: number;
  referralsLevel3: number;
  referrerWallet: string;
};

type TokenMetadata = {
  name: string;
  symbol: string;
  uri: string;
  tokenAddress: string;
  metadataFound: boolean;
  metadata: {
    name: string;
    symbol: string;
    description: string;
  };
};

// Mock dependencies
jest.mock('../services/icp/userDataService');
jest.mock('../services/solana/tokenService');
jest.mock('../db');

// Cast mocked functions with proper types
const mockedGetUserData = getUserData as jest.MockedFunction<typeof getUserData>;
const mockedGetTokenMetadata = getTokenMetadata as jest.MockedFunction<typeof getTokenMetadata>;
const mockedLogPrincipalRequest = logPrincipalRequest as jest.MockedFunction<typeof logPrincipalRequest>;

describe('API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', routes);

    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    mockedGetUserData.mockResolvedValue({
      referralCode: 'MOCK_CODE',
      referrerCode: '',
      queueIdx: 0,
      rank: [['mock-principal', 1]],
      referralsLevel1: 0,
      referralsLevel2: 0,
      referralsLevel3: 0,
      referrerWallet: ''
    });

    mockedGetTokenMetadata.mockResolvedValue({
      name: 'Mock Token',
      symbol: 'MOCK',
      uri: 'https://example.com/metadata',
      tokenAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      metadataFound: true,
      metadata: {
        name: 'Mock Token',
        symbol: 'MOCK',
        description: 'A mock token for testing'
      }
    });

    mockedLogPrincipalRequest.mockResolvedValue(undefined);
  });

  describe('GET /getUserData', () => {
    it('should work with a real principal ID', async () => {
      const realPrincipal = 'bx77d-5qpr6-p3fkb-kcipj-iqpre-bqges-v443n-fwcaf-lbpvg-cn4xk-cae';
      
      // Mock specific response for this principal
      mockedGetUserData.mockResolvedValueOnce({
        referralCode: 'PUPS1327478D55',
        referrerCode: '',
        queueIdx: 0,
        rank: [['yapsu-qrb4m-hsu7e-omaxj-z54lh-ftnku-b637p-rbhl5-pxjgd-dzn75-mqe', 3]],
        referralsLevel1: 0,
        referralsLevel2: 0,
        referralsLevel3: 0,
        referrerWallet: ''
      });
      
      const response = await request(app)
        .get('/api/getUserData')
        .query({ principal: realPrincipal });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('referralCode', 'PUPS1327478D55');
      expect(getUserData).toHaveBeenCalledWith(realPrincipal);
      expect(logPrincipalRequest).toHaveBeenCalledWith(realPrincipal);
    });

    it('should return 400 when principal is missing', async () => {
      const response = await request(app)
        .get('/api/getUserData');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Principal ID is required');
      expect(getUserData).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid principal format', async () => {
      const response = await request(app)
        .get('/api/getUserData')
        .query({ principal: 'invalid-principal' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid Principal ID format');
      expect(getUserData).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockedGetUserData.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .get('/api/getUserData')
        .query({ principal: '2vxsx-fae' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to fetch user data');
      expect(response.body.details).toContain('Service error');
    });
  });

  describe('GET /getMemecoinPrice', () => {
    it('should return token metadata for a valid contract address', async () => {
      const response = await request(app)
        .get('/api/getMemecoinPrice')
        .query({ contract: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Mock Token');
      expect(getTokenMetadata).toHaveBeenCalledWith('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
    });

    it('should return 400 when contract is missing', async () => {
      const response = await request(app)
        .get('/api/getMemecoinPrice');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Token contract address is required');
      expect(getTokenMetadata).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid contract address format', async () => {
      const response = await request(app)
        .get('/api/getMemecoinPrice')
        .query({ contract: 'invalid-address' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid Solana token address format');
      expect(getTokenMetadata).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockedGetTokenMetadata.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .get('/api/getMemecoinPrice')
        .query({ contract: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to fetch token metadata');
      expect(response.body.details).toContain('Service error');
    });
  });
}); 