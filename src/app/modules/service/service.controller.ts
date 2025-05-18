import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ServicesPricing } from "./service.service";

const createServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ServicesPricing.createService(
      req.body,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Service Create succesfully",
      success: true,
      data: result,
    });
  }
);

// Get All Booking
const getAllServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ServicesPricing.getAllService();
    console.log("result", result);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Service retrieved successfully",
      success: true,
      data: result,
    });
  }
);

// Get All Booking
const getAllServiceByMechanicController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ServicesPricing.getServiceByMechanic(
      req.user as IJwtPayload
    );
    console.log("result", result);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Service retrieved successfully",
      success: true,
      data: result,
    });
  }
);

export const serviceController = {
  createServiceController,
  getAllServiceController,
  getAllServiceByMechanicController,
};
