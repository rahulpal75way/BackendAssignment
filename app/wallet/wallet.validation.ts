// src/wallet/wallet.validation.ts
import { z } from "zod";
import { validate } from "../common/helper/validate.helper";

const createWalletSchema = z.object({
  userId: z.string().uuid({ message: "Valid userId is required" }),
});

export const validateCreateWallet = validate(createWalletSchema);
