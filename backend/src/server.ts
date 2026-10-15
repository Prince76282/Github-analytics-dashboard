import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function startServer(): Promise<void> {
  try {
    // Initialize MongoDB connection
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 GitHub Analytics Backend listening on http://localhost:${env.PORT}`);
      console.log(`📡 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Allowed Frontend Origin: ${env.FRONTEND_URL}`);
      if (env.GITHUB_TOKEN) {
        console.log('🔑 Authenticated GitHub API mode active (5,000 req/hr limit).');
      } else {
        console.log('ℹ️ Unauthenticated GitHub API mode active (60 req/hr limit). Consider setting GITHUB_TOKEN.');
      }
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('✅ Server and database connections closed. Bye!');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
