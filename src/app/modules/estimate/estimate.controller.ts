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

const acceptEstimateController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;
    const { estimateId } = req.params;

    const updatedEstimate = await EstimateService.acceptEstimateStatus(
      estimateId
      // status as Status
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Estimate status updated successfully",
      data: updatedEstimate,
    });
  }
);

const rejectEstimateController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;
    const { estimateId } = req.params;
    // const { status } = req.body;

    // if (!status || !["PENDING", "ACCEPT", "REJECT"].includes(status)) {
    //   throw new Error("Invalid or missing status value");
    // }

    const updatedEstimate = await EstimateService.rejectEstimateStatus(
      estimateId
      // status as Status
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Estimate status updated successfully",
      data: updatedEstimate,
    });
  }
);
const totalEstimatesController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;
    console.log("authUser", authUser);

    // const { status } = req.body;

    // if (!status || !["PENDING", "ACCEPT", "REJECT"].includes(status)) {
    //   throw new Error("Invalid or missing status value");
    // }

    const updatedEstimate = await EstimateService.totalEstimates(
      authUser
      // status as Status
    );
    console.log("Total Estimates:", updatedEstimate);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Total Estimates retrieved successfully",
      data: updatedEstimate,
    });
  }
);
const totalEstimatesAcceptedController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;
    const updatedEstimate = await EstimateService.totalEstimatesAccepted(
      authUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Total Estimates Accepted retrieved successfully",
      data: updatedEstimate,
    });
  }
);
const upcomingAppointmentsController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;
    const updatedEstimate = await EstimateService.upcomingAppointments(
      authUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Upcoming appointments retrieved successfully",
      data: updatedEstimate,
    });
  }
);

export const EstimateController = {
  createEstimateController,
  getAllEstimateController,
  rejectEstimateController,
  acceptEstimateController,
  totalEstimatesController,
  totalEstimatesAcceptedController,
  upcomingAppointmentsController,
};
