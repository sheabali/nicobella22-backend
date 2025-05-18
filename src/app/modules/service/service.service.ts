import { ServicePricing } from "@prisma/client";
import { ZodError } from "zod";
import { IJwtPayload } from "../../types/auth.type";
import prisma from "../../utils/prisma";

const createService = async (
  payload: ServicePricing,
  authUser: {
    id: string;
    email: string;
    role: string;
  }
) => {
  try {
    // Create the service pricing
    const created = await prisma.servicePricing.create({
      data: {
        mechanicId: authUser.id,
        serviceName: payload.serviceName,
        servicePrice: payload.servicePrice,
      },
    });

    return {
      data: created,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Validation failed.",
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

const getAllService = async () => {
  try {
    const services = await prisma.servicePricing.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: services,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

const getServiceByMechanic = async (authUser: IJwtPayload) => {
  console.log("authUser", authUser);
  try {
    // Check if the user is a mechanic
    if (authUser.role !== "MECHANIC") {
      throw new Error(
        "Unauthorized: Only mechanics can view their service pricing."
      );
    }

    const services = await prisma.servicePricing.findMany({
      where: {
        mechanicId: authUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: services,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
};

export const ServicesPricing = {
  createService,
  getAllService,
  getServiceByMechanic,
};
