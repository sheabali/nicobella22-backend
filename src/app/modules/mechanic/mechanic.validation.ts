import { z } from 'zod';

// Validation schema for MechanicRegistration (already exists)
export const mechanicRegistrationSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    country: z.string({ required_error: 'Country is required' }),
    city: z.string({ required_error: 'City is required' }),
    zipCode: z.string({ required_error: 'Zip code is required' }),
    servicesOffered: z.string().optional(),
  }),
});

// Validation schema for a single WorkingDay (already exists, but renamed for clarity)
export const singleWorkingDayValidationSchema = z.object({
  day: z.string({ required_error: 'Day is required' }),
  isClosed: z.boolean({ required_error: 'isClosed is required' }),
  openTime: z.string().nullable().optional(),
  closeTime: z.string().nullable().optional(),
  mechanicId: z.string({ required_error: 'Mechanic ID is required' }),
});

// Validation schema for an array of WorkingDays
// export const workingDaysValidationSchema = z.object({
//   body: z.object({
//     workingDays: z.array(singleWorkingDayValidationSchema, {
//       required_error: 'Working days array is required',
//     }),
//   }),
// });

// Validation schema for Company
export const companyValidationSchema = z.object({
  body: z.object({
    mechanicId: z.string({ required_error: 'Mechanic ID is required' }),
    name: z.string({ required_error: 'Company name is required' }),
    address: z.string({ required_error: 'Address is required' }),
    country: z.string({ required_error: 'Country is required' }),
    city: z.string({ required_error: 'City is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
  }),
});

// Validation schema for ServicePricing
export const servicePricingValidationSchema = z.object({
  body: z.object({
    mechanicId: z.string({ required_error: 'Mechanic ID is required' }),
    service: z.string({ required_error: 'Service is required' }),
    amount: z
      .number({ required_error: 'Amount is required' })
      .positive('Amount must be positive'),
  }),
});
