import { createSolanaConnection, createMetaplex, createPublicKey } from '../../utils/solana';
import { transformBigIntToNumber } from '../../utils/serialization';
import axios from 'axios';

export const getTokenPrice = async (tokenAddress: string): Promise<string | null> => {
  try {
    const v2Response = await axios.get(`https://api.jup.ag/price/v2`, {
      params: {
        ids: tokenAddress
      }
    });
    
    if (v2Response.data && v2Response.data.data && v2Response.data.data[tokenAddress]) {
      return v2Response.data.data[tokenAddress].price;
    }
    
    const response = await axios.get(`https://price.jup.ag/v6/price`, {
      params: {
        ids: tokenAddress
      }
    });

    if (response.data && response.data.data && response.data.data[tokenAddress]) {
      return response.data.data[tokenAddress].price.toString();
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
};

export const getTokenMetadata = async (tokenAddress: string): Promise<any> => {
  try {
    const connection = createSolanaConnection();
    const metaplex = createMetaplex(connection);
    const mint = createPublicKey(tokenAddress);
    
    // Fetch price in parallel with metadata
    const pricePromise = getTokenPrice(tokenAddress);

    try {
      const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
      const price = await pricePromise;
      
      if (!nft) {
        return {
          tokenAddress,
          metadataFound: false,
          price: price || null,
          error: 'No metadata found for this token'
        };
      }
      
      return transformBigIntToNumber({
        name: nft.name || 'Unknown',
        symbol: nft.symbol || 'Unknown',
        uri: nft.uri || '',
        tokenAddress,
        metadataFound: true,
        price: price || null,
        metadata: nft.json || null
      });
    } catch (metaplexError) {
      console.error('Error in Metaplex findByMint:', metaplexError);
      
      const price = await pricePromise;
      
      return {
        tokenAddress,
        metadataFound: false,
        price: price || null,
        error: 'Failed to retrieve metadata',
        details: metaplexError instanceof Error ? metaplexError.message : 'Unknown error'
      };
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
};
