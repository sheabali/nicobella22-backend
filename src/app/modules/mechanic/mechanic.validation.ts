import { z } from 'zod';

export const mechanicRegistrationSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phoneNumber: z
      .string()
      .min(6, 'Phone number is required')
      .regex(/^\+?[0-9]{6,15}$/, 'Invalid phone number'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z
      .string()
      .min(1, 'Zip code is required')
      .regex(/^[A-Za-z0-9\s\-]{3,10}$/, 'Invalid zip code'),
    servicesOffered: z.union([
      z.string().min(1, 'Services offered is required'),
      z
        .array(z.string().min(1))
        .nonempty('At least one service must be offered'),
    ]),
  }),
});

export const workingDayValidationSchema = z.object({
  body: z.object({
    day: z.string({
      required_error: 'Day is required',
    }),
    isClosed: z.boolean({
      required_error: 'isClosed is required',
    }),
    openTime: z.string().optional().nullable(),
    closeTime: z.string().optional().nullable(),
    mechanicId: z
      .string({
        required_error: 'Mechanic ID is required',
      })
      .min(1, 'Mechanic ID cannot be empty'),
  }),
});
