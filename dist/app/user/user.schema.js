"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialLoginSchema = exports.refreshTokenSchema = exports.editUserSchema = exports.updateUserSchema = exports.createUserSchema = exports.forgotPasswordSchema = exports.verifyEmailSchema = exports.changePasswordSchema = exports.verifyInvitationSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email must be valid"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.verifyInvitationSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
    password: zod_1.z.string().min(1, "Password is required"),
    confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match password",
    path: ["confirmPassword"],
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().optional(), // validate conditionally in service
    password: zod_1.z.string().min(1, "Password is required"),
    confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match password",
    path: ["confirmPassword"],
});
exports.verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email must be valid"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email must be valid"),
});
exports.createUserSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Email must be valid"),
    password: zod_1.z.string().min(1, "Password is required"),
    confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
    role: zod_1.z.enum(["ADMIN", "CANDIDATE", "USER"]).optional(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match password",
    path: ["confirmPassword"],
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
    active: zod_1.z.boolean(),
});
exports.editUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().optional(),
    active: zod_1.z.boolean().optional(),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, "Refresh token is required"),
});
const socialLoginSchema = (field) => zod_1.z.object({
    [field]: zod_1.z.string().min(1, `${field} is required`),
});
exports.socialLoginSchema = socialLoginSchema;
