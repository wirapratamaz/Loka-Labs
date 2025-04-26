import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://solana-mainnet.core.chainstack.com/0b3667bc9528fbc40d84210164bf1d5e';

export const createSolanaConnection = (): Connection => {
  console.log('Using Solana RPC URL:', SOLANA_RPC_URL);
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