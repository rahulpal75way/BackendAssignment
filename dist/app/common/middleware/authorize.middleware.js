"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const authorize = (...allowedRoles) => (req, res, next) => {
    var _a;
    const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
        return next((0, http_errors_1.default)(403, "Forbidden: You don't have access"));
    }
    next();
};
exports.authorize = authorize;
