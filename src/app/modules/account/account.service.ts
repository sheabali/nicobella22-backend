import QueryBuilder from "../../builder/QueryBuilder";
import { IJwtPayload } from "../../types/auth.type";
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
};
