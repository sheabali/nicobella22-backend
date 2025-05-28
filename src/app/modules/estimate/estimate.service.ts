import { Estimate, Prisma, Status } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import ApiError from "../../errors/ApiError";
import { IJwtPayload } from "../../types/auth.type";
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
  const mechanic = await prisma.user.findUnique({
    where: { id: payload.mechanicId ?? undefined },
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

const acceptEstimateStatus = async (estimateId: string) => {
  console.log("Updating estimateId:", estimateId, "to status: ACCEPTED");

  try {
    // Validate the estimate exists
    const estimate = await prisma.booking.findUnique({
      where: { id: estimateId },
    });

    if (!estimate) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Estimate not found");
    }

    // Update the status on the corresponding booking
    const updatedBooking = await prisma.booking.update({
      where: {
        id: estimateId,
      },
      data: {
        status: "ACCEPT",
      },
    });
    console.log("updatedBooking", updatedBooking);

    return updatedBooking;
  } catch (error: any) {
    console.error("Failed to update estimate status:", error);

    // Re-throw original ApiError if it was thrown
    if (error instanceof ApiError) {
      throw error;
    }

    // Throw generic server error otherwise
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Could not update estimate status"
    );
  }
};

const rejectEstimateStatus = async (estimateId: string) => {
  console.log("Updating estimateId:", estimateId, "to status: REJECTED");

  try {
    // Validate the estimate exists
    const estimate = await prisma.booking.findUnique({
      where: { id: estimateId },
    });

    if (!estimate) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Estimate not found");
    }

    // Update the status on the corresponding booking
    const updatedBooking = await prisma.booking.update({
      where: {
        id: estimateId,
      },
      data: {
        status: "REJECTED",
      },
    });

    return updatedBooking;
  } catch (error: any) {
    console.error("Failed to update estimate status:", error);

    // Re-throw original ApiError if it was thrown
    if (error instanceof ApiError) {
      throw error;
    }

    // Throw generic server error otherwise
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Could not update estimate status"
    );
  }
};

const totalEstimates = async (authUser: {
  id: string;
  role: string;
  email: string;
}) => {
  console.log("Calculating total estimates for user:", authUser.id);

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
  });

  console.log("user found:", user);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const filters: Prisma.BookingWhereInput = {};
  if (authUser.role === "USER") {
    filters.userId = user.id;
  } else if (authUser.role === "MECHANIC") {
    filters.mechanicId = user.mechanicId;
  }

  const total = await prisma.booking.count({
    where: filters,
  });
  console.log("Total estimates for user:", authUser.id, "is", total);

  return { total };
};

export const totalEstimatesAccepted = async (authUser: IJwtPayload) => {
  console.log("Calculating total accepted estimates for user:", authUser.id);

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Build filters
  const filters: Prisma.BookingWhereInput = {
    status: "ACCEPT", // Only count accepted bookings
  };

  if (authUser.role === "USER") {
    filters.userId = user.id;
  } else if (authUser.role === "MECHANIC") {
    filters.mechanicId = user.mechanicId || undefined;
  }

  const total = await prisma.booking.count({
    where: filters,
  });

  console.log("Total accepted estimates for user:", authUser.id, "is", total);

  return { total };
};

export const upcomingAppointments = async (authUser: IJwtPayload) => {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
  });
  console.log("user found:", user);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of today

  const filters: any = {
    status: "PENDING",
  };

  if (authUser.role === "USER") {
    filters.userId = user.id;
  } else if (authUser.role === "MECHANIC") {
    filters.mechanicId = user.mechanicId ?? undefined;
  }

  const total = await prisma.booking.count({
    where: filters,
  });
  console.log("a", total);

  console.log(
    "Total upcoming PENDING bookings for user:",
    user.id,
    "is",
    total
  );

  return { total };
};

export const EstimateService = {
  createEstimate,
  getAllEstimate,
  acceptEstimateStatus,
  rejectEstimateStatus,
  totalEstimatesAccepted,
  totalEstimates,
  upcomingAppointments,
};
