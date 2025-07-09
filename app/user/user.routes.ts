import express from "express";
// import { registerUser, listUsers } from "./user.controller";
// import { validateCreateUser } from "./user.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { catchError } from "../common/middleware/catch-error.middleware";
import passport from "passport";

const router = express.Router();

router
  .get("/", userController.getAllUser)
  .get("/me", roleAuth(["CANDIDATE", "ADMIN"]), userController.getUserInfo)
  .get("/:id", userController.getUserById)
  .post("/", userValidator.validateCreateUser, catchError, userController.registerUser)
  .post(
    "/register",
    userValidator.validateCreateUser,
    catchError,
    userController.registerUser
  )
  .post(
    "/login",
    userValidator.validateLogin,
    catchError,
    passport.authenticate("login", { session: false }),
    userController.login
  )
  .post(
    "/refresh-token",
    userValidator.validateRefreshToken,
    catchError,
    userController.refreshToken
  );
export default router;
