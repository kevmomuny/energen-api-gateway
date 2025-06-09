import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const getDurationInMilliseconds = (start: [number, number]): number => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e-6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) * NS_TO_MS;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || '';

  // Log incoming request
  // Mask sensitive data in body if necessary, for now logging basic info
  logger.http(`Incoming Request: ${method} ${originalUrl} - IP: ${ip} - UserAgent: ${userAgent}`);
  if (Object.keys(req.body).length > 0 && process.env.LOG_LEVEL === 'debug') {
    // Avoid logging sensitive info in production request bodies unless specifically configured
    try {
        logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
        logger.warn('Could not stringify request body for logging.');
    }
  }


  // Log outgoing response
  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const { statusCode, statusMessage } = res;
    logger.http(
      `Outgoing Response: ${statusCode} ${statusMessage}; ${method} ${originalUrl}; Duration: ${durationInMilliseconds.toFixed(2)} ms`,
    );
  });

  res.on('error', (err) => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    logger.error(
        `Error on Response: ${err.message}; ${method} ${originalUrl}; Duration: ${durationInMilliseconds.toFixed(2)} ms`,
    );
  });

  next();
};
