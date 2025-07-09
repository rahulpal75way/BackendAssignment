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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTransactionsForAdmin = exports.listUserTransactions = exports.rejectTransaction = exports.approveTransaction = exports.createTransaction = void 0;
const txnService = __importStar(require("./transaction.service"));
const wallet_service_1 = require("../wallet/wallet.service");
const commission_service_1 = require("../commission/commission.service");
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount, type, action, receiverId } = req.body;
        const senderWallet = yield (0, wallet_service_1.getOrCreateWallet)(userId);
        const txn = yield txnService.createTransaction({
            userId,
            amount,
            type,
            action,
            receiverId,
            walletWithdrawalId: ["withdrawal", "transfer"].includes(action)
                ? senderWallet.id
                : undefined,
            walletDepositId: action === "deposit" ? senderWallet.id : undefined,
        });
        res.status(201).json(txn);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.createTransaction = createTransaction;
const approveTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const txn = yield txnService.findTransactionById(id);
        if (!txn)
            return res.status(404).json({ message: "Transaction not found" });
        if (txn.status === "approved")
            return res.json(txn);
        const commissionRate = txn.type === "intl" ? 0.1 : 0.02;
        const commissionAmount = txn.amount * commissionRate;
        const netAmount = txn.amount - commissionAmount;
        if (txn.action === "deposit") {
            yield (0, wallet_service_1.updateWalletBalance)({
                userId: txn.userId,
                amount: netAmount,
                action: "deposit",
            });
        }
        if (txn.action === "withdrawal") {
            yield (0, wallet_service_1.updateWalletBalance)({
                userId: txn.userId,
                amount: txn.amount,
                action: "withdrawal",
            });
        }
        if (txn.action === "transfer" && txn.receiverId) {
            yield (0, wallet_service_1.updateWalletBalance)({
                userId: txn.userId,
                amount: txn.amount,
                action: "withdrawal",
            });
            yield (0, wallet_service_1.updateWalletBalance)({
                userId: txn.receiverId,
                amount: netAmount,
                action: "deposit",
            });
        }
        const updatedTxn = yield txnService.approveTransaction(id);
        yield (0, commission_service_1.createCommission)({
            txnId: id,
            amount: commissionAmount,
            type: txn.action,
        });
        res.json(updatedTxn);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.approveTransaction = approveTransaction;
const rejectTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const txn = yield txnService.rejectTransaction(id);
        res.json(txn);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.rejectTransaction = rejectTransaction;
const listUserTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const txns = yield txnService.getUserTransactions(userId);
        res.json(txns);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.listUserTransactions = listUserTransactions;
const getAllTransactionsForAdmin = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const txns = yield txnService.getAllTransactionsForAdmin();
        res.json(txns);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getAllTransactionsForAdmin = getAllTransactionsForAdmin;
