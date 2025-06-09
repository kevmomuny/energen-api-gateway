import { Router, Request, Response, NextFunction } from 'express';
import * as http from 'http';
import { Socket } from 'net';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import routingService from '../services/routingService';
import { authenticateJWT } from '../middleware/auth';
import logger from '../utils/logger'; // Import logger

const router = Router();

// Apply JWT authentication to all /api/v1 routes
router.use('/api/v1', authenticateJWT);

router.use('/api/v1', (req: Request, res: Response, next: NextFunction): void => {
  const targetConfig = routingService.getTargetService(req.originalUrl); // Use originalUrl to match prefix correctly

  if (targetConfig) {
    const proxyOptions: Options = {
      target: targetConfig.targetServiceBaseUrl,
      changeOrigin: true,
      pathRewrite: (path, _req) => {
        // Example: req.originalUrl = '/api/v1/customers/123'
        // targetConfig.pathPrefix = '/api/v1/customers'
        // targetConfig.targetFunctionPath = 'zoho-sync-manager'
        // Rewritten path should be '/zoho-sync-manager/123'

        const remainingPath = path.substring(targetConfig.pathPrefix.length); // Gets '/123'
        const newPath = `/${targetConfig.targetFunctionPath}${remainingPath}`; // Forms '/zoho-sync-manager/123'
        return newPath;
      },
      on: {
        proxyReq: (proxyReq: http.ClientRequest, req: http.IncomingMessage, _res: http.ServerResponse) => {
          // You can add custom headers or modify the request here
          // For example, forward the authenticated user's ID
          const expressReq = req as Request;
          if (expressReq.user && (expressReq.user as any).id) {
            proxyReq.setHeader('X-User-ID', (expressReq.user as any).id);
            logger.debug(`Added X-User-ID ${(expressReq.user as any).id} to proxied request for ${expressReq.originalUrl}`);
          }
          // The requestLogger middleware already logs incoming requests.
          // This log provides more specific proxy context.
          logger.http(`Proxying request: ${expressReq.method} ${expressReq.originalUrl} to ${targetConfig.targetServiceBaseUrl}${proxyReq.path}`);
        },
        proxyRes: (proxyRes: http.IncomingMessage, req: http.IncomingMessage, _res: http.ServerResponse) => {
          // The requestLogger middleware already logs outgoing responses including status code.
          // This log provides more specific proxy context.
          const expressReq = req as Request;
          logger.http(`Received proxy response: ${proxyRes.statusCode} for ${expressReq.originalUrl} from ${targetConfig.targetServiceBaseUrl}`);
          // You can modify the response here if needed
        },
        error: (err: Error, req: http.IncomingMessage, _res: http.ServerResponse | Socket) => {
          const expressReq = req as Request;
          // Check if _res is a Socket or a ServerResponse
          if (_res instanceof http.ServerResponse) {
            const expressRes = _res as Response;
            logger.error(`Proxy error for ${expressReq.method} ${expressReq.originalUrl}: ${err.message}`);
            if (!expressRes.headersSent) {
              // Ensure 'res' is treated as Express.Response
              expressRes.status(500).json({ message: 'Proxy error', error: err.message });
            } else {
              // If headers already sent, it's too late to send a JSON response.
              logger.warn(`Proxy error for ${expressReq.method} ${expressReq.originalUrl} but headers already sent (ServerResponse).`);
            }
          } else {
            // _res is a Socket, headers are definitely not sent.
            logger.error(`Proxy error for ${expressReq.method} ${expressReq.originalUrl} (Socket error): ${err.message}. Socket destroyed.`);
            // The socket is usually destroyed by http-proxy-middleware in this case.
          }
        }
      }
    }; // Semicolon moved here

    createProxyMiddleware(proxyOptions)(req, res, next);
    return;
  } else {
    // If no target service is found for /api/v1/*, return 404
    // This case should ideally not be hit if all /api/v1/* are defined or have a default handler
    if (req.path.startsWith('/api/v1')) {
        res.status(404).json({ message: 'API route not found or not configured for proxying.' });
        return;
    }
    // If the path is not under /api/v1, let other handlers (if any) take care of it.
    next();
  }
});

export default router;
