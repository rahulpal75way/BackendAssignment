"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalSchema = exports.depositSchema = void 0;
const zod_1 = require("zod");
exports.depositSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().min(1),
});
exports.withdrawalSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().min(1),
});
