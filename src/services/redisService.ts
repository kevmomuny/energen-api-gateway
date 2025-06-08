import Redis from 'ioredis';
import redisConfig, { RedisConfig } from '../../config/redis.config';
import logger from '../utils/logger'; // Import logger

class RedisService {
  public client: Redis; // Made public to be accessible by rate-limit-redis directly if needed, or keep private and expose methods

  constructor(config: RedisConfig) {
    this.client = new Redis(config.port, config.host, {
      password: config.password,
      // Potentially add retry strategy options here if needed
      // example:
      // retryStrategy: (times) => {
      //   const delay = Math.min(times * 50, 2000); // delay will be 50, 100, 150, ... 2000
      //   logger.warn(`Redis: Retrying connection - attempt ${times}, delay ${delay}ms`);
      //   return delay;
      // },
      // maxRetriesPerRequest: 3 // Example: Only retry commands 3 times
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis successfully.');
    });

    this.client.on('error', (error: Error) => {
      // The 'error' event can be noisy if retries are frequent.
      // Consider logging specific error types or only after several failed retries.
      logger.error(`Redis connection error: ${error.message}`);
    });

    this.client.on('reconnecting', (delay: number) => {
      // This event provides the delay before the next attempt.
      logger.info(`Redis: Reconnecting in ${delay}ms...`);
    });

    this.client.on('close', () => {
        logger.warn('Redis connection closed.');
    });

    this.client.on('end', () => {
        logger.warn('Redis connection ended. (No more reconnections will be attempted without manual intervention)');
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }
}

export default new RedisService(redisConfig);
