import express from "express";
import { listCommissions } from "./commission.controller";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = express.Router();

router.get("/", roleAuth(["ADMIN"]), listCommissions);

export default router;
