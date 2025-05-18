import { z } from "zod";

export const servicePricingSchema = z.object({
  body: z.object({
    serviceName: z.string().min(1, "Service name is required"),
    servicePrice: z
      .number()
      .nonnegative("Price must be a positive number")
      .default(0.0),
    createdAt: z.date().optional(), // Optional as it's auto-set
    updatedAt: z.date().optional(), // Optional as it's auto-updated
  }),
});
