import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import { getDBStatus } from './config/database.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { successResponse } from './utils/response.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  const dbStatus = getDBStatus();
  const isDbHealthy = dbStatus.status === 'connected';

  return successResponse(res, {
    statusCode: isDbHealthy ? 200 : 503,
    message: isDbHealthy
      ? 'FreshFruit Market Backend API is operational'
      : 'FreshFruit Market Backend API is running but database is not connected',
    data: {
      service: 'freshfruit-market-api',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
    },
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

