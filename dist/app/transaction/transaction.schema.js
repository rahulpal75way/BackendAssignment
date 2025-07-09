"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositTransactionSchema = exports.withdrawTransactionSchema = exports.transferSchema = exports.createTransactionSchema = void 0;
// src/transaction/transaction.validation.ts
const zod_1 = require("zod");
// Shared schema fields
const baseSchema = {
    userId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().min(1),
};
// Existing transaction schemas
exports.createTransactionSchema = zod_1.z.object(Object.assign(Object.assign({}, baseSchema), { type: zod_1.z.enum(["deposit", "withdrawal", "intl"]), action: zod_1.z.enum(["deposit", "withdrawal"]) }));
exports.transferSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    receiverId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().min(1),
    type: zod_1.z.enum(["deposit", "withdrawal", "intl", "local"]),
    action: zod_1.z.literal("transfer"),
});
// ✅ New withdrawal schema using Zod
exports.withdrawTransactionSchema = zod_1.z.object(Object.assign(Object.assign({}, baseSchema), { type: zod_1.z.literal("withdrawal"), action: zod_1.z.literal("withdrawal") }));
// ✅ New deposit schema using Zod
exports.depositTransactionSchema = zod_1.z.object(Object.assign(Object.assign({}, baseSchema), { type: zod_1.z.literal("deposit"), action: zod_1.z.literal("deposit") }));
