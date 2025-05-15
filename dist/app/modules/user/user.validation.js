"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({
            required_error: 'first name is required.',
            invalid_type_error: 'Full name must be a string.',
        }),
        lastName: zod_1.z.string({
            required_error: 'last name is required.',
            invalid_type_error: 'Full name must be a string.',
        }),
        email: zod_1.z
            .string({ required_error: 'Email is required.' })
            .email('Invalid email address'),
        password: zod_1.z
            .string({
            required_error: 'Password is required.',
            invalid_type_error: 'Password must be a string.',
        })
            .min(6, 'Password must be at least 6 characters long.'),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z
            .string({
            invalid_type_error: 'Full name must be a string.',
        })
            .optional(),
        profilePic: zod_1.z
            .string({ invalid_type_error: 'Profile picture must be a string' })
            .optional(),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
