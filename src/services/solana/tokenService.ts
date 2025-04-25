import { createSolanaConnection, createMetaplex, createPublicKey } from '../../utils/solana';
import { transformBigIntToNumber } from '../../utils/serialization';

export const getTokenMetadata = async (tokenAddress: string): Promise<any> => {
  try {
    const connection = createSolanaConnection();
    const metaplex = createMetaplex(connection);
    const mint = createPublicKey(tokenAddress);

    try {
      const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
      
      if (!nft) {
        return {
          tokenAddress,
          metadataFound: false,
          error: 'No metadata found for this token'
        };
      }
      
      return transformBigIntToNumber({
        name: nft.name || 'Unknown',
        symbol: nft.symbol || 'Unknown',
        uri: nft.uri || '',
        tokenAddress,
        metadataFound: true,
        metadata: nft.json || null
      });
    } catch (metaplexError) {
      console.error('Error in Metaplex findByMint:', metaplexError);
      
      return {
        tokenAddress,
        metadataFound: false,
        error: 'Failed to retrieve metadata',
        details: metaplexError instanceof Error ? metaplexError.message : 'Unknown error'
      };
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
};
