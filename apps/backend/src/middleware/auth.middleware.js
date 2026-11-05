import jwt from 'jsonwebtoken';
import { User } from '../modules/auth/user.model.js';
import { AppError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Missing or malformed token.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authentication token is required.', 401);
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Token has expired. Please log in again.', 401);
      }
      throw new AppError('Invalid authentication token.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account has been deactivated.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('Forbidden: You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

