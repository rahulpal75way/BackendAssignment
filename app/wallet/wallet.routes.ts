// src/wallet/wallet.routes.ts
import express from "express";
import * as walletController from "./wallet.controller";
import * as walletValidator from "./wallet.validation";
import { catchError } from "../common/middleware/catch-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = express.Router();

router
  .get(
    "/:userId",
    roleAuth(["ADMIN", "CANDIDATE", "USER"]),
    walletController.getWallet
  )
  .post(
    "/create",
    roleAuth(["ADMIN", "CANDIDATE", "USER"]),
    walletValidator.validateCreateWallet,
    catchError,
    walletController.createWallet
  );

export default router;
