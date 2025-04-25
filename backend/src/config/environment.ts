import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define interface for environment variables
interface Environment {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

export const env: Environment = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};