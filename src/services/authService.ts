import jwt from 'jsonwebtoken';
import config from '../utils/config';
import logger from '../utils/logger'; // Import logger

class AuthService {
  generateToken(payload: object): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  async verifyToken(token: string): Promise<object | null> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      return decoded as object;
    } catch (error: any) {
      // Log specific error messages if available
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`JWT verification failed: ${errorMessage} (Token: ${token.substring(0, 15)}...)`);
      return null;
    }
  }

  // Optional: Implement hashPassword and comparePassword later
  // async hashPassword(password: string): Promise<string> { ... }
  // async comparePassword(password: string, hash: string): Promise<boolean> { ... }
}

export default new AuthService();
