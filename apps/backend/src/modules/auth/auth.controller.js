import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { successResponse } from '../../utils/response.js';

export const registerUser = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);

    return successResponse(res, {
      statusCode: 201,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);

    return successResponse(res, {
      statusCode: 200,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user._id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Current user profile retrieved successfully',
      data: { user: profile },
    });
  } catch (error) {
    next(error);
  }
};

