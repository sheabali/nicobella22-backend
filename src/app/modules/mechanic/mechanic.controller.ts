import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { MechanicServices } from './mechanic.service';

const mechanicRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await MechanicServices.registerService({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Mechanic registration succesfully',
    success: true,
    data: result,
  });
});

const createWorkingDay = catchAsync(async (req: Request, res: Response) => {
  const result = await MechanicServices.workingDay({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Working Day created succesfully',
    success: true,
    data: result,
  });
});
const signUpComplete = catchAsync(async (req: Request, res: Response) => {
  const result = await MechanicServices.signUpComplete({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Mechanic SignUp Complete succesfully',
    success: true,
    data: result,
  });
});

export const MechanicController = {
  mechanicRegistration,
  createWorkingDay,
  signUpComplete,
};
