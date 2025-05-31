import status from "http-status";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  const result = await UserService.createUserIntoDB(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Please check your email to active your account!",
    data: null,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUserFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users are retrieved successfully!",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req.user as IJwtPayload;

  const result = await UserService.getUserFromDB(user.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  const user = req.user as IJwtPayload;
  const result = await UserService.updateUserIntoDB(user.id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    message: "User updated successfully!",
    success: true,
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  await UserService.deleteUserFromDB(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User deleted successfully!",
    data: null,
  });
});

export const UserController = {
  createUser,
  getAllUser,
  getMe,
  updateUser,
  deleteUser,
};
