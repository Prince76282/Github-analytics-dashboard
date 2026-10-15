import { Request, Response } from 'express';
import { getDatabaseStatus } from '../config/database.js';

export const getHealth = (_req: Request, res: Response): void => {
  const dbStatus = getDatabaseStatus();

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        connected: dbStatus.isConnected,
        state: dbStatus.state,
      },
    },
  });
};
