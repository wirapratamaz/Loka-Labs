export const transformBigIntToNumber = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    // Convert BigInt to Number, but only if it's within safe integer range
    return Number.isSafeInteger(Number(obj)) ? Number(obj) : obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(transformBigIntToNumber);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = transformBigIntToNumber(obj[key]);
    }
    return result;
  }
  
  return obj;
};