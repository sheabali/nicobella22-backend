import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { StatusCodes } from 'http-status-codes';

const activeAccount = catchAsync(async (req, res) => {
  const { token } = req.params;
  console.log(token);

  const result = await AuthService.activeAccount(token);

  res.redirect('/verified-success');

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User account activated successfully!',
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: 'User logged in successfully!',
    success: true,
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  await AuthService.changePassword(userId, currentPassword, newPassword);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User password changed successfully!',
    success: true,
    data: null,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    statusCode: status.OK,
    message: result.message,
    success: true,
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const result = await AuthService.resetPassword(
    token,
    newPassword,
    confirmPassword
  );

  sendResponse(res, {
    statusCode: status.OK,
    message: result.message,
    success: true,
    data: result,
  });
});

export const AuthController = {
  login,
  activeAccount,
  resetPassword,
  forgotPassword,
  changePassword,
};
