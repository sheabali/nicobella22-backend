import { User, UserRole } from "@prisma/client";
import status from "http-status";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";
import { verifyToken } from "../../utils/verifyToken";
import { createToken } from "../auth/auth.utils";
import { hashPassword } from "./user.utils";

const createUserIntoDB = async (payload: User) => {
  console.log("Creating user with payload:", payload);
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new ApiError(status.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const res = await prisma.user.create({
    data: userData,
  });

  const jwtPayload = {
    userId: payload.id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    profilePic: payload.image || "",
    role: UserRole.USER,
    isActive: false,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtAccessExpiresIn as string
  );

  // const confirmLink = `${config.backendUrl}/auth/active/${accessToken}`;

  // await sendEmail(payload?.email, undefined, confirmLink);

  return {
    accessToken,
    res,
  };
};

const getAllUserFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new ApiError(status.NOT_FOUND, "Users not found!");
  }

  return result;
};

const activeAccount = async (token: string) => {
  const decodedToken = verifyToken(token);

  const user = await prisma.user.findUnique({
    where: { email: decodedToken.email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (user.isActive) {
    throw new ApiError(status.BAD_REQUEST, "User already active!");
  }

  await prisma.user.update({
    where: { email: decodedToken.email },
    data: { isActive: true },
  });

  return {
    accessToken: token,
  };
};

const updateUserIntoDB = async (userId: string, payload: Partial<User>) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!payload.image) {
    payload.image = isUserExist.image;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUserFromDB = async (userId: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return null;
};

export const UserService = {
  activeAccount,
  createUserIntoDB,
  getAllUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
