import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB, disconnectDB } from './config/database.js';

const PORT = parseInt(process.env.PORT || '5000', 10);

let server;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start HTTP Server
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] FreshFruit Backend running on http://localhost:${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error(`[Server] Startup failed: ${error.message}`);
    process.exit(1);
  }
};

const handleShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection at Promise]:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', error);
  process.exit(1);
});

startServer();

