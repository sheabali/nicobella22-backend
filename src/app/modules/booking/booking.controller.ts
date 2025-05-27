import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.bookingService(
    req.body,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Booking created succesfully",
    success: true,
    data: result,
    // Assuming the service returns a meal object
  });
});
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  // Call the service with query and authenticated user
  const result = await BookingServices.getAllBooking(
    req.query,
    req.user as IJwtPayload
  );
  console.log("result", result.meta);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Bookings retrieved successfully",
    success: true,
    data: result.bookings, // The bookings array
    meta: result.meta, // Include pagination metadata
  });
});

export const getRejectedEstimatesController = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;

    const result = await BookingServices.RejectEstimates(req.query, authUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Rejected estimates retrieved successfully",
      success: true,
      data: result,
    });
  }
);

export const BookingController = {
  createBooking,
  getAllBooking,
  getRejectedEstimatesController,
};
