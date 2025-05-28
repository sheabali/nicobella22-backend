"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceSchema = void 0;
const zod_1 = require("zod");
exports.invoiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        estimateId: zod_1.z.string().length(24, "Invalid estimateId"), // MongoDB ObjectId length
        userId: zod_1.z.string().length(24, "Invalid userId"),
        companyId: zod_1.z.string().length(24, "Invalid companyId"),
        mechanicId: zod_1.z.string().length(24, "Invalid mechanicId"),
        serviceType: zod_1.z.string().min(1, "Service type is required"),
        servicePrice: zod_1.z.number().positive("Service price must be positive"),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
        time: zod_1.z.string().min(1, "Time is required"),
        status: zod_1.z.enum(["PENDING", "ACCEPT", "REJECTED"]),
    }),
});
