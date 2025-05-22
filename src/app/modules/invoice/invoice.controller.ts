import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { InvoiceService } from "./invoice.service";

const createInvoiceController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InvoiceService.createInvoice(
      req.body,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Create Invoice succesfully",
      success: true,
      data: result,
    });
  }
);
const getAllInvoiceController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InvoiceService.getAllInvoice(
      req.query, // Pass query params
      req.user as IJwtPayload // Pass authenticated user
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK, // Use 200 OK for retrieval
      message: "Invoices retrieved successfully",
      success: true,
      data: result,
    });
  }
);

export const InvoiceController = {
  createInvoiceController,
  getAllInvoiceController,
};
