import { describe, it, expect } from '@jest/globals';
import { isValidPrincipal, isValidSolanaAddress } from '../validation';

describe('Validation Utilities', () => {
  describe('isValidPrincipal', () => {
    it('should return true for valid Principal IDs', () => {
      expect(isValidPrincipal('2vxsx-fae')).toBe(true);
      expect(isValidPrincipal('yapsu-qrb4m-hsu7e-omaxj-z54lh-ftnku-b637p-rbhl5-pxjgd-dzn75-mqe')).toBe(true);
    });

    it('should return false for invalid Principal IDs', () => {
      expect(isValidPrincipal('')).toBe(false);
      expect(isValidPrincipal('invalid-id')).toBe(false);
      expect(isValidPrincipal('123456')).toBe(false);
      expect(isValidPrincipal('xvsx-fae')).toBe(false); // Missing required character
    });
  });

  describe('isValidSolanaAddress', () => {
    it('should return true for valid Solana addresses', () => {
      expect(isValidSolanaAddress('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263')).toBe(true);
      expect(isValidSolanaAddress('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')).toBe(true);
    });

    it('should return false for invalid Solana addresses', () => {
      expect(isValidSolanaAddress('')).toBe(false);
      expect(isValidSolanaAddress('invalid-address')).toBe(false);
      expect(isValidSolanaAddress('123456')).toBe(false);
      expect(isValidSolanaAddress('DezXAZ8z7PnrnRJjz3wX')).toBe(false); // Too short
    });
  });
}); 