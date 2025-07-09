"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./user/user.routes"));
const wallet_routes_1 = __importDefault(require("./wallet/wallet.routes"));
const transaction_routes_1 = __importDefault(require("./transaction/transaction.routes"));
const commission_routes_1 = __importDefault(require("./commission/commission.routes"));
const router = express_1.default.Router();
router.use("/users", user_routes_1.default);
router.use("/wallets", wallet_routes_1.default);
router.use("/transactions", transaction_routes_1.default);
router.use("/commissions", commission_routes_1.default);
exports.default = router;
