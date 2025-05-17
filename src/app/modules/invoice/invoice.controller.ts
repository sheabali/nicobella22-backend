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
      message: "createCompany registration succesfully",
      success: true,
      data: result,
    });
  }
);

export const InvoiceController = {
  createInvoiceController,
};
