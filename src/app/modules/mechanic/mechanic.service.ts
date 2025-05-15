import { MechanicRegistration, User, WorkingDay } from '@prisma/client';
import prisma from '../../utils/prisma';
import ApiError from '../../errors/ApiError';
import { UserRole } from '../../types/user.type';
import { createToken } from '../auth/auth.utils';

import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../user/user.utils';
import config from '../../config';

const registerService = async (payload: MechanicRegistration) => {
  try {
    // Check if mechanic already exists by a unique field
    const existingMechanic = await prisma.mechanicRegistration.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (existingMechanic) {
      throw new ApiError(409, 'Mechanic already registered');
    }

    // Proceed with registration
    const newRegistration = await prisma.mechanicRegistration.create({
      data: payload,
    });

    return newRegistration;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to register mechanic', error.stack);
  }
};

const workingDay = async (payloa: WorkingDay) => {
  try {
    const mechanicExists = await prisma.mechanicRegistration.findUnique({
      where: {
        id: payloa.mechanicId,
      },
    });

    if (!mechanicExists) {
      throw new Error('Mechanic not found for the given mechanicId');
    }

    const newWorkingDay = await prisma.workingDay.create({
      data: {
        day: payloa.day,
        isClosed: payloa.isClosed,
        openTime: payloa.openTime || null,
        closeTime: payloa.closeTime || null,
        mechanicId: payloa.mechanicId,
      },
    });

    return newWorkingDay;
  } catch (error: any) {
    console.error('Failed to create working day:', error);
    throw new Error(
      `Something went wrong while creating working day: ${error.message}`
    );
  }
};

const signUpComplete = async (payload: User) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await hashPassword(payload.password);

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const res = await prisma.user.create({
    data: userData,
  });

  const jwtPayload = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    profilePic: payload.profilePic,
    role: 'USER', // or "ADMIN" if appropriate for mechanics
    isActive: false,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtAccessExpiresIn as string
  );

  // const confirmLink = `${config.backendUrl}/auth/active/${accessToken}`;

  // await sendEmail(payload?.email, undefined, confirmLink);

  return {
    accessToken,
    res,
  };
};

export const MechanicServices = {
  registerService,
  workingDay,
  signUpComplete,
};
