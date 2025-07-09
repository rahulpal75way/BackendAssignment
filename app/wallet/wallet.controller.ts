import { Request, Response } from "express";
import * as walletService from "./wallet.service";

export const getWallet = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const wallet = await walletService.getWalletByUserId(userId);
  res.json(wallet);
};

export const createWallet = async (req: Request, res: Response) => {
    const { userId } = req.body;
    console.log("Creating wallet for user:", userId);
  const wallet = await walletService.createWalletForUser({userId});
  res.status(201).json(wallet);
};
