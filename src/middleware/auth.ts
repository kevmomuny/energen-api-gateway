import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'Access token is missing or invalid.' });
    }

    try {
      const userPayload = await authService.verifyToken(token);

      if (userPayload) {
        req.user = userPayload;
        next();
      } else {
        return res.status(403).json({ message: 'Invalid token.' });
      }
    } catch (error) {
      return res.status(403).json({ message: 'Token verification failed.', error });
    }
  } else {
    return res.status(401).json({ message: 'Authorization header is missing.' });
  }
};
