import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VehicleService } from "./vehicle.service";

// const createPoem = catchAsync(async (req, res) => {
//   if (req.file) {
//     req.body.image = ⁠ /uploads/${req.file.filename} ⁠;
//   }

//   const result = await PoemService.createPoemIntoDB(req.body);

//   sendResponse(res, {
//     statusCode: status.CREATED,
//     message: "Poem created successfully!",
//     data: result,
//   });
// });

const createVehicle = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  console.log("req.file", req.file);

  console.log("aa", req.body);
  const result = await VehicleService.createVehicle(
    req.body,
    // req.file as any, // Ensure type assertion
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
  const result = await VehicleService.getAllVehicle(
    req.user as IJwtPayload,
    req.query
  );
  console.log(req.user);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Vehicle are retrieved succesfully",
    success: true,
    data: result,
  });
});
const getSingleVehicle = catchAsync(async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const authUser = req.user as { userId: string; role: string }; // typed user if available

  const result = await VehicleService.getSingleVehicle(vehicleId, authUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Vehicle retrieved successfully",
    success: true,
    data: result,
  });
});
const deleteVehicleController = catchAsync(
  async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const authUser = req.user as { userId: string; role: string };

    const result = await VehicleService.deleteVehicle(vehicleId, authUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Vehicle deleted successfully",
      success: true,
      data: result,
    });
  }
);

export const VehicleController = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  deleteVehicleController,
};
