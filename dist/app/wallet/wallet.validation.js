"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateWallet = void 0;
// src/wallet/wallet.validation.ts
const zod_1 = require("zod");
const validate_helper_1 = require("../common/helper/validate.helper");
const createWalletSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid({ message: "Valid userId is required" }),
});
exports.validateCreateWallet = (0, validate_helper_1.validate)(createWalletSchema);
