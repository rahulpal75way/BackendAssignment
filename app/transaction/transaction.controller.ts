import { Request, Response } from "express";
import * as txnService from "./transaction.service";
import {
  getOrCreateWallet,
  updateWalletBalance,
} from "../wallet/wallet.service";
import { createCommission } from "../commission/commission.service";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, amount, type, action, receiverId } = req.body;

    const senderWallet = await getOrCreateWallet(userId);

    const txn = await txnService.createTransaction({
      userId,
      amount,
      type,
      action,
      receiverId,
      walletWithdrawalId: ["withdrawal", "transfer"].includes(action)
        ? senderWallet.id
        : undefined,
      walletDepositId: action === "deposit" ? senderWallet.id : undefined,
    });

    res.status(201).json(txn);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const approveTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const txn = await txnService.findTransactionById(id);
    if (!txn) return res.status(404).json({ message: "Transaction not found" });
    if (txn.status === "approved") return res.json(txn);

    const commissionRate = txn.type === "intl" ? 0.1 : 0.02;
    const commissionAmount = txn.amount * commissionRate;
    const netAmount = txn.amount - commissionAmount;

    if (txn.action === "deposit") {
      await updateWalletBalance({
        userId: txn.userId,
        amount: netAmount,
        action: "deposit",
      });
    }

    if (txn.action === "withdrawal") {
      await updateWalletBalance({
        userId: txn.userId,
        amount: txn.amount,
        action: "withdrawal",
      });
    }

    if (txn.action === "transfer" && txn.receiverId) {
      await updateWalletBalance({
        userId: txn.userId,
        amount: txn.amount,
        action: "withdrawal",
      });

      await updateWalletBalance({
        userId: txn.receiverId,
        amount: netAmount,
        action: "deposit",
      });
    }

    const updatedTxn = await txnService.approveTransaction(id);

    await createCommission({
      txnId: id,
      amount: commissionAmount,
      type: txn.action,
    });

    res.json(updatedTxn);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const txn = await txnService.rejectTransaction(id);
    res.json(txn);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listUserTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const txns = await txnService.getUserTransactions(userId);
    res.json(txns);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTransactionsForAdmin = async (
  _req: Request,
  res: Response
) => {
  try {
    const txns = await txnService.getAllTransactionsForAdmin();
    res.json(txns);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
