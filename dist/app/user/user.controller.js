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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.registerUser = exports.refreshToken = exports.login = exports.getUserInfo = exports.getUserById = void 0;
const userService = __importStar(require("./user.service"));
const walletService = __importStar(require("../wallet/wallet.service"));
const transactionService = __importStar(require("../transaction/transaction.service"));
const response_helper_1 = require("../common/helper/response.helper");
const email_service_1 = require("../common/services/email.service");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_service_1 = require("../common/services/passport-jwt.service");
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getUserById(req.params.id);
    if (!user) {
        return res.status(404).json((0, response_helper_1.createResponse)(null, "User not found"));
    }
    res.json((0, response_helper_1.createResponse)(user, "User fetched"));
});
exports.getUserById = getUserById;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res.status(401).json((0, response_helper_1.createResponse)(null, "Unauthorized"));
    }
    const user = yield userService.getUserInfo(req.user.id);
    res.json((0, response_helper_1.createResponse)(user, "User info fetched"));
});
exports.getUserInfo = getUserInfo;
const login = (req, res, next) => {
    passport_1.default.authenticate("login", { session: false }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !user) {
            return res
                .status(401)
                .json((0, response_helper_1.createResponse)(false, (info === null || info === void 0 ? void 0 : info.message) || "Unauthorized..."));
        }
        const tokens = (0, passport_jwt_service_1.createUserTokens)(user);
        yield userService.updateUserById(user.id, {
            active: true,
            refreshToken: tokens.refreshToken,
        });
        // 👉 Fetch additional data
        const wallet = yield walletService.getOrCreateWallet(user.id);
        const allUsers = yield userService.getAllUsers(); // Exclude passwords
        const txns = yield transactionService.getUserTransactions(user.id);
        const deposits = yield walletService.getPendingDeposits(user.id); // you define this in service
        const withdrawals = yield walletService.getPendingWithdrawals(user.id); // you define this in service
        return res.json((0, response_helper_1.createResponse)({
            tokens,
            user,
            walletBalance: wallet.balance,
            users: allUsers,
            txns,
            pendingDeposits: deposits,
            pendingWithdrawals: withdrawals,
        }, "Login successful"));
    }))(req, res, next);
};
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    try {
        // 1. Refresh tokens and get the user
        const tokensWithUser = yield userService.refreshAuthToken(refreshToken);
        const { tokens, user } = tokensWithUser;
        // 2. Fetch additional data just like in login
        const wallet = yield walletService.getOrCreateWallet(user.id);
        const allUsers = yield userService.getAllUsers(); // Exclude passwords
        const txns = yield transactionService.getUserTransactions(user.id);
        const deposits = yield walletService.getPendingDeposits(user.id);
        const withdrawals = yield walletService.getPendingWithdrawals(user.id);
        // 3. Respond with the same shape
        return res.json((0, response_helper_1.createResponse)({
            tokens,
            user,
            walletBalance: wallet.balance,
            users: allUsers,
            txns,
            pendingDeposits: deposits,
            pendingWithdrawals: withdrawals,
        }, "Token refreshed"));
    }
    catch (err) {
        res.status(401).json((0, response_helper_1.createResponse)(null, err.message));
    }
});
exports.refreshToken = refreshToken;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userService.createUser(req.body);
    yield (0, email_service_1.sendEmail)({
        to: email,
        subject: "Welcome to Our Service",
        html: `Welcome <a href="#">here</a>.`,
    });
    res.status(201).json((0, response_helper_1.createResponse)(user, "User registered successfully"));
});
exports.registerUser = registerUser;
const getAllUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.getAllUsers();
    res.json((0, response_helper_1.createResponse)(users, "All users fetched"));
});
exports.getAllUser = getAllUser;
