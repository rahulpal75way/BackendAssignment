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
exports.getPendingWithdrawals = exports.getPendingDeposits = exports.updateWalletBalance = exports.getOrCreateWallet = exports.createWalletForUser = exports.getWalletByUserId = void 0;
const database_service_1 = __importDefault(require("../common/services/database.service"));
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_service_1.default.wallet.findUnique({
        where: { userId },
        include: { deposits: true, withdrawals: true },
    });
});
exports.getWalletByUserId = getWalletByUserId;
const createWalletForUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return database_service_1.default.wallet.create({
        data: {
            user: { connect: { id: data.userId } },
            balance: 0,
        },
    });
});
exports.createWalletForUser = createWalletForUser;
const getOrCreateWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield database_service_1.default.wallet.findUnique({ where: { userId } });
    return existing !== null && existing !== void 0 ? existing : (0, exports.createWalletForUser)({ userId });
});
exports.getOrCreateWallet = getOrCreateWallet;
const updateWalletBalance = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, exports.getOrCreateWallet)(data.userId);
    const newBalance = data.action === "deposit"
        ? wallet.balance + data.amount
        : wallet.balance - data.amount;
    return database_service_1.default.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
    });
});
exports.updateWalletBalance = updateWalletBalance;
const getPendingDeposits = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_service_1.default.transaction.findMany({
        where: {
            userId,
            action: "deposit",
            status: "pending",
        },
        orderBy: { createdAt: "desc" },
    });
});
exports.getPendingDeposits = getPendingDeposits;
const getPendingWithdrawals = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_service_1.default.transaction.findMany({
        where: {
            userId,
            action: "withdrawal",
            status: "pending",
        },
        orderBy: { createdAt: "desc" },
    });
});
exports.getPendingWithdrawals = getPendingWithdrawals;
