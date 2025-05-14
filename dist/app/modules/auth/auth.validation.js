"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: zod_1.z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z
            .string({ required_error: "Current password is required" })
            .min(6, {
            message: "Current password must be at least 6 characters long",
        }),
        newPassword: zod_1.z
            .string({ required_error: "New password is required" })
            .min(6, { message: "New password must be at least 6 characters long" }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        newPassword: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: zod_1.z.string(),
    })
        .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match!",
        path: ["confirmPassword"],
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    resetPasswordValidationSchema,
    changePasswordValidationSchema,
};
