import status from "http-status";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserIntoDB(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.CREATED,
    message: "Please check your email to active your account!",
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUserFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Users are retrieved successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (req.file) {
    req.body.profilePic = `/uploads/${req.file.filename}`;
  }

  const result = await UserService.updateUserIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    message: "User updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  await UserService.deleteUserFromDB(userId);

  sendResponse(res, {
    statusCode: status.OK,
    message: "User deleted successfully!",
  });
});

export const UserController = {
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
};
