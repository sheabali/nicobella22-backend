import { Vehicle } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";

const createVehicle = async (
  payload: Vehicle,
  authUser: { id: string; role: string; mechanicId?: string; email: string }
) => {
  console.log("aag", authUser);

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

const getAllVehicle = async (authUser: { id: string; email: string }) => {
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

export const VehicleService = {
  createVehicle,
  getAllVehicle,
};
