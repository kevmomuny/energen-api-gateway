import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import redisService from './services/redisService';
import authRouter from './routes/auth'; // Import auth routes
import apiRouter from './routes/api'; // Import API routes
import healthRouter from './routes/health'; // Import health check router
import { securityHeaders, corsMiddleware } from './middleware/security';
import { generalRateLimiter } from './middleware/rateLimit';
import logger from './utils/logger'; // Import logger
import { requestLogger } from './middleware/logging'; // Import request logger

dotenv.config(); // Ensure env vars are loaded

const app = express();
const port = process.env.PORT || 3000;

// Apply request logger first
app.use(requestLogger);

// Apply global security-related middleware first
app.use(securityHeaders()); // Helmet for security headers
app.use(corsMiddleware);   // CORS configuration

// Mount health check router before rate limiting and auth
// So that health checks are not overly restricted.
app.use('/', healthRouter); // Responds to /health

// Apply global rate limiting
// It's important to place rate limiter after CORS and Helmet,
// but before request parsing if possible, or at least before route handlers.
app.use(generalRateLimiter);

app.use(express.json()); // Middleware to parse JSON bodies

// Mount auth routes (e.g., /auth/login)
// Consider if /auth routes should also be behind the generalRateLimiter or have their own.
// For now, they are, which is fine.
app.use('/auth', authRouter);

// Mount API proxy routes (e.g., /api/v1/customers)
// These will also be subject to the generalRateLimiter
app.use('/', apiRouter); // This will handle all requests starting with /api/v1 as defined in apiRouter

app.get('/', (req: Request, res: Response) => {
  // This route will also be subject to the generalRateLimiter
  res.send('Welcome to the Energen API Gateway!');
});

app.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);
  try {
    // Attempt to get a key to verify connection
    // This is a good test, but redisService itself logs connection status.
    // Consider if this explicit check is still needed or if relying on RedisService's logs is enough.
    await redisService.get('__connectivity_test__');
    logger.info('Successfully connected to Redis (verified by test get).');
  } catch (error) {
    // redisService will also log connection errors. This might be redundant or provide extra context.
    logger.error(`Failed to connect to Redis (verified by test get): ${error instanceof Error ? error.message : String(error)}`);
  }
});
