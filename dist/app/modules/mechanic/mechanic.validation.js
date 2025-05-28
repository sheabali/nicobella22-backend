"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicePricingValidationSchema = exports.companyValidationSchema = exports.singleWorkingDayValidationSchema = exports.mechanicRegistrationSchema = void 0;
const zod_1 = require("zod");
// Validation schema for MechanicRegistration (already exists)
exports.mechanicRegistrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({ required_error: 'First name is required' }),
        lastName: zod_1.z.string({ required_error: 'Last name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format'),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters'),
        phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
        country: zod_1.z.string({ required_error: 'Country is required' }),
        city: zod_1.z.string({ required_error: 'City is required' }),
        zipCode: zod_1.z.string({ required_error: 'Zip code is required' }),
        servicesOffered: zod_1.z.string().optional(),
    }),
});
// Validation schema for a single WorkingDay (already exists, but renamed for clarity)
exports.singleWorkingDayValidationSchema = zod_1.z.object({
    day: zod_1.z.string({ required_error: 'Day is required' }),
    isClosed: zod_1.z.boolean({ required_error: 'isClosed is required' }),
    openTime: zod_1.z.string().nullable().optional(),
    closeTime: zod_1.z.string().nullable().optional(),
    mechanicId: zod_1.z.string({ required_error: 'Mechanic ID is required' }),
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
exports.companyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        mechanicId: zod_1.z.string({ required_error: 'Mechanic ID is required' }),
        name: zod_1.z.string({ required_error: 'Company name is required' }),
        address: zod_1.z.string({ required_error: 'Address is required' }),
        country: zod_1.z.string({ required_error: 'Country is required' }),
        city: zod_1.z.string({ required_error: 'City is required' }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format'),
    }),
});
// Validation schema for ServicePricing
exports.servicePricingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        mechanicId: zod_1.z.string({ required_error: 'Mechanic ID is required' }),
        service: zod_1.z.string({ required_error: 'Service is required' }),
        amount: zod_1.z
            .number({ required_error: 'Amount is required' })
            .positive('Amount must be positive'),
    }),
});
