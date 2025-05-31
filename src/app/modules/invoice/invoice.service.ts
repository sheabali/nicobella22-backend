import { Invoice } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import ApiError from "../../errors/ApiError";
import { IJwtPayload } from "../../types/auth.type";
import { UserRole } from "../../types/user.type";
import prisma from "../../utils/prisma";

const createInvoice = async (
  payload: Invoice,
  authUser: {
    id: string;
    email: string;
    role: string;
  }
) => {
  console.log("Authenticated user:", authUser);

  // Optional: role-based access check
  if (authUser.role !== "ADMIN" && authUser.role !== "MECHANIC") {
    throw new Error("Unauthorized to create invoice");
  }

  // Validate input (optional here if already done in controller)

  // Create invoice using Prisma
  const invoice = await prisma.invoice.create({
    data: {
      estimateId: payload.estimateId,
      userId: payload.userId,
      companyId: payload.companyId,
      mechanicId: payload.mechanicId,
      serviceType: payload.serviceType,
      servicePrice: payload.servicePrice,
      date: new Date(payload.date),
      time: payload.time,
      status: payload.status,
    },
  });

  return invoice;
};

const getAllInvoice = async (query: any, authUser: IJwtPayload) => {
  try {
    // Build role-based filter
    const rawFilter: Record<string, any> = {};

    if (authUser.role === UserRole.USER) {
      rawFilter.userId = authUser.id;
    } else if (authUser.role === UserRole.MECHANIC) {
      if (!authUser.id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Mechanic ID is required");
      }
      rawFilter.mechanicId = authUser.id;
    }
    // For ADMIN, no filter needed (they see everything)

    const builder = new QueryBuilder(prisma.invoice, query);

    const invoices = await builder
      .rawFilter(rawFilter) // apply role-based filter
      .filter()
      .search([
        "estimate.estimateId",
        "user.firstName",
        "user.lastName",
        "mechanic.firstName",
        "mechanic.lastName",
      ])
      .sort()
      .paginate()
      .include({
        user: true,
        mechanic: true,
        // estimate: true,
        company: true,
      })
      .execute();

    const meta = await builder.countTotal();

    return {
      success: true,
      data: invoices,
      meta,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching invoices.",
    };
  }
};

const getAllInvoiceRechartData = async (authUser: IJwtPayload) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        mechanicId: authUser.id, // Assuming you want to filter by the authenticated user
      },
      include: {
        user: true,
        // Uncomment the following as needed
        // mechanic: true,
        // estimate: true,
        // company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: invoices,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching invoices.",
    };
  }
};

export const InvoiceService = {
  createInvoice,
  getAllInvoice,
  getAllInvoiceRechartData,
};
