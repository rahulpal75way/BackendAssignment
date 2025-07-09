import { validate } from "../common/helper/validate.helper";
import { createTransactionSchema, depositTransactionSchema, transferSchema, withdrawTransactionSchema } from "./transaction.schema";


export const validateWithdrawTransaction = validate(withdrawTransactionSchema);
export const validateDepositTransaction = validate(depositTransactionSchema);
export const validateCreateTransaction = validate(createTransactionSchema);
export const validateTransferTransaction = validate(transferSchema);
