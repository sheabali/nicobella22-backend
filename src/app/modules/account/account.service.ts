import { Status } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import ApiError from "../../errors/ApiError";
import { IJwtPayload } from "../../types/auth.type";
import { UserRole } from "../../types/user.type";
import prisma from "../../utils/prisma";

const getAllMechanic = async (query: unknown, authUser: IJwtPayload) => {
  try {
    // Ensure only ADMIN can access
    if (authUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admin can view all mechanics.");
    }

    const builder = new QueryBuilder(
      prisma.user,
      query as Record<string, unknown>
    );

    const mechanics = await builder
      .rawFilter({ role: "MECHANIC" }) // ensure role filtering
      .search(["firstName", "lastName", "email"])
      .filter()
      .sort()
      .paginate()
      .fields()
      .execute();

    const meta = await builder.countTotal();

    return {
      success: true,
      data: mechanics,
      meta, // includes page, limit, total, totalPage
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

export const countActiveMechanics = async (authUser: IJwtPayload) => {
  try {
    // Define filter for active mechanics
    const filters = {
      role: UserRole.MECHANIC,
      isActive: true,
    };

    // Count matching mechanics
    const total = await prisma.user.count({
      where: filters,
    });

    // Log the count along with the requesting user's ID
    console.log("Total active mechanics for user:", authUser.id, "is", total);

    // Return the result
    return { total };
  } catch (error) {
    console.error("Failed to count active mechanics:", error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Could not count active mechanics"
    );
  }
};
const getAllUser = async (query: unknown, authUser: IJwtPayload) => {
  try {
    // Only allow ADMINs to view all users
    if (authUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admin can view all users.");
    }

    // Fetch users who have role = "USER"
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

const deactivateMechanic = async (mechanicId: string, status: boolean) => {
  try {
    // Fetch mechanic by ID
    const mechanic = await prisma.user.findUnique({
      where: { id: mechanicId },
    });

    console.log("warning", status);

    // If not found, throw error early
    if (!mechanic) {
      throw new Error("Mechanic not found.");
    }

    // If role is not MECHANIC, throw error
    if (mechanic.role !== "MECHANIC") {
      throw new Error(
        "Invalid role. Only mechanics can be deactivated via this route."
      );
    }

    // Update isActive status
    const updatedMechanic = await prisma.user.update({
      where: { id: mechanicId },
      data: { isActive: status },
    });

    return {
      success: true,
      data: updatedMechanic,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

const warningMechanic = async (mechanicId: string, warning: string) => {
  try {
    // Check if the mechanic exists and has role = "MECHANIC"
    const mechanic = await prisma.user.findUnique({
      where: { id: mechanicId },
    });

    if (!mechanic || mechanic.role !== "MECHANIC") {
      throw new Error("Mechanic not found or invalid role.");
    }

    // Update mechanic's warning field
    const updatedMechanic = await prisma.user.update({
      where: { id: mechanicId },
      data: {
        warning: warning,
      },
    });

    return {
      data: updatedMechanic,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

const getAllService = async (query: unknown, authUser: IJwtPayload) => {
  try {
    const queryBuilder = new QueryBuilder(
      prisma.servicePricing,
      query as Record<string, unknown>
    );

    const services = await queryBuilder
      .search(["serviceName"])
      .filter()
      .include({ mechanic: true }) // now safely handled
      .sort()
      .paginate()
      .execute();

    const meta = await queryBuilder.countTotal();

    return {
      success: true,
      data: services,
      meta,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching services.",
    };
  }
};

const deactivateService = async (serviceId: string, status: boolean) => {
  try {
    // Fetch mechanic by ID
    const service = await prisma.servicePricing.findUnique({
      where: { id: serviceId },
    });

    // If not found, throw error early
    if (!service) {
      throw new Error("Service not found.");
    }

    // Update isActive status
    const updatedService = await prisma.servicePricing.update({
      where: { id: serviceId },
      data: { isActive: status },
    });

    return {
      success: true,
      data: updatedService,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

const deleteService = async (serviceId: string) => {
  try {
    const existingService = await prisma.servicePricing.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return {
        success: false,
        message: "Service not found.",
      };
    }

    // Delete the service
    await prisma.servicePricing.delete({
      where: { id: serviceId },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the service.",
    };
  }
};

const deleteCustomer = async (customerId: string) => {
  try {
    const existingService = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!existingService) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Delete the service
    await prisma.user.delete({
      where: { id: customerId },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the service.",
    };
  }
};

const deactivateCustomer = async (customerId: string, status: boolean) => {
  try {
    // Fetch mechanic by ID
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    console.log("warning", status);

    // If not found, throw error early
    if (!customer) {
      throw new Error("customer not found.");
    }

    // If role is not MECHANIC, throw error
    if (customer.role !== "USER") {
      throw new Error(
        "Invalid role. Only customer can be deactivated via this route."
      );
    }

    // Update isActive status
    const updatedMechanic = await prisma.user.update({
      where: { id: customerId },
      data: { isActive: status },
    });

    return {
      success: true,
      data: updatedMechanic,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

const appointmentService = async (query: unknown, authUser: IJwtPayload) => {
  try {
    // Ensure only ADMIN can access
    if (authUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admin can view appointments.");
    }

    const queryBuilder = new QueryBuilder(
      prisma.booking,
      query as Record<string, unknown>
    );

    const appointments = await queryBuilder
      .search(["customerName", "mechanicName"])
      .filter()
      .include({
        user: true,
        mechanic: true,
        company: true, // optional, if you want company data as well
      })

      .sort()
      .paginate()
      .execute();

    const meta = await queryBuilder.countTotal();

    return {
      success: true,
      data: appointments,
      meta,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching appointments.",
    };
  }
};

const appointmentStatus = async (
  appointmentId: string,
  {
    status,
  }: {
    status: Status;
  }
) => {
  // Validate new status
  const validStatuses = Object.values(Status);
  if (!validStatuses.includes(status as Status)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Invalid status. Allowed statuses: ${validStatuses.join(", ")}`
    );
  }

  // Find booking
  const booking = await prisma.booking.findUnique({
    where: { id: appointmentId },
  });

  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Appointment not found.");
  }

  // Update status
  const updatedBooking = await prisma.booking.update({
    where: { id: appointmentId },
    data: { status: status as Status },
  });

  return {
    updatedBooking,
  };
};

export const totalBookedService = async (authUser: IJwtPayload) => {
  try {
    // Fetch all service pricing entries
    const services = await prisma.servicePricing.count({
      where: { isActive: false },
    });

    return {
      success: true,
      message: "All services fetched successfully.",
      data: services,
    };
  } catch (error) {
    console.error("Failed to fetch services:", error);

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Could not fetch service list"
    );
  }
};

const totalServicesBooked = async (authUser: IJwtPayload) => {
  // Fetch user by email
  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Count bookings for this user
  const totalBooked = await prisma.booking.count();

  console.log(`Total services booked by user ${user.id}:`, totalBooked);

  return {
    success: true,
    message: "Total booked services fetched successfully.",
    data: { totalBooked },
  };
};

const totalRevenue = async (authUser: IJwtPayload) => {
  try {
    // Fetch user by email
    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Sum up revenue from completed bookings associated with the user
    const result = await prisma.invoice.findMany({
      where: {
        status: "ACCEPT",
      },
    });

    return {
      success: true,
      message: "Total revenue calculated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Failed to calculate total revenue:", error);

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Could not calculate total revenue"
    );
  }
};

export const AccountService = {
  getAllMechanic,
  getAllUser,
  deactivateMechanic,
  warningMechanic,
  getAllService,
  deactivateService,
  deleteCustomer,
  deleteService,
  deactivateCustomer,
  appointmentService,
  appointmentStatus,
  countActiveMechanics,
  totalBookedService,
  totalServicesBooked,
  totalRevenue,
};
