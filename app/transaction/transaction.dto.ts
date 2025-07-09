// src/transaction/transaction.dto.ts

import { TransactionAction, TransactionType } from "@prisma/client";
import { BaseSchema } from "../common/dto/base.dto";

export interface ITransaction extends BaseSchema {
  id: string;
  referenceId: string | null;
  amount: number;
  type: TransactionType;
  action: TransactionAction;
  status: "pending" | "approved" | "rejected";
  userId: string;
  receiverId?: string | null;
  walletDepositId?: string | null;
  walletWithdrawalId?: string | null;
}

export interface CreateTransactionDTO {
  userId: string;
  amount: number;
  type: TransactionType;
  action: TransactionAction;
  receiverId?: string;
}

export interface CreateCommissionDTO {
  txnId: string;
  amount: number;
  type: TransactionAction;
}
