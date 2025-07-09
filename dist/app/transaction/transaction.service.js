"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTransactionsForAdmin = exports.getUserTransactions = exports.rejectTransaction = exports.approveTransaction = exports.findTransactionById = exports.createTransaction = void 0;
const uuid_1 = require("uuid");
const database_service_1 = __importDefault(require("../common/services/database.service"));
const createTransaction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, amount, type, action, receiverId, walletWithdrawalId, walletDepositId, }) {
    const transaction = yield database_service_1.default.transaction.create({
        data: {
            referenceId: (0, uuid_1.v4)(),
            amount,
            type,
            action,
            status: "pending",
            userId,
            receiverId,
            walletWithdrawalId,
            walletDepositId,
        },
    });
    return transaction;
});
exports.createTransaction = createTransaction;
const findTransactionById = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield database_service_1.default.transaction.findUnique({
        where: { id: txnId },
    });
    return transaction;
});
exports.findTransactionById = findTransactionById;
const approveTransaction = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTxn = yield database_service_1.default.transaction.update({
        where: { id: txnId },
        data: { status: "approved" },
    });
    return updatedTxn;
});
exports.approveTransaction = approveTransaction;
const rejectTransaction = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTxn = yield database_service_1.default.transaction.update({
        where: { id: txnId },
        data: { status: "rejected" },
    });
    return updatedTxn;
});
exports.rejectTransaction = rejectTransaction;
const getUserTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield database_service_1.default.transaction.findMany({
        where: {
            OR: [{ userId }, { receiverId: userId }],
        },
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
        },
    });
    return transactions;
});
exports.getUserTransactions = getUserTransactions;
const getAllTransactionsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield database_service_1.default.transaction.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
        },
    });
    return transactions;
});
exports.getAllTransactionsForAdmin = getAllTransactionsForAdmin;
