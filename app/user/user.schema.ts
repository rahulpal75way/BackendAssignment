import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email must be valid"),
  password: z.string().min(1, "Password is required"),
});

export const verifyInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password confirmation does not match password",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(), // validate conditionally in service
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password confirmation does not match password",
  path: ["confirmPassword"],
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Email must be valid"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email must be valid"),
});

export const createUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Email must be valid"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    role: z.enum(["ADMIN", "CANDIDATE", "USER"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match password",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  active: z.boolean(),
});

export const editUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  active: z.boolean().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const socialLoginSchema = (field: string) =>
  z.object({
    [field]: z.string().min(1, `${field} is required`),
  });
