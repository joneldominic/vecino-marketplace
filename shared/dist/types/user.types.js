"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = exports.UserSchema = exports.UserRole = void 0;
const zod_1 = require("zod");
// User role enum
var UserRole;
(function (UserRole) {
    UserRole["BUYER"] = "buyer";
    UserRole["SELLER"] = "seller";
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
// User schema for validation
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(2),
    role: zod_1.z.nativeEnum(UserRole),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().or(zod_1.z.date()).optional(),
    updatedAt: zod_1.z.string().or(zod_1.z.date()).optional(),
});
// Auth related types
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.RegisterSchema = exports.UserSchema.extend({
    password: zod_1.z.string().min(6),
}).omit({ id: true, createdAt: true, updatedAt: true });
//# sourceMappingURL=user.types.js.map