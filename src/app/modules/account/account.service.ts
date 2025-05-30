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

const getAllMechanics = async (query: unknown, authUser: IJwtPayload) => {
  try {
    if (authUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admin can view all mechanics.");
    }

    const builder = new QueryBuilder(
      prisma.user,
      query as Record<string, unknown>
    );

    const mechanics = await builder
      .rawFilter({ role: "MECHANIC" })
      .search(["firstName", "lastName", "email"])
      .filter()
      .sort()
      .paginate()
      .fields()
      .execute();

    const meta = await builder.countTotal();

    // Add service count & revenue to each mechanic
    const mechanicWithStats = await Promise.all(
      mechanics.map(async (mechanic: { mechanicId: string }) => {
        const services = await prisma.booking.findMany({
          where: {
            mechanicId: mechanic.mechanicId,
            status: "ACCEPT", // only completed services
          },
          select: {
            amount: true,
          },
        });
        console.log("services", services);

        const servicesCompleted = services.length;
        const totalRevenue = services.reduce((acc, s) => acc + s.amount, 0);

        return {
          ...mechanic,
          servicesCompleted,
          totalRevenue,
        };
      })
    );

    return {
      success: true,
      data: mechanicWithStats,
      meta,
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

export const getAllUser = async (query: unknown, authUser: IJwtPayload) => {
  try {
    if (authUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admin can view all users.");
    }

    const builder = new QueryBuilder(
      prisma.user,
      query as Record<string, unknown>
    );

    const users = await builder
      .rawFilter({ role: "USER" })
      .search(["firstName", "lastName", "email"])
      .filter()
      .sort()
      .paginate()
      .fields()
      .execute();

    const meta = await builder.countTotal();

    // Add service count & totalSpent for each user
    const usersWithStats = await Promise.all(
      users.map(async (user: { id: string }) => {
        const bookings = await prisma.booking.findMany({
          where: {
            userId: user.id,
            status: "ACCEPT", // Only completed bookings
          },
          select: {
            amount: true,
          },
        });

        const servicesCompleted = bookings.length;
        const totalSpent = bookings.reduce((acc, b) => acc + b.amount, 0);

        return {
          ...user,
          servicesCompleted,
          totalSpent,
        };
      })
    );

    return {
      success: true,
      data: usersWithStats,
      meta,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};
const deactivateMechanic = async (mechanicId: string) => {
  try {
    // Fetch mechanic by ID
    const mechanic = await prisma.user.findUnique({
      where: { id: mechanicId },
    });

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
      data: { isActive: false },
    });
    console.log(updatedMechanic);

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
    const filterData = prisma.servicePricing.findMany({
      where: { isDelete: false },
    });
    console.log("filterData", filterData);

    const queryBuilder = new QueryBuilder(
      prisma.servicePricing,
      query as Record<string, unknown>
    );

    const services = await queryBuilder
      .search(["serviceName"])
      .filter()
      .include({ mechanic: true })
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

const activeService = async (serviceId: string, status: boolean) => {
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
    await prisma.servicePricing.update({
      where: { id: serviceId },
      data: { isDelete: true },
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
  console.log("customer id", customerId);
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id: customerId },
      data: {
        isDelete: true, // assuming this field exists in your Prisma model
      },
    });

    return {
      success: true,
      message: "Customer marked as deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the customer.",
    };
  }
};

const deactivateCustomer = async (customerId: string) => {
  try {
    // Fetch mechanic by ID
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    // console.log("warning", status);

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
      data: { isActive: false },
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

const getSingleCompanyWithMechanicId = async (
  mechanicId: string,
  authUser: IJwtPayload
) => {
  console.log("mechanicId", mechanicId);
  try {
    // Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Authenticated user not found");
    }

    // Find company record(s) for this mechanicId
    const companies = await prisma.company.findMany({
      where: {
        mechanicId: mechanicId,
      },
    });

    if (companies.length === 0) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No companies found for this mechanic"
      );
    }

    return {
      success: true,
      message: "Company details retrieved successfully.",
      data: companies,
    };
  } catch (error) {
    console.error("Error fetching company by mechanic ID:", error);

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve company information"
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
  getAllMechanics,
  getSingleCompanyWithMechanicId,
  activeService,
};
