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
exports.getUserByEmail = exports.getAllUsers = exports.createUser = exports.refreshAuthToken = exports.getUserInfo = exports.updateUserById = exports.getUserById = void 0;
// src/user/user.service.ts
const database_service_1 = __importDefault(require("../common/services/database.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_jwt_service_1 = require("../common/services/passport-jwt.service");
// GET USER BY ID
const getUserById = (id) => {
    return database_service_1.default.user.findUnique({ where: { id } });
};
exports.getUserById = getUserById;
// UPDATE USER
const updateUserById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 10);
    }
    return database_service_1.default.user.update({
        where: { id },
        data,
    });
});
exports.updateUserById = updateUserById;
// GET AUTH USER INFO
const getUserInfo = (id) => {
    return database_service_1.default.user.findUnique({ where: { id } });
};
exports.getUserInfo = getUserInfo;
const refreshAuthToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = yield database_service_1.default.user.findUnique({
            where: { id: payload.id },
        });
        if (!user || user.refreshToken !== refreshToken) {
            throw (0, http_errors_1.default)(401, "Invalid refresh token");
        }
        const tokens = (0, passport_jwt_service_1.createUserTokens)(user);
        yield (0, exports.updateUserById)(user.id, {
            active: true,
            refreshToken: tokens.refreshToken,
        });
        return { tokens, user };
    }
    catch (err) {
        throw (0, http_errors_1.default)(401, "Invalid or expired refresh token");
    }
});
exports.refreshAuthToken = refreshAuthToken;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role = "CANDIDATE" } = data;
    const existing = yield database_service_1.default.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error("User already exists with this email");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield database_service_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    return user;
});
exports.createUser = createUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return database_service_1.default.user.findMany({
        select: { id: true, name: true, email: true, role: true },
    });
});
exports.getAllUsers = getAllUsers;
const getUserByEmail = (email, select) => {
    return database_service_1.default.user.findUnique({
        where: { email },
        select: Object.assign(Object.assign({}, (select !== null && select !== void 0 ? select : {})), { password: true }),
    });
};
exports.getUserByEmail = getUserByEmail;
