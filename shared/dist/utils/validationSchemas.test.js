"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationSchemas_1 = require("./validationSchemas");
describe('Validation Schemas', () => {
    describe('UserSchema', () => {
        it('should validate a valid user object', () => {
            const validUser = {
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const result = validationSchemas_1.UserSchema.safeParse(validUser);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validUser);
            }
        });
        it('should reject invalid user objects', () => {
            const invalidUsers = [
                {
                    id: '123',
                    email: 'invalid-email', // Invalid email
                    name: 'Test User',
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: '123',
                    email: 'test@example.com',
                    name: '', // Empty name
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: '123',
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'admin2', // Invalid role
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ];
            invalidUsers.forEach(user => {
                const result = validationSchemas_1.UserSchema.safeParse(user);
                expect(result.success).toBe(false);
            });
        });
    });
    describe('loginSchema', () => {
        it('should validate valid login credentials', () => {
            const validCredentials = {
                email: 'test@example.com',
                password: 'Password123!',
            };
            const result = validationSchemas_1.loginSchema.safeParse(validCredentials);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validCredentials);
            }
        });
        it('should reject invalid login credentials', () => {
            const invalidCredentials = [
                { email: 'invalid-email', password: 'Password123!' }, // Invalid email
                { email: 'test@example.com', password: '123' }, // Password too short
                { email: '', password: 'Password123!' }, // Empty email
                { email: 'test@example.com', password: '' }, // Empty password
            ];
            invalidCredentials.forEach(credentials => {
                const result = validationSchemas_1.loginSchema.safeParse(credentials);
                expect(result.success).toBe(false);
            });
        });
    });
    describe('signupSchema', () => {
        it('should validate valid signup data', () => {
            const validSignup = {
                email: 'test@example.com',
                password: 'Password123!',
                name: 'Test User',
            };
            const result = validationSchemas_1.signupSchema.safeParse(validSignup);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validSignup);
            }
        });
        it('should reject invalid signup data', () => {
            const invalidSignups = [
                {
                    email: 'invalid-email',
                    password: 'Password123!',
                    name: 'Test User',
                }, // Invalid email
                {
                    email: 'test@example.com',
                    password: '123',
                    name: 'Test User',
                }, // Password too short
                {
                    email: 'test@example.com',
                    password: 'Password123!',
                    name: '',
                }, // Empty name
                {
                    email: '',
                    password: 'Password123!',
                    name: 'Test User',
                }, // Empty email
                {
                    email: 'test@example.com',
                    password: '',
                    name: 'Test User',
                }, // Empty password
            ];
            invalidSignups.forEach(signup => {
                const result = validationSchemas_1.signupSchema.safeParse(signup);
                expect(result.success).toBe(false);
            });
        });
        it('should require password confirmation if provided', () => {
            // Valid with matching password confirmation
            const validWithConfirmation = {
                email: 'test@example.com',
                password: 'Password123!',
                passwordConfirm: 'Password123!',
                name: 'Test User',
            };
            const validResult = validationSchemas_1.signupSchema.safeParse(validWithConfirmation);
            expect(validResult.success).toBe(true);
            // Invalid with non-matching password confirmation
            const invalidWithConfirmation = {
                email: 'test@example.com',
                password: 'Password123!',
                passwordConfirm: 'DifferentPassword!',
                name: 'Test User',
            };
            const invalidResult = validationSchemas_1.signupSchema.safeParse(invalidWithConfirmation);
            expect(invalidResult.success).toBe(false);
        });
    });
});
//# sourceMappingURL=validationSchemas.test.js.map