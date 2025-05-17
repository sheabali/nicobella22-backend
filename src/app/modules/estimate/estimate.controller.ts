import { Status } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EstimateService } from "./estimate.service";

const createEstimateController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;

    const result = await EstimateService.createEstimate(req.body, authUser);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Estimate created successfully",
      success: true,
      data: result,
    });
  }
);

export const getAllEstimateController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;

    const result = await EstimateService.getAllEstimate(req.query, authUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Estimates retrieved successfully",
      success: true,
      data: result,
    });
  }
);

const updateEstimateController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;
    const { estimateId } = req.params;
    const { status } = req.body;

    if (!status || !["PENDING", "ACCEPT", "REJECT"].includes(status)) {
      throw new Error("Invalid or missing status value");
    }

    const updatedEstimate = await EstimateService.updateEstimateStatus(
      estimateId,
      status as Status
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Estimate status updated successfully",
      data: updatedEstimate,
    });
  }
);
export const EstimateController = {
  createEstimateController,
  getAllEstimateController,
  updateEstimateController,
};
