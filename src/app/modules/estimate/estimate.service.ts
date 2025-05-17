import { Estimate, Prisma, Status } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";

const generateEstimateId = async (): Promise<string> => {
  const lastEstimate = await prisma.estimate.findFirst({
    orderBy: { createdAt: "desc" },
    select: { estimateId: true },
  });

  let lastNumber = 0;
  if (lastEstimate?.estimateId) {
    const match = lastEstimate.estimateId.match(/\d+$/);
    if (match) {
      lastNumber = parseInt(match[0]);
    }
  }

  return `EST-${(lastNumber + 1).toString().padStart(5, "0")}`;
};

export const createEstimate = async (
  payload: Omit<
    Estimate,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "user"
    | "mechanic"
    | "invoices"
    | "userEstimates"
  >,
  authUser: { id: string; role: string; email: string }
) => {
  // Optional: check if user exists
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found");
  }

  // Optional: check if mechanic exists
  const mechanic = await prisma.mechanicRegistration.findUnique({
    where: { id: payload.mechanicId },
  });

  if (!mechanic) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Mechanic not found");
  }

  // Generate a unique estimate ID
  const estimateId = await generateEstimateId();

  const newEstimate = await prisma.estimate.create({
    data: {
      estimateId,
      userId: authUser.id,
      mechanicId: payload.mechanicId,
      service: payload.service,
      amount: payload.amount,
      status: payload.status || Status.PENDING,
      date: new Date(payload.date),
    },
  });

  return newEstimate;
};

const getAllEstimate = async (
  query: Record<string, any>,
  authUser: { id: string; role: string }
) => {
  console.log("authUser", authUser);

  // Base filters based on role
  const filters: Prisma.EstimateWhereInput = {};
  if (authUser.role === "USER") {
    filters.userId = authUser.id;
  } else if (authUser.role === "MECHANIC") {
    filters.mechanicId = authUser.id;
  }

  // Initialize builder
  const builder = new QueryBuilder(prisma.estimate, query);

  const estimates = await builder
    .search(["estimateId", "service"])
    .filter()
    .rawFilter(filters)
    .sort()
    .paginate()
    .include({
      user: true,
      mechanic: true,
    })
    .execute();

  const meta = await builder.countTotal();

  return {
    meta,
    data: estimates,
  };
};

const updateEstimateStatus = async (estimateId: string, status: Status) => {
  console.log("Updating estimateId:", estimateId, "to status:", status);

  try {
    const updatedEstimate = await prisma.booking.update({
      where: {
        id: estimateId,
      },
      data: {
        status, // Must be one of: "PENDING", "ACCEPT", "REJECT"
      },
    });

    return updatedEstimate;
  } catch (error: any) {
    console.error("Failed to update estimate status:", error.message);
    throw new Error("Could not update estimate status");
  }
};
export const EstimateService = {
  createEstimate,
  getAllEstimate,
  updateEstimateStatus,
};
