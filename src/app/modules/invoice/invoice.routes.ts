import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { UserRole } from "../../types/user.type";
import { InvoiceController } from "./invoice.controller";
import { invoiceSchema } from "./invoice.validation";

const router = Router();

router.post(
  "/",
  validateRequest(invoiceSchema),
  auth(UserRole.MECHANIC),
  InvoiceController.createInvoiceController
);
// router.get(
//   "/",
//   auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
//   BookingController.getAllBooking
// );

export const InvoiceRoutes = router;
