import { Request, Response } from "express";
import * as commissionService from "./commission.service";

export const listCommissions = async (_req: Request, res: Response) => {
  const data = await commissionService.getCommissions();
  res.json({ success: true, data });
};
