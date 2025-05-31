import { Booking, Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";

import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import QueryBuilder from "../../builder/QueryBuilder";
import { IJwtPayload } from "../../types/auth.type";
import { UserRole } from "../../types/user.type";

const generateEstimateId = async (): Promise<string> => {
  const lastBooking = await prisma.booking.findFirst({
    orderBy: { createdAt: "desc" },
    select: { estimateId: true },
  });

  let lastNumber = 0;
  if (lastBooking?.estimateId) {
    const match = lastBooking.estimateId.match(/\d+$/);
    if (match) {
      lastNumber = parseInt(match[0]);
    }
  }

  return `EST-${(lastNumber + 1).toString().padStart(5, "0")}`;
};

const bookingService = async (
  payload: Omit<Booking, "id" | "createdAt" | "updatedAt">,
  p0: IJwtPayload
) => {
  try {
    const {
      userId,
      mechanicId,
      companyId,
      service,
      amount,
      date,
      location,
      countryCode,
      phoneNumber,
    } = payload;

    console.log("booking payload", payload);

    // Validate userId
    if (!userId || !ObjectId.isValid(userId)) {
      throw new ApiError(
        400,
        "Invalid user ID format. Must be a 24-character hexadecimal string."
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError(400, "User ID does not exist");
    }

    // Validate mechanicId
    if (!mechanicId || !ObjectId.isValid(mechanicId)) {
      throw new ApiError(
        400,
        "Invalid mechanic ID format. Must be a 24-character hexadecimal string."
      );
    }
    const mechanic = await prisma.user.findUnique({
      where: { id: mechanicId ?? undefined },
    });
    if (!mechanic) {
      throw new ApiError(400, "Mechanic ID does not exist");
    }

    // Validate companyId
    if (!companyId || !ObjectId.isValid(companyId)) {
      throw new ApiError(
        400,
        "Invalid company ID format. Must be a 24-character hexadecimal string."
      );
    }
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new ApiError(400, "Company ID does not exist");
    }

    // Additional validation for phoneNumber format (optional)
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new ApiError(400, "Invalid phone number format");
    }

    if (user.role == UserRole.MECHANIC) {
      throw new ApiError(403, "Mechanic are not create a booking");
    }

    // Generate a unique estimate ID
    const estimateId = await generateEstimateId();

    // Create new booking
    const newBooking = await prisma.booking.create({
      data: {
        user: { connect: { id: userId } },
        mechanic: { connect: { id: mechanicId } },
        company: { connect: { id: companyId } },
        estimateId,
        service,
        amount,
        date: new Date(date),
        location,
        countryCode,
        phoneNumber,
        status: "PENDING",
      },
    });

    return newBooking;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        400,
        "Validation failed",
        error.errors.map((e) => e.message).join(", ")
      );
    }
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new ApiError(
          400,
          "Invalid reference ID (user, mechanic, or company)"
        );
      }
      if (error.code === "P2023") {
        throw new ApiError(400, "Invalid ID format: Malformed ObjectID");
      }
    }
    console.error("Error creating booking:", error);
    throw new ApiError(500, "Failed to create booking", error.message);
  }
};

const getAllBooking = async (
  query: Record<string, unknown>,
  authUser: { id: string; role: string; mechanicId?: string; email: string }
) => {
  console.log("authUser", authUser);

  try {
    // Validate email
    if (!authUser.email || typeof authUser.email !== "string") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or missing email");
    }

    // Fetch user by email
    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    console.log("user", user);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Validate role
    const validRoles = [UserRole.USER, UserRole.MECHANIC, UserRole.ADMIN];
    if (!validRoles.includes(authUser.role as UserRole)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Invalid role for accessing bookings"
      );
    }

    // Build role-based filter
    const rawFilter: Record<string, any> = {};
    if (authUser.role === UserRole.USER) {
      rawFilter.userId = user.id;
    } else if (authUser.role === UserRole.MECHANIC) {
      if (!authUser.id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Mechanic ID is required");
      }
      rawFilter.mechanicId = user.id;
    }

    const builder = new QueryBuilder(prisma.booking, query);

    const bookings = await builder
      .rawFilter(rawFilter)
      .search(["status", "note"]) // adjust searchable fields as needed
      .filter()
      .sort()
      .paginate()
      .include({
        user: true,
        mechanic: true,
        company: true,
      })
      .execute();

    const meta = await builder.countTotal();
    console.log("Bookings retrieved:", meta);

    return { bookings, meta };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2023"
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid ID format: Malformed ObjectID"
      );
    }

    console.error("❌ Error retrieving bookings:", error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve bookings",
      error.message
    );
  }
};

const RejectEstimates = async (
  query: Record<string, any>,
  authUser: { id: string; role: string }
) => {
  const filters: Prisma.EstimateWhereInput = {
    status: "REJECTED", // filter for rejected only
  };

  // Apply role-based filtering
  if (authUser.role === "USER") {
    filters.userId = authUser.id;
  } else if (authUser.role === "MECHANIC") {
    filters.mechanicId = authUser.id;
  }

  const builder = new QueryBuilder(prisma.booking, query);

  const rejectedEstimates = await builder
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
    data: rejectedEstimates,
  };
};

export const BookingServices = {
  getAllBooking,
  bookingService,
  RejectEstimates,
};
