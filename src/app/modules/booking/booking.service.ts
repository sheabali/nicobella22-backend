import prisma from '../../utils/prisma';
import { Booking } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import { Prisma } from '@prisma/client';
import { ObjectId } from 'mongodb';

import { z } from 'zod';
import { IJwtPayload } from '../../types/auth.type';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserRole } from '../../types/user.type';
import { StatusCodes } from 'http-status-codes';

const bookingService = async (
  payload: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
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

    console.log('booking payload', payload);

    // Validate userId
    if (!ObjectId.isValid(userId)) {
      throw new ApiError(
        400,
        'Invalid user ID format. Must be a 24-character hexadecimal string.'
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError(400, 'User ID does not exist');
    }

    // Validate mechanicId
    if (!ObjectId.isValid(mechanicId)) {
      throw new ApiError(
        400,
        'Invalid mechanic ID format. Must be a 24-character hexadecimal string.'
      );
    }
    const mechanic = await prisma.mechanicRegistration.findUnique({
      where: { id: mechanicId },
    });
    if (!mechanic) {
      throw new ApiError(400, 'Mechanic ID does not exist');
    }

    // Validate companyId
    if (!ObjectId.isValid(companyId)) {
      throw new ApiError(
        400,
        'Invalid company ID format. Must be a 24-character hexadecimal string.'
      );
    }
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new ApiError(400, 'Company ID does not exist');
    }

    // Additional validation for phoneNumber format (optional)
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new ApiError(400, 'Invalid phone number format');
    }

    // Create new booking
    const newBooking = await prisma.booking.create({
      data: {
        user: { connect: { id: userId } },
        mechanic: { connect: { id: mechanicId } },
        company: { connect: { id: companyId } },
        service,
        amount,
        date: new Date(date),
        location,
        countryCode,
        phoneNumber,
        status: 'PENDING',
      },
    });

    return newBooking;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        400,
        'Validation failed',
        error.errors.map((e) => e.message).join(', ')
      );
    }
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new ApiError(
          400,
          'Invalid reference ID (user, mechanic, or company)'
        );
      }
      if (error.code === 'P2023') {
        throw new ApiError(400, 'Invalid ID format: Malformed ObjectID');
      }
    }
    console.error('Error creating booking:', error);
    throw new ApiError(500, 'Failed to create booking', error.message);
  }
};

const getAllBooking = async (
  query: Record<string, unknown>,
  authUser: { userId: string; role: string; mechanicId?: string; email: string }
) => {
  console.log('authUser', authUser.email);

  try {
    // Validate email
    if (!authUser.email || typeof authUser.email !== 'string') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or missing email');
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });
    console.log('user', user?.id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Validate role
    const validRoles = [UserRole.USER, UserRole.MECHANIC, UserRole.ADMIN];
    if (!validRoles.includes(authUser.role as UserRole)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Invalid role for accessing bookings'
      );
    }

    // Define filter based on role
    let whereClause: any = {};

    if (authUser.role === UserRole.USER) {
      // Regular users see only their bookings
      whereClause.userId = user.id;
    } else if (authUser.role === UserRole.MECHANIC) {
      // Mechanics see only bookings assigned to them
      if (!authUser.mechanicId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Mechanic ID is required for mechanic role'
        );
      }
      whereClause.mechanicId = authUser.mechanicId;
    }
    // Admins see all bookings — keep `whereClause` empty

    // Fetch bookings
    const bookings = await prisma.booking.findMany({
      where: whereClause, // Will be empty for Admin = all bookings
      include: {
        user: true,
        mechanic: true,
        company: true,
      },
    });

    return { bookings };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2023') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Invalid ID format: Malformed ObjectID'
        );
      }
    }

    console.error('Error retrieving bookings:', error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to retrieve bookings',
      error.message
    );
  }
};

export const BookingServices = {
  getAllBooking,
  bookingService,
};
