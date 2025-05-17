import { Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";

import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { UserRole } from "../../types/user.type";

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
export const bookingService = async (
  payload: Omit<Prisma.BookingCreateInput, "id" | "createdAt" | "updatedAt">,
  authUser: { id: string; role: string; email: string }
) => {
  console.log("authUser", authUser);

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
    } = payload as any;

    const { id } = authUser;

    // Validate userId
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(400, "User ID does not exist");
    console.log("user", user);

    // Validate mechanicId
    if (!ObjectId.isValid(mechanicId)) {
      throw new ApiError(400, "Invalid mechanic ID format");
    }
    const mechanic = await prisma.mechanicRegistration.findUnique({
      where: { id: mechanicId },
    });
    if (!mechanic) throw new ApiError(400, "Mechanic ID does not exist");

    // Validate companyId
    if (!ObjectId.isValid(companyId)) {
      throw new ApiError(400, "Invalid company ID format");
    }
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new ApiError(400, "Company ID does not exist");

    // Validate phone number format
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new ApiError(400, "Invalid phone number format");
    }

    // Generate a unique estimate ID
    const estimateId = await generateEstimateId();

    // Simulate a failure (remove this in production)
    // throw new Error("Simulated failure");

    // Intentionally bad date to trigger error
    const bookingDate = new Date(date); // If invalid, this will fail in Prisma

    // Create new booking
    const newBooking = await prisma.booking.create({
      data: {
        estimateId,
        user: { connect: { id: userId } },
        mechanic: { connect: { id: mechanicId } },
        company: { connect: { id: companyId } },
        service,
        amount,
        date: bookingDate,
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
export const getAllBooking = async (
  query: Record<string, unknown>,
  authUser: { id: string; role: string; mechanicId?: string; email: string }
) => {
  console.log("📨 Authenticated User:", authUser);

  try {
    // 1. Validate email
    if (!authUser.id || typeof authUser.id !== "string") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or missing id");
    }

    // 2. Find user by id
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });
    console.log("✅ User found:", user?.id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // 3. Validate role
    const validRoles = [UserRole.USER, UserRole.MECHANIC, UserRole.ADMIN];
    if (!validRoles.includes(authUser.role as UserRole)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Invalid role for accessing bookings"
      );
    }

    // // 4. Build filter based on role
    let whereClause: Record<string, unknown> = {};

    if (authUser.role === UserRole.USER) {
      whereClause.userId = user.id;
    } else if (authUser.role === UserRole.MECHANIC) {
      if (!authUser.mechanicId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Mechanic ID is required for mechanic role"
        );
      }
      whereClause.mechanicId = authUser.mechanicId;
    }

    console.log("📦 Where clause:", whereClause);

    // 5. Fetch bookings with included relations
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        user: true,
        mechanic: true, // adjust if your relation name is different
        company: true,
      },
    });

    console.log("📋 Bookings retrieved:", bookings.length);
    return { bookings };
  } catch (error: any) {
    console.error("❌ Error retrieving bookings:", error);

    // Handle known Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2023") {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Invalid ID format: Malformed ObjectID"
        );
      }
    }

    // Re-throw custom API errors
    if (error instanceof ApiError) {
      throw error;
    }

    // Fallback internal error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve bookings",
      error.message
    );
  }
};

export const BookingServices = {
  getAllBooking,
  bookingService,
};
