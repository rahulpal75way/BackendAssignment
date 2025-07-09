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
exports.getCommissions = exports.createCommission = void 0;
const database_service_1 = __importDefault(require("../common/services/database.service"));
const createCommission = (_a) => __awaiter(void 0, [_a], void 0, function* ({ txnId, amount, type, }) {
    return database_service_1.default.commission.create({
        data: {
            txnId,
            amount,
            type,
        },
    });
});
exports.createCommission = createCommission;
const getCommissions = () => __awaiter(void 0, void 0, void 0, function* () {
    return database_service_1.default.commission.findMany({
        include: { txn: true },
        orderBy: { createdAt: "desc" },
    });
});
exports.getCommissions = getCommissions;
