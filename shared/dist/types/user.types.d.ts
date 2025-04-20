import { z } from 'zod';
export declare enum UserRole {
    BUYER = "buyer",
    SELLER = "seller",
    ADMIN = "admin",
    USER = "user"
}
export declare const UserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    role: UserRole;
    id?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}, {
    email: string;
    name: string;
    role: UserRole;
    id?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginCredentials = z.infer<typeof LoginSchema>;
export declare const RegisterSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
} & {
    password: z.ZodString;
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    role: UserRole;
    password: string;
    address?: string | undefined;
    phone?: string | undefined;
}, {
    email: string;
    name: string;
    role: UserRole;
    password: string;
    address?: string | undefined;
    phone?: string | undefined;
}>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
