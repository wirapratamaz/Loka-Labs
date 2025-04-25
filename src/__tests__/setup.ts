// Setup global jest namespace for Bun tests
import { beforeEach, afterEach, jest } from '@jest/globals';

// Make jest available globally
Object.assign(global, { jest, beforeEach, afterEach }); 