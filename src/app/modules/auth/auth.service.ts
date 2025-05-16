import status from "http-status";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { passwordCompare } from "../../utils/comparePasswords";
import prisma from "../../utils/prisma";
import { sendEmail } from "../../utils/sendEmail";
import { verifyToken } from "../../utils/verifyToken";
import { hashPassword } from "../user/user.utils";
import { createToken } from "./auth.utils";

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

  return null;
};

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!user.isActive) {
    throw new ApiError(status.UNAUTHORIZED, "User is not active!");
  }

  const isPasswordMatched = await passwordCompare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(status.UNAUTHORIZED, "Password is incorrect!");
  }

  const jwtPayload = {
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    email: user.email,
    profilePic: user.profilePic,
    role: user.role,
    isActive: user.isActive,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtAccessExpiresIn as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const isPasswordMatch = await passwordCompare(currentPassword, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(status.UNAUTHORIZED, "Current password is incorrect!");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!user.isActive) {
    throw new ApiError(status.UNAUTHORIZED, "User account is not active!");
  }

  const jwtPayload = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user.id,
    profilePic: user.profilePic,
    role: user.role,
    isActive: user.isActive,
  };
  console.log("jwtPayload", jwtPayload);

  const resetToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtResetPasswordExpiresIn as string
  );

  const resetLink = `${config.backendUrl}/auth/reset-password/${resetToken}`;

  await sendEmail(user.email, resetLink);

  return {
    message: "Password reset link sent to your email.",
  };
};

const resetPassword = async (
  token: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (newPassword !== confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, "Passwords do not match!");
  }

  const decoded = verifyToken(token, config.jwtAccessSecret as string);

  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email: decoded.email },
    data: { password: hashedPassword },
  });

  return {
    message: "Password reset successfully!",
  };
};

export const AuthService = {
  loginUser,
  resetPassword,
  activeAccount,
  changePassword,
  forgotPassword,
};
