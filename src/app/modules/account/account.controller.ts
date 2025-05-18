import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AccountService } from "./account.service";

const getAllMechanic = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountService.getAllMechanic(
    req.query,
    req.user as IJwtPayload
  );
  console.log("result", result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic retrieved successfully",
    success: true,
    data: result,
  });
});
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountService.getAllMechanic(
    req.query,
    req.user as IJwtPayload
  );
  console.log("result", result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User retrieved successfully",
    success: true,
    data: result,
  });
});
const deactivateMechanic = catchAsync(async (req: Request, res: Response) => {
  const { mechanicId } = req.params;
  const { isActive } = req.body;
  console.log("status from", isActive);
  const result = await AccountService.deactivateMechanic(mechanicId, isActive);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic deactivate successfully",
    success: true,
    data: result,
  });
});
const warningMechanic = catchAsync(async (req: Request, res: Response) => {
  const { mechanicId } = req.params;
  const { warning } = req.body;
  console.log("warning from", warning);
  const result = await AccountService.warningMechanic(mechanicId, warning);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic warning post successfully",
    success: true,
    data: result,
  });
});

export const AccountController = {
  getAllMechanic,
  getAllUser,
  deactivateMechanic,
  warningMechanic,
};
