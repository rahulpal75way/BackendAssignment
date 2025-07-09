"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransferTransaction = exports.validateCreateTransaction = exports.validateDepositTransaction = exports.validateWithdrawTransaction = void 0;
const validate_helper_1 = require("../common/helper/validate.helper");
const transaction_schema_1 = require("./transaction.schema");
exports.validateWithdrawTransaction = (0, validate_helper_1.validate)(transaction_schema_1.withdrawTransactionSchema);
exports.validateDepositTransaction = (0, validate_helper_1.validate)(transaction_schema_1.depositTransactionSchema);
exports.validateCreateTransaction = (0, validate_helper_1.validate)(transaction_schema_1.createTransactionSchema);
exports.validateTransferTransaction = (0, validate_helper_1.validate)(transaction_schema_1.transferSchema);
