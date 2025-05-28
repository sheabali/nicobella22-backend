"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicePricingSchema = void 0;
const zod_1 = require("zod");
exports.servicePricingSchema = zod_1.z.object({
    body: zod_1.z.object({
        serviceName: zod_1.z.string().min(1, "Service name is required"),
        servicePrice: zod_1.z
            .number()
            .nonnegative("Price must be a positive number")
            .default(0.0),
        createdAt: zod_1.z.date().optional(), // Optional as it's auto-set
        updatedAt: zod_1.z.date().optional(), // Optional as it's auto-updated
    }),
});
