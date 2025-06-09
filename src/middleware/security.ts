import helmet from 'helmet';
import cors from 'cors';

// Helmet middleware for security headers
export const securityHeaders = () => helmet();

// CORS configuration
const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS;
const allowedOrigins = allowedOriginsEnv ? allowedOriginsEnv.split(',') : ['*']; // Default to '*' if not set

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins[0] === '*' || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // If you need to handle cookies or authorization headers
};

export const corsMiddleware = cors(corsOptions);
