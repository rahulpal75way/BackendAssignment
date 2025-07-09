"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const logger = {
    info: (message, meta) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || ""),
    error: (message, meta) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta || ""),
};
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    if (!token) {
        logger.error("No token provided", { path: req.path });
        res.status(401).json({ message: "Access token is required" });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET || "your_jwt_secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log(decoded);
        if (typeof decoded !== "object" ||
            !decoded ||
            !("email" in decoded) ||
            !("role" in decoded)) {
            throw new Error("Invalid token payload");
        }
        const { email, role } = decoded;
        logger.info("Token verified successfully", { email, path: req.path });
        req.user = { id: email, role: role };
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            logger.error("Validation failed", {
                errors: errors.array(),
                path: req.path,
            });
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
    catch (error) {
        console.log(error);
        logger.error("Token verification failed", {
            error: error.message,
            path: req.path,
        });
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
