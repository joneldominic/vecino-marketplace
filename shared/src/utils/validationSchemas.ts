import { z } from 'zod';
import { UserSchema as OriginalUserSchema } from '../types/user.types';

// Export the UserSchema from user.types.ts
export const UserSchema = OriginalUserSchema;

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Signup schema
export const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirm: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  })
  .refine(
    data => {
      if (data.passwordConfirm) {
        return data.password === data.passwordConfirm;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['passwordConfirm'],
    },
  );
