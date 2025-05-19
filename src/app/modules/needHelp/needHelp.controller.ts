import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NeedHelpService } from "./needHelp.Service";

const createNeedHelpController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NeedHelpService.createNeedHelp(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Help request submitted successfully.",
      success: true,
      data: result,
    });
  }
);

const getAllNeedHelpController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NeedHelpService.getAllNeedHelp(
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Help request retrieved successfully.",
      success: true,
      data: result,
    });
  }
);

const getSingleHelp = catchAsync(async (req: Request, res: Response) => {
  const { helpId } = req.params;
  //   const authUser = req.user as { userId: string; role: string };

  const result = await NeedHelpService.getSingleHelp(helpId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Vehicle retrieved successfully",
    success: true,
    data: result,
  });
});

export const NeedHelpController = {
  createNeedHelpController,
  getAllNeedHelpController,
  getSingleHelp,
};
