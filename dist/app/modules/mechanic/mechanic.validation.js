"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mechanicRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.mechanicRegistrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1, 'First name is required'),
        lastName: zod_1.z.string().min(1, 'Last name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        phoneNumber: zod_1.z
            .string()
            .min(6, 'Phone number is required')
            .regex(/^\+?[0-9]{6,15}$/, 'Invalid phone number'),
        country: zod_1.z.string().min(1, 'Country is required'),
        city: zod_1.z.string().min(1, 'City is required'),
        zipCode: zod_1.z
            .string()
            .min(1, 'Zip code is required')
            .regex(/^[A-Za-z0-9\s\-]{3,10}$/, 'Invalid zip code'),
        servicesOffered: zod_1.z.union([
            zod_1.z.string().min(1, 'Services offered is required'),
            zod_1.z
                .array(zod_1.z.string().min(1))
                .nonempty('At least one service must be offered'),
        ]),
    }),
});
