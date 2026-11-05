import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './user.model.js';
import { AppError } from '../../utils/response.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn }
  );
};

export const register = async ({ name, email, password, role, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('A user with this email address already exists', 409);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || 'customer',
    phone: phone || '',
    isVerified: true,
    isActive: true,
  });

  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token,
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  return user.toJSON();
};

