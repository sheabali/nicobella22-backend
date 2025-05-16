import {
  Company,
  MechanicRegistration,
  User,
  WorkingDay,
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { UserRole } from "../../types/user.type";
import prisma from "../../utils/prisma";
import { createToken } from "../auth/auth.utils";
import { hashPassword } from "../user/user.utils";

// Step 1: Register Mechanic (Personal Information)
const registerService = async (payload: Partial<MechanicRegistration>) => {
  try {
    // Validate required fields
    const requiredFields: (keyof MechanicRegistration)[] = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "country",
      "city",
      "zipCode",
    ];
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `${field} is required`);
      }
    }

    // Check if mechanic already exists by email
    const existingMechanic = await prisma.mechanicRegistration.findFirst({
      where: { email: payload.email },
    });

    if (existingMechanic) {
      throw new ApiError(StatusCodes.CONFLICT, "Mechanic already registered");
    }

    // Hash password if provided
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Password is required");
    }

    // Create MechanicRegistration entry
    const newRegistration = await prisma.mechanicRegistration.create({
      data: {
        firstName: payload.firstName!,
        lastName: payload.lastName!,
        email: payload.email!,
        password: payload.password!,
        phoneNumber: payload.phoneNumber!,
        country: payload.country!,
        city: payload.city!,
        zipCode: payload.zipCode!,
        servicesOffered: payload.servicesOffered || "Oil Change", // Default if not provided
      },
    });

    return newRegistration;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to register mechanic",
      error.stack
    );
  }
};

// Step 2: Add Company Information
const addCompany = async (payload: Partial<Company>) => {
  try {
    // Validate required fields
    const requiredFields: (keyof Company)[] = [
      "name",
      "address",
      "country",
      "city",
      "phoneNumber",
      "email",
      "mechanicId",
    ];
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `${field} is required`);
      }
    }

    // Check if mechanic exists
    if (!payload.mechanicId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "mechanicId is required");
    }
    const mechanicExists = await prisma.mechanicRegistration.findUnique({
      where: { id: payload.mechanicId as string },
    });

    if (!mechanicExists) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Mechanic not found for the given mechanicId"
      );
    }

    // Check if company email already exists
    const existingCompany = await prisma.company.findFirst({
      where: { email: payload.email },
    });

    if (existingCompany) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Company email already registered"
      );
    }

    // Create Company entry
    const newCompany = await prisma.company.create({
      data: {
        name: payload.name!,
        address: payload.address!,
        country: payload.country!,
        city: payload.city!,
        phoneNumber: payload.phoneNumber!,
        email: payload.email!,
        mechanicId: payload.mechanicId!,
      },
    });

    return newCompany;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to add company",
      error.stack
    );
  }
};

// Step 3: Add Working Days (Handle multiple days)
const addWorkingDays = async (
  mechanicId: string,
  workingDays: Partial<WorkingDay>[]
) => {
  try {
    console.log("mechanicEx", mechanicId, workingDays);
    // Validate mechanicId
    if (!mechanicId || !workingDays || !Array.isArray(workingDays)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Mechanic ID and working days array are required"
      );
    }

    // Check if mechanic exists
    const mechanicExists = await prisma.mechanicRegistration.findUnique({
      where: { id: mechanicId },
    });

    if (!mechanicExists) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Mechanic not found for the given mechanicId"
      );
    }

    // Prepare working days data
    const workingDayEntries = workingDays.map((day) => ({
      day: day.day!,
      isClosed: day.isClosed!,
      openTime: day.openTime || null,
      closeTime: day.closeTime || null,
      mechanicId,
    }));

    // Create multiple WorkingDay entries
    await prisma.workingDay.createMany({
      data: workingDayEntries,
    });

    return { message: "Working days added successfully" };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to add working days",
      error.stack
    );
  }
};

// Step 4: Add Service Pricing
// const addServicePricing = async (payload: Partial<ServicePricing>) => {
//   try {
//     // Validate required fields
//     const requiredFields: (keyof ServicePricing)[] = [
//       'service',
//       'amount',
//       'mechanicId',
//     ];
//     for (const field of requiredFields) {
//       if (!payload[field]) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, `${field} is required`);
//       }
//     }

//     // Check if mechanic exists
//     const mechanicExists = await prisma.mechanicRegistration.findUnique({
//       where: { id: payload.mechanicId },
//     });

//     if (!mechanicExists) {
//       throw new ApiError(
//         StatusCodes.NOT_FOUND,
//         'Mechanic not found for the given mechanicId'
//       );
//     }

//     // Create ServicePricing entry
//     const newServicePricing = await prisma.servicePricing.create({
//       data: {
//         service: payload.service!,
//         amount: payload.amount!,
//         mechanicId: payload.mechanicId!,
//       },
//     });

//     return newServicePricing;
//   } catch (error: any) {
//     if (error instanceof ApiError) {
//       throw error;
//     }
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Failed to add service pricing',
//       error.stack
//     );
//   }
// };

// Step 5: Complete Sign-Up
const signUpComplete = async (
  payload: Partial<User> & { mechanicId: string }
) => {
  try {
    // Validate required fields
    const requiredFields: (keyof User)[] = [
      "firstName",
      "lastName",
      "email",
      "password",
    ];
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `${field} is required`);
      }
    }

    if (!payload.mechanicId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Mechanic ID is required");
    }

    // Check if all previous steps are complete
    const mechanic = await prisma.mechanicRegistration.findUnique({
      where: { id: payload.mechanicId },
      include: {
        companies: true,
        workingDays: true,
        // ServicePricing: true,
      },
    });

    if (!mechanic) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Mechanic not found");
    }

    if (!mechanic.companies.length) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Company information is missing"
      );
    }

    if (!mechanic.workingDays.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Working days are missing");
    }

    // if (!mechanic.ServicePricing.length) {
    //   throw new ApiError(StatusCodes.BAD_REQUEST, 'Service pricing is missing');
    // }

    // Check if user already exists
    const isUserExist = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (isUserExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(payload.password!);

    // Create User entry
    const userData = {
      firstName: payload.firstName!,
      lastName: payload.lastName!,
      email: payload.email!,
      profilePic: payload.profilePic ?? "",
      password: hashedPassword,
      isActive: true,
      role: UserRole.MECHANIC,
    };

    const newUser = await prisma.user.create({
      data: userData,
    });

    // Link User to MechanicRegistration
    await prisma.mechanicRegistration.update({
      where: { id: payload.mechanicId },
      data: { users: { connect: { id: newUser.id } } },
    });

    // Generate JWT token
    const jwtPayload = {
      id: payload.id,
      firstName: payload.firstName!,
      lastName: payload.lastName!,
      email: payload.email!,
      profilePic: payload.profilePic ?? "",
      role: UserRole.MECHANIC,
      isActive: true,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwtAccessSecret as string,
      config.jwtAccessExpiresIn as string
    );

    // Optionally send email (uncomment if needed)
    // const confirmLink = `${config.backendUrl}/auth/active/${accessToken}`;
    // await sendEmail(payload.email, undefined, confirmLink);

    return {
      accessToken,
      user: newUser,
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to complete sign-up",
      error.stack
    );
  }
};

export const MechanicServices = {
  registerService,
  addCompany,
  addWorkingDays,

  signUpComplete,
};
