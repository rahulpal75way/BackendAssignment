"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/transaction/transaction.routes.ts
const express_1 = __importDefault(require("express"));
const txnController = __importStar(require("./transaction.controller"));
const txnValidator = __importStar(require("./transaction.validation"));
const role_auth_middleware_1 = require("../common/middleware/role-auth.middleware");
const catch_error_middleware_1 = require("../common/middleware/catch-error.middleware");
const router = express_1.default.Router();
router
    .post("/create", (0, role_auth_middleware_1.roleAuth)(["ADMIN", "CANDIDATE", "USER"]), txnValidator.validateCreateTransaction, catch_error_middleware_1.catchError, txnController.createTransaction)
    .post("/transfer", (0, role_auth_middleware_1.roleAuth)(["USER", "CANDIDATE"]), txnValidator.validateTransferTransaction, catch_error_middleware_1.catchError, txnController.createTransaction)
    .patch("/approve/:id", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), txnController.approveTransaction)
    .patch("/reject/:id", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), txnController.rejectTransaction)
    .get("/user/:userId", (0, role_auth_middleware_1.roleAuth)(["USER", "CANDIDATE"]), txnController.listUserTransactions)
    .post("/deposit", (0, role_auth_middleware_1.roleAuth)(["USER", "CANDIDATE"]), txnValidator.validateDepositTransaction, catch_error_middleware_1.catchError, txnController.createTransaction)
    .post("/withdraw", (0, role_auth_middleware_1.roleAuth)(["USER", "CANDIDATE"]), txnValidator.validateWithdrawTransaction, catch_error_middleware_1.catchError, txnController.createTransaction)
    .get("/admin/all", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), txnController.getAllTransactionsForAdmin);
exports.default = router;
