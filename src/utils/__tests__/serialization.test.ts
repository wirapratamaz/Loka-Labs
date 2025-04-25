import { describe, it, expect } from '@jest/globals';
import { transformBigIntToNumber } from '../serialization';

describe('Serialization Utilities', () => {
  describe('transformBigIntToNumber', () => {
    it('should convert BigInt to Number when within safe integer range', () => {
      const result = transformBigIntToNumber(BigInt(123));
      expect(result).toBe(123);
      expect(typeof result).toBe('number');
    });

    it('should convert BigInt to String when outside safe integer range', () => {
      const bigValue = BigInt('9007199254740992'); // MAX_SAFE_INTEGER + 1
      const result = transformBigIntToNumber(bigValue);
      expect(result).toBe('9007199254740992');
      expect(typeof result).toBe('string');
    });

    it('should handle null and undefined values', () => {
      expect(transformBigIntToNumber(null)).toBe(null);
      expect(transformBigIntToNumber(undefined)).toBe(undefined);
    });

    it('should process arrays recursively', () => {
      const input = [BigInt(1), BigInt(2), BigInt(3)];
      const expected = [1, 2, 3];
      expect(transformBigIntToNumber(input)).toEqual(expected);
    });

    it('should process objects recursively', () => {
      const input = {
        a: BigInt(1),
        b: {
          c: BigInt(2)
        },
        d: [BigInt(3)]
      };
      const expected = {
        a: 1,
        b: {
          c: 2
        },
        d: [3]
      };
      expect(transformBigIntToNumber(input)).toEqual(expected);
    });

    it('should return non-BigInt values as is', () => {
      expect(transformBigIntToNumber('string')).toBe('string');
      expect(transformBigIntToNumber(123)).toBe(123);
      expect(transformBigIntToNumber(true)).toBe(true);
    });
  });
}); 