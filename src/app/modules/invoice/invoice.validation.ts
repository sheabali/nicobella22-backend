import { z } from "zod";

export const invoiceSchema = z.object({
  body: z.object({
    estimateId: z.string().length(24, "Invalid estimateId"), // MongoDB ObjectId length
    userId: z.string().length(24, "Invalid userId"),
    companyId: z.string().length(24, "Invalid companyId"),
    mechanicId: z.string().length(24, "Invalid mechanicId"),
    serviceType: z.string().min(1, "Service type is required"),
    servicePrice: z.number().positive("Service price must be positive"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    time: z.string().min(1, "Time is required"),
    status: z.enum(["PENDING", "ACCEPT", "REJECTED"]),
  }),
});
