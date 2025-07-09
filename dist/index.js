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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load config early
const config_helper_1 = require("./app/common/helper/config.helper");
(0, config_helper_1.loadConfig)();
// Import middlewares and services
const error_handler_middleware_1 = __importDefault(require("./app/common/middleware/error-handler.middleware"));
const database_service_1 = require("./app/common/services/database.service");
const passport_jwt_service_1 = require("./app/common/services/passport-jwt.service");
// Import routes
const routes_1 = __importDefault(require("./app/routes"));
// // ✅ Updated path to match your file
const swaggerDocument = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "./docs/swagger-output.json"), "utf8"));
// Setup Express
const port = Number(process.env.PORT) || 5000;
const app = (0, express_1.default)();
console.log("🚀 Starting server...", port);
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json()); // Redundant but fine
app.use((0, morgan_1.default)("dev"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// App bootstrap
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_service_1.initDB)(); // Initialize Prisma connection
        (0, passport_jwt_service_1.initPassport)(); // Setup passport JWT
        app.use("/api", routes_1.default);
        app.get("/", (req, res) => {
            res.send({ status: "ok" });
        });
        app.use(error_handler_middleware_1.default);
        http_1.default.createServer(app).listen(port, () => {
            console.log("🚀 Server is running on port", port);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
    }
});
// Run the app
void initApp();
