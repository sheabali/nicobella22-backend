import { Invoice } from "@prisma/client";
import prisma from "../../utils/prisma";

const createInvoice = async (
  payload: Invoice,
  authUser: {
    id: string;
    email: string;
    role: string;
  }
) => {
  console.log("Authenticated user:", authUser);

  // Optional: role-based access check
  if (authUser.role !== "ADMIN" && authUser.role !== "MECHANIC") {
    throw new Error("Unauthorized to create invoice");
  }

  // Validate input (optional here if already done in controller)

  // Create invoice using Prisma
  const invoice = await prisma.invoice.create({
    data: {
      estimateId: payload.estimateId,
      userId: payload.userId,
      companyId: payload.companyId,
      mechanicId: payload.mechanicId,
      serviceType: payload.serviceType,
      servicePrice: payload.servicePrice,
      date: new Date(payload.date),
      time: payload.time,
      status: payload.status,
    },
  });

  return invoice;
};

export const InvoiceService = {
  createInvoice,
};
