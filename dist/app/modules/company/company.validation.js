"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyValidationSchema = void 0;
const zod_1 = require("zod");
exports.companyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Company name is required'),
        address: zod_1.z.string().min(1, 'Address is required'),
        country: zod_1.z.string().min(1, 'Country is required'),
        city: zod_1.z.string().min(1, 'City is required'),
        phoneNumber: zod_1.z
            .string()
            .min(10, 'Phone number must be at least 10 digits')
            .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
        email: zod_1.z.string().email('Invalid email address'),
    }),
});
