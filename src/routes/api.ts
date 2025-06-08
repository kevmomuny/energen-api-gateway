import { Router, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import routingService from '../services/routingService';
import { authenticateJWT } from '../middleware/auth';
import logger from '../utils/logger'; // Import logger

const router = Router();

// Apply JWT authentication to all /api/v1 routes
router.use('/api/v1', authenticateJWT);

router.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
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
      onProxyReq: (proxyReq, req, res) => {
        // You can add custom headers or modify the request here
        // For example, forward the authenticated user's ID
        if (req.user && req.user.id) {
          proxyReq.setHeader('X-User-ID', req.user.id);
          logger.debug(`Added X-User-ID ${req.user.id} to proxied request for ${req.originalUrl}`);
        }
        // The requestLogger middleware already logs incoming requests.
        // This log provides more specific proxy context.
        logger.http(`Proxying request: ${req.method} ${req.originalUrl} to ${targetConfig.targetServiceBaseUrl}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        // The requestLogger middleware already logs outgoing responses including status code.
        // This log provides more specific proxy context.
        logger.http(`Received proxy response: ${proxyRes.statusCode} for ${req.originalUrl} from ${targetConfig.targetServiceBaseUrl}${proxyRes.req.path}`);
        // You can modify the response here if needed
      },
      onError: (err, req, res) => {
        logger.error(`Proxy error for ${req.method} ${req.originalUrl}: ${err.message}`);
        if (!res.headersSent) {
            // Ensure 'res' is treated as Express.Response
            (res as Response).status(500).json({ message: 'Proxy error', error: err.message });
        } else {
            // If headers already sent, it's too late to send a JSON response.
            // The connection might be terminated by http-proxy-middleware or underlying http server.
            logger.warn(`Proxy error for ${req.method} ${req.originalUrl} but headers already sent.`);
        }
      }
    };

    return createProxyMiddleware(proxyOptions)(req, res, next);
  } else {
    // If no target service is found for /api/v1/*, return 404
    // This case should ideally not be hit if all /api/v1/* are defined or have a default handler
    if (req.path.startsWith('/api/v1')) {
        return res.status(404).json({ message: 'API route not found or not configured for proxying.' });
    }
    // If the path is not under /api/v1, let other handlers (if any) take care of it.
    next();
  }
});

export default router;
