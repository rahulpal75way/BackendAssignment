import { BaseSchema } from "../common/dto/base.dto";

export interface IWallet extends BaseSchema {
  id: string;
  balance: number;
  userId: string | null;
}

export interface CreateWalletDTO {
  userId: string;
  balance?: number;
}

export interface UpdateWalletBalanceDTO {
  userId: string;
  amount: number;
  action: "deposit" | "withdrawal";
}
