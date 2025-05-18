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

export const AccountService = {
  getAllMechanic,
  getAllUser,
  deactivateMechanic,
  warningMechanic,
};
