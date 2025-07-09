import { Request, Response } from "express";
import * as userService from "./user.service";
import * as walletService from "../wallet/wallet.service";
import * as transactionService from "../transaction/transaction.service";
import { createResponse } from "../common/helper/response.helper";
import { sendEmail } from "../common/services/email.service";
import passport from "passport";
import bcrypt from "bcrypt";
import { createUserTokens, decodeToken } from "../common/services/passport-jwt.service";
import createHttpError from "http-errors";

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json(createResponse(null, "User not found"));
  }
  res.json(createResponse(user, "User fetched"));
};

export const getUserInfo = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id ) {
    return res.status(401).json(createResponse(null, "Unauthorized"));
  }
  const user = await userService.getUserInfo(req.user.id);
  res.json(createResponse(user, "User info fetched"));
};

export const login = (req: Request, res: Response, next: any) => {
  passport.authenticate(
    "login",
    { session: false },
    async (err: any, user: any, info: any) => {
      if (err || !user) {
        return res
          .status(401)
          .json(createResponse(false, info?.message || "Unauthorized..."));
      }
      const tokens = createUserTokens(user);
      await userService.updateUserById(user.id, {
        active: true,
        refreshToken: tokens.refreshToken,
      });

      // 👉 Fetch additional data
      const wallet = await walletService.getOrCreateWallet(user.id);
      const allUsers = await userService.getAllUsers(); // Exclude passwords
      const txns = await transactionService.getUserTransactions(user.id);
      const deposits = await walletService.getPendingDeposits(user.id); // you define this in service
      const withdrawals = await walletService.getPendingWithdrawals(user.id); // you define this in service

      return res.json(
        createResponse(
          {
            tokens,
            user,
            walletBalance: wallet.balance,
            users: allUsers,
            txns,
            pendingDeposits: deposits,
            pendingWithdrawals: withdrawals,
          },
          "Login successful"
        )
      );
    }
  )(req, res, next);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    // 1. Refresh tokens and get the user
    const tokensWithUser = await userService.refreshAuthToken(refreshToken);
    const { tokens, user } = tokensWithUser;

    // 2. Fetch additional data just like in login
    const wallet = await walletService.getOrCreateWallet(user.id);
    const allUsers = await userService.getAllUsers(); // Exclude passwords
    const txns = await transactionService.getUserTransactions(user.id);
    const deposits = await walletService.getPendingDeposits(user.id);
    const withdrawals = await walletService.getPendingWithdrawals(user.id);

    // 3. Respond with the same shape
    return res.json(
      createResponse(
        {
          tokens,
          user,
          walletBalance: wallet.balance,
          users: allUsers,
          txns,
          pendingDeposits: deposits,
          pendingWithdrawals: withdrawals,
        },
        "Token refreshed"
      )
    );
  } catch (err: any) {
    res.status(401).json(createResponse(null, err.message));
  }
};


export const registerUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await userService.createUser(req.body);

  await sendEmail({
    to: email,
    subject: "Welcome to Our Service",
    html: `Welcome <a href="#">here</a>.`,
  });

  res.status(201).json(createResponse(user, "User registered successfully"));
};

export const getAllUser = async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(createResponse(users, "All users fetched"));
};
