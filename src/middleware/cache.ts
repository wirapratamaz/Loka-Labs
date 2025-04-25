import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface CacheOptions {
  maxAge?: number; // Cache duration in seconds
}

export const generateETag = (data: any): string => {
  const str = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return crypto.createHash('md5').update(str).digest('hex');
};

export const cacheControl = (options: CacheOptions = {}) => {
  const maxAge = options.maxAge || 60; // Default to 60 seconds

  return (req: Request, res: Response, next: NextFunction) => {
    // Store the original send function
    const originalSend = res.send;

    // Override the send function
    res.send = function(body?: any): Response {
      // Set Cache-Control header
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
      
      // Generate and set ETag
      if (body) {
        const etag = generateETag(body);
        res.setHeader('ETag', `"${etag}"`);
        
        // Check If-None-Match header for ETag match
        const ifNoneMatch = req.headers['if-none-match'];
        if (ifNoneMatch === `"${etag}"`) {
          res.status(304).send();
          return res;
        }
      }

      // Call the original send function
      return originalSend.call(this, body);
    };

    next();
  };
};

export const cacheUserData = () => {
  return cacheControl({ maxAge: 300 }); // Cache for 5 minutes
};

export const cacheTokenMetadata = () => {
  return cacheControl({ maxAge: 3600 }); // Cache for 1 hour
}; 