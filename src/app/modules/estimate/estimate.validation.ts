import { z } from "zod";

// Enum for status
export const StatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

// Estimate Zod schema
export const EstimateSchema = z.object({
  mechanicId: z.string().min(1, "Mechanic ID is required"), // ObjectId as string
  service: z.string().min(1, "Service is required"),
  amount: z.number().nonnegative("Amount must be a positive number"),
  status: StatusEnum.optional().default("PENDING"),
  date: z.coerce.date({ required_error: "Date is required" }),
});
