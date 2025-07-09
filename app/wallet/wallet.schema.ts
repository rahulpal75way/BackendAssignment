import { z } from "zod";

export const depositSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().min(1),
});

export const withdrawalSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().min(1),
});
