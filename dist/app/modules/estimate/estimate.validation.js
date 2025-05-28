"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateSchema = exports.StatusEnum = void 0;
const zod_1 = require("zod");
// Enum for status
exports.StatusEnum = zod_1.z.enum(["PENDING", "APPROVED", "REJECTED"]);
// Estimate Zod schema
exports.EstimateSchema = zod_1.z.object({
    mechanicId: zod_1.z.string().min(1, "Mechanic ID is required"), // ObjectId as string
    service: zod_1.z.string().min(1, "Service is required"),
    amount: zod_1.z.number().nonnegative("Amount must be a positive number"),
    status: exports.StatusEnum.optional().default("PENDING"),
    date: zod_1.z.coerce.date({ required_error: "Date is required" }),
});
