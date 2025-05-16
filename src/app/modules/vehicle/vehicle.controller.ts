import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VehicleService } from "./vehicle.service";

const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const result = await VehicleService.createVehicle(
    req.body,
    req.user as IJwtPayload
  );

  console.log("vehicle", result);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Vehicle created succesfully",
    success: true,
    data: result,
  });
});
const getAllVehicle = catchAsync(async (req: Request, res: Response) => {
  const result = await VehicleService.getAllVehicle(req.user as IJwtPayload);
  console.log(req.user);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Vehicle are retrieved succesfully",
    success: true,
    data: result,
  });
});

export const VehicleController = {
  createVehicle,
  getAllVehicle,
};
