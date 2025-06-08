import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key', // It's crucial to set this in your .env file for production
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h', // Default to 1 hour
  // Add other configurations as needed
  // e.g., DATABASE_URL: process.env.DATABASE_URL
};

export default config;
