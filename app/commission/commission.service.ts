import prisma from "../common/services/database.service";

export const createCommission = async ({
  txnId,
  amount,
  type,
}: {
  txnId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "transfer";
}) => {
  return prisma.commission.create({
    data: {
      txnId,
      amount,
      type,
    },
  });
};

export const getCommissions = async () => {
  return prisma.commission.findMany({
    include: { txn: true },
    orderBy: { createdAt: "desc" },
  });
};
