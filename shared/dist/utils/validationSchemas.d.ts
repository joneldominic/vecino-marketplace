import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodNativeEnum<typeof import("../types/user.types").UserRole>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    role: import("../types/user.types").UserRole;
    id?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}, {
    email: string;
    name: string;
    role: import("../types/user.types").UserRole;
    id?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const signupSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    passwordConfirm: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
    passwordConfirm?: string | undefined;
}, {
    email: string;
    name: string;
    password: string;
    passwordConfirm?: string | undefined;
}>, {
    email: string;
    name: string;
    password: string;
    passwordConfirm?: string | undefined;
}, {
    email: string;
    name: string;
    password: string;
    passwordConfirm?: string | undefined;
}>;
