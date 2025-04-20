import { z } from 'zod';

// User role enum
export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
  USER = 'user', // Add 'user' role for tests
}

// User schema for validation
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.nativeEnum(UserRole),
  address: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

// User type derived from schema
export type User = z.infer<typeof UserSchema>;

// Auth related types
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

export const RegisterSchema = UserSchema.extend({
  password: z.string().min(6),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type RegisterRequest = z.infer<typeof RegisterSchema>;
