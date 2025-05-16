import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { MechanicServices } from './mechanic.service';

// Step 1: Mechanic Registration (Personal Information)
const mechanicRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await MechanicServices.registerService({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Mechanic registration successful',
    success: true,
    data: result,
  });
});

// Step 2: Add Company Information
const addCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await MechanicServices.addCompany({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Company information added successfully',
    success: true,
    data: result,
  });
});

// Step 3: Add Working Days (Handle multiple days)
const createWorkingDays = catchAsync(async (req: Request, res: Response) => {
  const { mechanicId, workingDays } = req.body;

  // Validate input
  if (!mechanicId || !workingDays || !Array.isArray(workingDays)) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Mechanic ID and working days array are required',
      success: false,
      data: null,
    });
    return;
  }

  const result = await MechanicServices.addWorkingDays(mechanicId, workingDays);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Working days created successfully',
    success: true,
    data: result,
  });
});

// Step 4: Add Service Pricing
// const addServicePricing = catchAsync(async (req: Request, res: Response) => {
//   const result = await MechanicServices.addServicePricing({
//     ...req.body,
//   });

//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     message: 'Service pricing added successfully',
//     success: true,
//     data: result,
//   });
// });

// Step 5: Sign-Up Completion
const signUpComplete = catchAsync(async (req: Request, res: Response) => {
  const result = await MechanicServices.signUpComplete({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Mechanic sign-up completed successfully',
    success: true,
    data: result,
  });
});

export const MechanicController = {
  mechanicRegistration,
  addCompany,
  createWorkingDays,

  signUpComplete,
};
