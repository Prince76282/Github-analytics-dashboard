import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/github_analytics'),
  GITHUB_TOKEN: z.string().optional().default(''),
  GITHUB_API_BASE_URL: z.string().url().default('https://api.github.com'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid backend environment configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
