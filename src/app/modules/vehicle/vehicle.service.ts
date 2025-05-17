import { Vehicle } from "@prisma/client";
import ApiError from "../../errors/ApiError";

import { StatusCodes } from "http-status-codes";
import { IImageFiles } from "../../types/imgFile.type";
import prisma from "../../utils/prisma";

const createVehicle = async (
  payload: Vehicle,
  mealImages: IImageFiles,
  authUser: { id: string; role: string; mechanicId?: string; email: string }
) => {
  console.log("aag", payload);

  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
  });

  console.log(user);

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // Optionally check role and mechanicId
  if (authUser.role === "user" && !authUser.id) {
    throw new ApiError(400, "Mechanic ID is required for mechanics");
  }

  const { images } = mealImages;

  if (!images || images.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Vehicle images are required.");
  }

  payload.image = images.map((image) => image.path);

  const newVehicle = await prisma.vehicle.create({
    data: {
      userId: authUser.id,
      vehicleName: payload.vehicleName,
      vehicleMake: payload.vehicleMake,
      vehicleModel: payload.vehicleModel,
      vehicleYear: payload.vehicleYear,
      lastServiceDate: new Date(payload.lastServiceDate),
      image: payload.image,
    },
  });

  console.log("Vehicle created:", newVehicle);
  return newVehicle;
};

const getAllVehicle = async (
  authUser: { id: string; email: string },
  query: unknown
) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: authUser.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw new Error("Failed to fetch vehicles");
  }
};

const getSingleVehicle = async (
  vehicleId: string,
  authUser: { userId: string; role: string }
) => {
  console.log("vehicleId", vehicleId);
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      userId: authUser.userId, // restrict to vehicles owned by the user
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
        },
      },
    },
  });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found or access denied");
  }

  return vehicle;
};

const deleteVehicle = async (
  vehicleId: string,
  authUser: { userId: string; role: string }
) => {
  // First, find the vehicle and make sure it belongs to the user
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });
  console.log("existingVehicle", existingVehicle);

  if (!existingVehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  // Perform the deletion
  await prisma.vehicle.delete({
    where: { id: vehicleId },
  });

  return { message: "Vehicle deleted successfully" };
};

export const VehicleService = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  deleteVehicle,
};
