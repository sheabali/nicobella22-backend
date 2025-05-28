"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidationSchema = void 0;
const zod_1 = require("zod");
// Define StatusEnum or import it from the correct module
const StatusEnum = zod_1.z.enum(['PENDING', 'ACCEPT', 'REJECTED']);
exports.bookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        service: zod_1.z
            .string()
            .min(1, { message: 'Service name is required' })
            .max(100, { message: 'Service name must not exceed 100 characters' }),
        amount: zod_1.z.number().min(0.01, { message: 'Amount must be greater than 0' }),
        date: zod_1.z.string().datetime({
            message: 'Invalid date format, use ISO 8601 (e.g., 2025-04-27T00:00:00Z)',
        }),
        location: zod_1.z
            .string()
            .min(1, { message: 'Location is required' })
            .max(200, { message: 'Location must not exceed 200 characters' }),
        countryCode: zod_1.z
            .string()
            .min(1, { message: 'Country code is required' })
            .max(10, { message: 'Country code must not exceed 10 characters' }),
        phoneNumber: zod_1.z
            .string()
            .min(1, { message: 'Phone number is required' })
            .max(20, { message: 'Phone number must not exceed 20 characters' }),
        status: StatusEnum.optional(),
        createdAt: zod_1.z.date().optional(),
        updatedAt: zod_1.z.date().optional(),
    }),
});
