import { z } from 'zod';

// Define StatusEnum or import it from the correct module
const StatusEnum = z.enum(['PENDING', 'ACCEPT', 'REJECTED']);
export const bookingValidationSchema = z.object({
  body: z.object({
    service: z
      .string()
      .min(1, { message: 'Service name is required' })
      .max(100, { message: 'Service name must not exceed 100 characters' }),
    amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
    date: z.string().datetime({
      message: 'Invalid date format, use ISO 8601 (e.g., 2025-04-27T00:00:00Z)',
    }),
    location: z
      .string()
      .min(1, { message: 'Location is required' })
      .max(200, { message: 'Location must not exceed 200 characters' }),
    countryCode: z
      .string()
      .min(1, { message: 'Country code is required' })
      .max(10, { message: 'Country code must not exceed 10 characters' }),
    phoneNumber: z
      .string()
      .min(1, { message: 'Phone number is required' })
      .max(20, { message: 'Phone number must not exceed 20 characters' }),
    status: StatusEnum.optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
});
