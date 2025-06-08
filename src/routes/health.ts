import { Router, Request, Response } from 'express';
import redisService from '../services/redisService';
import logger from '../utils/logger';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  let apiStatus = 'UP';
  let redisStatus = 'UP';
  let httpStatusCode = 200;

  // Check Redis Connectivity
  try {
    const pingResponse = await redisService.client.ping();
    if (pingResponse !== 'PONG') {
      throw new Error('Redis PING command did not return PONG.');
    }
    logger.debug('Health check: Redis PING successful.');
  } catch (error: any) {
    logger.error(`Health check: Redis connection error - ${error.message}`);
    redisStatus = 'DOWN';
    apiStatus = 'DEGRADED'; // Or 'DOWN' if Redis is absolutely critical for basic operation
    httpStatusCode = 503; // Service Unavailable
  }

  // Future checks for other critical dependencies can be added here.
  // For example, database connectivity.

  // If any critical dependency is down, the overall API status might be considered 'DOWN'.
  // For now, Redis being down makes the API 'DEGRADED' or 'DOWN'.
  if (redisStatus === 'DOWN') {
    apiStatus = 'DOWN'; // Marking API as DOWN if Redis is down.
  }

  const healthResponse = {
    status: apiStatus,
    timestamp: new Date().toISOString(),
    dependencies: [
      {
        name: 'Redis',
        status: redisStatus,
      },
      // {
      //   name: 'Database', // Example for future
      //   status: dbStatus,
      // }
    ],
  };

  res.status(httpStatusCode).json(healthResponse);
});

export default router;
