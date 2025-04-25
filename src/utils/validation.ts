import { Principal } from '@dfinity/principal';
import { PublicKey } from '@solana/web3.js';

export const isValidPrincipal = (principal: string): boolean => {
  try {
    Principal.fromText(principal);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}; 