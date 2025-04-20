"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = exports.loginSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
const user_types_1 = require("../types/user.types");
// Export the UserSchema from user.types.ts
exports.UserSchema = user_types_1.UserSchema;
// Login schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
// Signup schema
exports.signupSchema = zod_1.z
    .object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirm: zod_1.z.string().optional(),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
})
    .refine(data => {
    if (data.passwordConfirm) {
        return data.password === data.passwordConfirm;
    }
    return true;
}, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
});
//# sourceMappingURL=validationSchemas.js.map