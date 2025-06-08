import { Router, Request, Response } from 'express';
import authService from '../services/authService';
import { validateRequest } from '../middleware/validation';
import { loginSchema } from '../validations/authSchemas';

const router = Router();

// Mock user database
const users = [
  { id: 1, username: 'testuser', password: 'password123' }, // In a real app, passwords should be hashed
];

// Apply validation middleware before the route handler
router.post('/login', validateRequest(loginSchema), (req: Request, res: Response) => {
  // If validation passes, req.body is guaranteed to have username and password
  const { username, password } = req.body;

  // The old check for username/password presence is now handled by Joi
  // if (!username || !password) {
  //   return res.status(400).json({ message: 'Username and password are required.' });
  // }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // In a real app, you would not include the password in the payload
    const userPayload = { id: user.id, username: user.username };
    const token = authService.generateToken(userPayload);
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
});

// Optional: Implement /refresh endpoint later
// router.post('/refresh', (req: Request, res: Response) => { ... });

export default router;
