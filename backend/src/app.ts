import express, { Express } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { requestLogger } from './middleware/requestLogger.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRoutes } from './routes/health.routes.js';
import { githubRoutes } from './routes/github.routes.js';
import { savedRepositoryRoutes } from './routes/savedRepository.routes.js';

export function createApp(): Express {
  const app = express();

  // Cross-Origin Resource Sharing
  app.use(cors(corsOptions));

  // Request body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Logging
  app.use(requestLogger);

  // Mount API endpoints
  app.use('/api/health', healthRoutes);
  app.use('/api/github', githubRoutes);
  app.use('/api/saved-repositories', savedRepositoryRoutes);

  // Catch unmatched routes
  app.use(notFound);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
