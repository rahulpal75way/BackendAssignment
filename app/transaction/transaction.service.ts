import { v4 as uuidv4 } from "uuid";
import prisma from "../common/services/database.service";
import { CreateTransactionDTO, ITransaction } from "./transaction.dto";

export const createTransaction = async ({
  userId,
  amount,
  type,
  action,
  receiverId,
  walletWithdrawalId,
  walletDepositId,
}: CreateTransactionDTO & {
  walletWithdrawalId?: string;
  walletDepositId?: string;
}): Promise<ITransaction> => {
  const transaction = await prisma.transaction.create({
    data: {
      referenceId: uuidv4(),
      amount,
      type,
      action,
      status: "pending",
      userId,
      receiverId,
      walletWithdrawalId,
      walletDepositId,
    },
  });
  return transaction;
};

export const findTransactionById = async (
  txnId: string
): Promise<ITransaction | null> => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: txnId },
  });
  return transaction;
};

export const approveTransaction = async (
  txnId: string
): Promise<ITransaction> => {
  const updatedTxn = await prisma.transaction.update({
    where: { id: txnId },
    data: { status: "approved" },
  });
  return updatedTxn;
};

export const rejectTransaction = async (
  txnId: string
): Promise<ITransaction> => {
  const updatedTxn = await prisma.transaction.update({
    where: { id: txnId },
    data: { status: "rejected" },
  });
  return updatedTxn;
};

export const getUserTransactions = async (
  userId: string
): Promise<ITransaction[]> => {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });
  return transactions;
};

export const getAllTransactionsForAdmin = async (): Promise<ITransaction[]> => {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });
  return transactions;
};
