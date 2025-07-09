"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commission_controller_1 = require("./commission.controller");
const role_auth_middleware_1 = require("../common/middleware/role-auth.middleware");
const router = express_1.default.Router();
router.get("/", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), commission_controller_1.listCommissions);
exports.default = router;
