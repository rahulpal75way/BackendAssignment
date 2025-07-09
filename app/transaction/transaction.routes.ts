// src/transaction/transaction.routes.ts
import express from "express";
import * as txnController from "./transaction.controller";
import * as txnValidator from "./transaction.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = express.Router();

router
  .post(
    "/create",
    roleAuth(["ADMIN", "CANDIDATE", "USER"]),
    txnValidator.validateCreateTransaction,
    catchError,
    txnController.createTransaction
  )
  .post(
    "/transfer",
    roleAuth(["USER", "CANDIDATE"]),
    txnValidator.validateTransferTransaction,
    catchError,
    txnController.createTransaction
  )
  .patch("/approve/:id", roleAuth(["ADMIN"]), txnController.approveTransaction)
  .patch("/reject/:id", roleAuth(["ADMIN"]), txnController.rejectTransaction)
  .get(
    "/user/:userId",
    roleAuth(["USER", "CANDIDATE"]),
    txnController.listUserTransactions
  )
  .post(
    "/deposit",
    roleAuth(["USER", "CANDIDATE"]),
    txnValidator.validateDepositTransaction,
    catchError,
    txnController.createTransaction
  )
  .post(
    "/withdraw",
    roleAuth(["USER", "CANDIDATE"]),
    txnValidator.validateWithdrawTransaction,
    catchError,
    txnController.createTransaction
  )
  .get(
    "/admin/all",
    roleAuth(["ADMIN"]),
    txnController.getAllTransactionsForAdmin
  );

  

export default router;
