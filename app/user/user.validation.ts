import { validate } from "../common/helper/validate.helper";
import {
  loginSchema,
  verifyInvitationSchema,
  changePasswordSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  createUserSchema,
  updateUserSchema,
  editUserSchema,
  refreshTokenSchema,
  socialLoginSchema,
} from "./user.schema";


export const validateLogin = validate(loginSchema);
export const validateVerifyInvitation = validate(verifyInvitationSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateVerifyEmail = validate(verifyEmailSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateCreateUser = validate(createUserSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateEditUser = validate(editUserSchema);
export const validateRefreshToken = validate(refreshTokenSchema);
export const validateSocialLogin = (field: string) => validate(socialLoginSchema(field));
