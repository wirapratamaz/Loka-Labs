import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;

export const getTokenMetadata = async (tokenAddress: string): Promise<any> => {
  try {
    if (!SOLANA_RPC_URL) {
      throw new Error('Solana RPC URL not configured');
    }

    const connection = new Connection(SOLANA_RPC_URL);
    const metaplex = new Metaplex(connection);
    const mint = new PublicKey(tokenAddress);

    // Fetch token metadata
    const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
    
    return {
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.uri,
      tokenAddress,
      metadata: nft.json
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
};
