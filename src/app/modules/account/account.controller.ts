import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AccountService } from "./account.service";

const getAllMechanic = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountService.getAllMechanic(
    req.query,
    req.user as IJwtPayload
  );
  console.log("result", result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic retrieved successfully",
    success: true,
    data: result,
  });
});
const getAllMechanics = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountService.getAllMechanics(
    req.query,
    req.user as IJwtPayload
  );
  console.log("result", result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic retrieved successfully",
    success: true,
    data: result,
  });
});
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountService.getAllUser(
    req.query,
    req.user as IJwtPayload
  );
  console.log("result", result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User retrieved successfully",
    success: true,
    data: result,
  });
});
const deactivateMechanic = catchAsync(async (req: Request, res: Response) => {
  const { mechanicId } = req.params;

  const result = await AccountService.deactivateMechanic(mechanicId);
  console.log("result", result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic deactivate successfully",
    success: true,
    data: result,
  });
});
const warningMechanic = catchAsync(async (req: Request, res: Response) => {
  const { mechanicId } = req.params;
  const { warning } = req.body;
  console.log("warning from", warning);
  const result = await AccountService.warningMechanic(mechanicId, warning);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic warning post successfully",
    success: true,
    data: result,
  });
});

const getAllServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AccountService.getAllService(
      req.query,
      req.user as IJwtPayload
    );
    console.log("result", result);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Mechanic retrieved successfully",
      success: true,
      data: result,
    });
  }
);

const deactivateService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const { isActive } = req.body;
  console.log("status from", isActive);
  const result = await AccountService.deactivateService(serviceId, isActive);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Mechanic deactivate successfully",
    success: true,
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const result = await AccountService.deleteService(serviceId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Service deleted successfully.",
    success: true,
    data: result,
  });
});
const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const result = await AccountService.deleteCustomer(customerId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Customer deleted successfully.",
    success: true,
    data: result,
  });
});

const deactivateCustomer = catchAsync(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const result = await AccountService.deactivateCustomer(customerId);
  console.log(result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Customer deactivate successfully",
    success: true,
    data: result,
  });
});

const appointmentController = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;

    const result = await AccountService.appointmentService(
      query,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Appointments retrieved successfully",
      success: true,
      data: result,
    });
  }
);

const appointmentStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const { status } = req.body;
    console.log("status from", { status });

    const result = await AccountService.appointmentStatus(
      appointmentId as string,
      { status }
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Appointment status updated successfully",
      success: true,
      data: result,
    });
  }
);

const getAllActiveMechanic = catchAsync(async (req, res) => {
  const result = await AccountService.countActiveMechanics(
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Active Mechanic retrieved successfully!",
    data: result,
  });
});
const totalBookedService = catchAsync(async (req, res) => {
  const result = await AccountService.totalBookedService(
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Total Service retrieved successfully!",
    data: result,
  });
});

const totalServicesBooked = catchAsync(async (req: Request, res: Response) => {
  // Call the service with authenticated user
  const result = await AccountService.totalServicesBooked(
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Total Booked retrieved successfully",
    success: true,
    data: result, // The bookings array
  });
});
const getSingleCompanyWithMechanicId = catchAsync(
  async (req: Request, res: Response) => {
    // Call the service with authenticated user
    const { mechanicId } = req.params;
    const result = await AccountService.getSingleCompanyWithMechanicId(
      mechanicId,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Company With Mechanic retrieved successfully",
      success: true,
      data: result,
    });
  }
);
const totalRevenue = catchAsync(async (req: Request, res: Response) => {
  // Call the service with authenticated user
  const result = await AccountService.totalRevenue(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Total Revenue retrieved successfully",
    success: true,
    data: result,
  });
});

export const AccountController = {
  getAllMechanic,
  getAllUser,
  deleteCustomer,
  deactivateMechanic,
  warningMechanic,
  getAllServiceController,
  deleteService,
  deactivateService,
  deactivateCustomer,
  appointmentController,
  appointmentStatusController,
  getAllActiveMechanic,
  totalBookedService,
  totalServicesBooked,
  totalRevenue,
  getAllMechanics,
  getSingleCompanyWithMechanicId,
};
