import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisService from '../services/redisService';
import logger from '../utils/logger'; // Import logger

let store: RedisStore | undefined;
let skipRateLimiting = false;

if (!redisService || !redisService.client || typeof redisService.client.call !== 'function') {
  logger.error('Redis client is not available or not compatible for rate limiter. Rate limiting will be skipped or use memory store.');
  // Fallback to memory store if Redis is not available, or skip rate limiting.
  // For this example, we will skip rate limiting if Redis is not properly configured.
  skipRateLimiting = true;
} else {
  store = new RedisStore({

    sendCommand: (...args: string[]) => {
      // This assumes redisService.client is an ioredis client.
      return (redisService.client as any).call(...args);
    },
  });
  logger.info('Rate limiter connected to Redis.');
}

export const generalRateLimiter = rateLimit({
  store: !skipRateLimiting ? store : undefined, // Use RedisStore only if client is available and compatible
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs (or per user if keyGenerator is used)
  message: {
    status: 429,
    message: 'Too many requests, please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req, _res) => {
    if (skipRateLimiting) {
      logger.warn(`Rate limiting skipped for ${req.ip} because Redis client is not available.`);
      return true;
    }
    return false;
  },
  handler: (req, _res, _next, options) => {
    logger.warn(
      `Rate limit exceeded for ${req.ip}: ${req.method} ${req.originalUrl}. Limit: ${options.max} requests per ${options.windowMs / 60000} minutes.`,
    );
    _res.status(options.statusCode).json(options.message);
  },
});

// Example of a more specific rate limiter for login (optional)
// export const loginRateLimiter = rateLimit({
//   store: store,
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 5, // limit each IP to 5 login attempts per windowMs
//   message: 'Too many login attempts, please try again after 5 minutes.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
