import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

// Load config early
import { loadConfig } from "./app/common/helper/config.helper";
loadConfig();

// Import middlewares and services
import errorHandler from "./app/common/middleware/error-handler.middleware";
import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";

// Import routes
import routes from "./app/routes";

// // ✅ Updated path to match your file
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./docs/swagger-output.json"), "utf8")
);

// Extend Express types with IUser (excluding password)
import { type IUser } from "./app/user/user.dto";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: "ADMIN" | "CANDIDATE" | "USER";
    }

    interface Request {
      user?: User;
    }
  }
}

// Setup Express
const port = Number(process.env.PORT) || 5000;
const app: Express = express();

console.log("🚀 Starting server...", port);

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json()); // Redundant but fine
app.use(morgan("dev"));



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// App bootstrap
const initApp = async (): Promise<void> => {
  try {
    await initDB(); // Initialize Prisma connection
    initPassport(); // Setup passport JWT

    app.use("/api", routes);

    app.get("/", (req: Request, res: Response) => {
      res.send({ status: "ok" });
    });

    app.use(errorHandler);

    http.createServer(app).listen(port, () => {
      console.log("🚀 Server is running on port", port);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

// Run the app
void initApp();
