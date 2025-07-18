"use strict";
// common/services/database.service.ts
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
exports.initDB = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log("✅ Connected to the database (Prisma)");
    }
    catch (error) {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1); // Exit the app if DB fails to connect
    }
});
exports.initDB = initDB;
exports.default = prisma;
