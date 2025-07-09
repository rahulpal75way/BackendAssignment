// src/transaction/transaction.validation.ts
import { z } from "zod";
import { validate } from "../common/helper/validate.helper";

// Shared schema fields
const baseSchema = {
  userId: z.string().uuid(),
  amount: z.number().min(1),
};

// Existing transaction schemas
export const createTransactionSchema = z.object({
  ...baseSchema,
  type: z.enum(["deposit", "withdrawal", "intl"]),
  action: z.enum(["deposit", "withdrawal"]),
});

export const transferSchema = z.object({
  userId: z.string().uuid(),
  receiverId: z.string().uuid(),
  amount: z.number().min(1),
  type: z.enum(["deposit", "withdrawal", "intl", "local"]),
  action: z.literal("transfer"),
});

// ✅ New withdrawal schema using Zod
export const withdrawTransactionSchema = z.object({
  ...baseSchema,
  type: z.literal("withdrawal"),
  action: z.literal("withdrawal"),
});

// ✅ New deposit schema using Zod
export const depositTransactionSchema = z.object({
  ...baseSchema,
  type: z.literal("deposit"),
  action: z.literal("deposit"),
});
