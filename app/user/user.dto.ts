import  Prisma  from "@prisma/client";
import { BaseSchema } from "../common/dto/base.dto";

export type Role = "ADMIN" | "CANDIDATE" | "USER";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password?: string;
  role: Role;
  active?: boolean;
  blocked?: boolean;
  refreshToken?: string | null;
  provider?: Prisma.ProviderType | null;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "CANDIDATE"| "USER";
}

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}
