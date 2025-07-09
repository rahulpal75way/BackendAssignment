import express from "express";
import userRoutes from "./user/user.routes";
import walletRoutes from "./wallet/wallet.routes";
import transactionRoutes from "./transaction/transaction.routes";
import commissionRoutes from "./commission/commission.routes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/wallets", walletRoutes);
router.use("/transactions", transactionRoutes);
router.use("/commissions", commissionRoutes);

export default router;
