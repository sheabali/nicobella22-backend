import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { CompanyServices } from './company.service';

const createCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.companyService({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'createCompany registration succesfully',
    success: true,
    data: result,
  });
});

export const CompanyController = {
  createCompany,
};
