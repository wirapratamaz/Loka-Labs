import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;

export const createSolanaConnection = (): Connection => {
  if (!SOLANA_RPC_URL) {
    throw new Error('Solana RPC URL not configured');
  }
  return new Connection(SOLANA_RPC_URL);
};

export const createMetaplex = (connection: Connection): Metaplex => {
  return new Metaplex(connection);
};

export const createPublicKey = (address: string): PublicKey => {
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new Error(`Invalid Solana address format: ${address}`);
  }
}; 