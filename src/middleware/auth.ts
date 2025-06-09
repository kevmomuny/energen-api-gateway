import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ message: 'Access token is missing or invalid.' });
      return;
    }

    try {
      const userPayload = await authService.verifyToken(token);

      if (userPayload) {
        req.user = userPayload;
        next();
      } else {
        res.status(403).json({ message: 'Invalid token.' });
        return;
      }
    } catch (error) {
      res.status(403).json({ message: 'Token verification failed.', error });
      return;
    }
  } else {
    res.status(401).json({ message: 'Authorization header is missing.' });
    return;
  }
};
