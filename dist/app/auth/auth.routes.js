"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_service_1 = require("../common/services/passport-jwt.service");
const response_helper_1 = require("../common/helper/response.helper");
const router = express_1.default.Router();
// Login Route
router.post("/login", (req, res, next) => {
    passport_1.default.authenticate("login", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res
                .status(401)
                .json((0, response_helper_1.createResponse)(false, (info === null || info === void 0 ? void 0 : info.message) || "Unauthorized..."));
        }
        // Generate tokens
        const tokens = (0, passport_jwt_service_1.createUserTokens)(user);
        return res.json((0, response_helper_1.createResponse)(tokens, "Login successful"));
    })(req, res, next);
});
exports.default = router;
