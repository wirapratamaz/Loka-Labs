import { Request, Response, NextFunction } from 'express';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { generateETag, cacheControl } from '../cache';

describe('Cache Middleware', () => {
  describe('generateETag', () => {
    it('should generate consistent ETags for identical objects', () => {
      const obj1 = { name: 'Test', value: 123 };
      const obj2 = { name: 'Test', value: 123 };
      
      expect(generateETag(obj1)).toBe(generateETag(obj2));
    });
    
    it('should generate different ETags for different objects', () => {
      const obj1 = { name: 'Test', value: 123 };
      const obj2 = { name: 'Test', value: 456 };
      
      expect(generateETag(obj1)).not.toBe(generateETag(obj2));
    });
    
    it('should handle non-object values', () => {
      expect(generateETag('test string')).toBeTruthy();
      expect(generateETag(123)).toBeTruthy();
    });
  });
  
  describe('cacheControl', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    
    beforeEach(() => {
      req = {
        headers: {}
      };
      
      res = {
        setHeader: jest.fn().mockReturnThis() as Response['setHeader'],
        status: jest.fn().mockReturnThis() as Response['status'],
        send: jest.fn().mockReturnThis() as Response['send']
      };
      
      next = jest.fn();
    });
    
    it('should add Cache-Control header with default max-age', () => {
      const middleware = cacheControl();
      middleware(req as Request, res as Response, next);
      
      // Call the modified send method
      res.send!({});
      
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'public, max-age=60');
    });
    
    it('should add Cache-Control header with custom max-age', () => {
      const middleware = cacheControl({ maxAge: 300 });
      middleware(req as Request, res as Response, next);
      
      // Call the modified send method
      res.send!({});
      
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'public, max-age=300');
    });
    
    it('should add ETag header for response body', () => {
      const middleware = cacheControl();
      middleware(req as Request, res as Response, next);
      
      const body = { test: 'data' };
      res.send!(body);
      
      expect(res.setHeader).toHaveBeenCalledWith('ETag', expect.any(String));
    });
    
    it('should return 304 Not Modified when ETag matches If-None-Match header', () => {
      const body = { test: 'data' };
      const etag = generateETag(body);
      
      req.headers = {
        'if-none-match': `"${etag}"`
      };
      
      const middleware = cacheControl();
      middleware(req as Request, res as Response, next);
      
      res.send!(body);
      
      expect(res.status).toHaveBeenCalledWith(304);
    });
    
    it('should call next function', () => {
      const middleware = cacheControl();
      middleware(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalled();
    });
  });
}); 