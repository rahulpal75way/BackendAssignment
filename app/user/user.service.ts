// src/user/user.service.ts
import prisma from "../common/services/database.service";
import bcrypt from "bcrypt";
import { CreateUserDTO, IUser } from "./user.dto";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { createUserTokens } from "../common/services/passport-jwt.service";

// GET USER BY ID
export const getUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

// UPDATE USER
export const updateUserById = async (
  id: string,
  data: Partial<
    Pick<IUser, "name" | "email" | "password" | "active" | "refreshToken">
  >
) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return prisma.user.update({
    where: { id },
    data,
  });
};

// GET AUTH USER INFO
export const getUserInfo = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const refreshAuthToken = async (refreshToken: string) => {
  try {
    const payload: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });    

    if (!user || user.refreshToken !== refreshToken) {
      throw createHttpError(401, "Invalid refresh token");
    }

    const tokens = createUserTokens(user);
    await updateUserById(user.id, {
      active: true,
      refreshToken: tokens.refreshToken,
    });
    return {tokens, user};
  } catch (err) {
    throw createHttpError(401, "Invalid or expired refresh token");
  }
};

export const createUser = async (data: CreateUserDTO) => {
  const { name, email, password, role = "CANDIDATE" } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
};

export const getUserByEmail = (
  email: string,
  select?: Partial<Record<keyof IUser, boolean>>
) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      ...(select ?? {}),
      password: true, // make sure password is selected for login
    },
  });
};
