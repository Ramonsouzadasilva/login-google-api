import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().nonempty('Refresh token is required'),
});
