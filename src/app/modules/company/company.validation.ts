import { z } from 'zod';

export const companyValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Company name is required'),
    address: z.string().min(1, 'Address is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
    email: z.string().email('Invalid email address'),
  }),
});
