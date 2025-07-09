
import prisma from "../common/services/database.service";
import {
  IWallet,
  CreateWalletDTO,
  UpdateWalletBalanceDTO,
} from "./wallet.dto";


export const getWalletByUserId = async (userId: string): Promise<IWallet | null> => {
  return prisma.wallet.findUnique({
    where: { userId },
    include: { deposits: true, withdrawals: true },
  });
};


export const createWalletForUser = async (
  data: CreateWalletDTO
): Promise<IWallet> => {
  return prisma.wallet.create({
    data: {
      user: { connect: { id: data.userId } },
      balance: 0,
    },
  });
};


export const getOrCreateWallet = async (userId: string): Promise<IWallet> => {
  const existing = await prisma.wallet.findUnique({ where: { userId } });
  return existing ?? createWalletForUser({ userId });
};


export const updateWalletBalance = async (
  data: UpdateWalletBalanceDTO
): Promise<IWallet> => {
  const wallet = await getOrCreateWallet(data.userId);
  const newBalance =
    data.action === "deposit"
      ? wallet.balance + data.amount
      : wallet.balance - data.amount;

  return prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: newBalance },
  });
};

export const getPendingDeposits = async (userId: string) => {
  return prisma.transaction.findMany({
    where: {
      userId,
      action: "deposit",
      status: "pending",
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getPendingWithdrawals = async (userId: string) => {
  return prisma.transaction.findMany({
    where: {
      userId,
      action: "withdrawal",
      status: "pending",
    },
    orderBy: { createdAt: "desc" },
  });
};

