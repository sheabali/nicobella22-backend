import prisma from '../../utils/prisma';
import { Company, WorkingDay } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import { Prisma } from '@prisma/client';
import { ObjectId } from 'mongodb';

const companyService = async (payload: Company) => {
  try {
    // Input validation
    if (!payload.name || !payload.email) {
      throw new ApiError(400, 'Name and email are required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      throw new ApiError(400, 'Invalid email format');
    }
    if (
      !payload.address ||
      !payload.country ||
      !payload.city ||
      !payload.phoneNumber
    ) {
      throw new ApiError(
        400,
        'Address, country, city, and phone number are required'
      );
    }

    // Check for existing company by email
    const existingCompany = await prisma.company.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (existingCompany) {
      throw new ApiError(409, 'Company with this email already registered');
    }

    // Validate mechanicId if provided
    if (payload.mechanicId) {
      if (!ObjectId.isValid(payload.mechanicId)) {
        throw new ApiError(
          400,
          'Invalid mechanic ID format. Must be a 24-character hexadecimal string.'
        );
      }
      const mechanic = await prisma.mechanicRegistration.findUnique({
        where: { id: payload.mechanicId },
      });
      if (!mechanic) {
        throw new ApiError(400, 'Mechanic ID does not exist');
      }
    }

    // Create new company
    const newCompany = await prisma.company.create({
      data: {
        name: payload.name,
        address: payload.address,
        country: payload.country,
        city: payload.city,
        phoneNumber: payload.phoneNumber,
        email: payload.email,
        mechanicId: payload.mechanicId ?? null,
      },
    });

    return newCompany;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(409, 'A company with this email already exists');
      }
      if (error.code === 'P2003') {
        throw new ApiError(400, 'Invalid mechanic ID');
      }
      if (error.code === 'P2023') {
        throw new ApiError(400, 'Invalid ID format: Malformed ObjectID');
      }
    }
    console.error('Error registering company:', error);
    throw new ApiError(500, 'Failed to register company', error.message);
  }
};

export const CompanyServices = {
  companyService,
};
